<?php

namespace App\Http\Controllers;

use App\Models\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Exception;

class RouteController extends Controller
{
    /**
     * Dashboard page
     */
    public function index()
    {
        return Inertia::render('Dashboard', [
            'routes' => Route::where('user_id', auth()->id())
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Store a new route
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_location' => 'required|string|max:500',
            'end_location'   => 'required|string|max:500',
        ]);

        try {
            $startCoords = $this->geocodeLocation($validated['start_location']);
            $endCoords   = $this->geocodeLocation($validated['end_location']);

            $url = "https://router.project-osrm.org/route/v1/driving/{$startCoords['lng']},{$startCoords['lat']};{$endCoords['lng']},{$endCoords['lat']}?overview=full&geometries=geojson";
            $response = file_get_contents($url);
            $data = json_decode($response, true);

            $path = [];
            if ($data && $data['code'] === 'Ok') {
                $path = $data['routes'][0]['geometry']['coordinates'];
            }

            Route::create([
                'user_id'           => auth()->id(),
                'start_location'    => $validated['start_location'],
                'end_location'      => $validated['end_location'],
                'start_lat'         => $startCoords['lat'],
                'start_lng'         => $startCoords['lng'],
                'end_lat'           => $endCoords['lat'],
                'end_lng'           => $endCoords['lng'],
                'path_coordinates'  => $path,
            ]);

            return Redirect::back()
                ->with('success', 'Route added successfully.');

        } catch (Exception $e) {
            Log::error('Route creation failed: ' . $e->getMessage());

            return Redirect::back()
                ->withErrors(['route' => $e->getMessage()]);
        }
    }

    /**
     * Update an existing route
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'start_location' => 'required|string|max:500',
            'end_location'   => 'required|string|max:500',
        ]);

        try {
            // Find the route and verify ownership
            $route = Route::where('id', $id)
                ->where('user_id', auth()->id())
                ->firstOrFail();

            // Geocode new locations
            $startCoords = $this->geocodeLocation($validated['start_location']);
            $endCoords   = $this->geocodeLocation($validated['end_location']);

            // Get new route path from OSRM
            $url = "https://router.project-osrm.org/route/v1/driving/{$startCoords['lng']},{$startCoords['lat']};{$endCoords['lng']},{$endCoords['lat']}?overview=full&geometries=geojson";
            $response = file_get_contents($url);
            $data = json_decode($response, true);

            $path = [];
            if ($data && $data['code'] === 'Ok') {
                $path = $data['routes'][0]['geometry']['coordinates'];
            }

            // Update the route
            $route->update([
                'start_location'    => $validated['start_location'],
                'end_location'      => $validated['end_location'],
                'start_lat'         => $startCoords['lat'],
                'start_lng'         => $startCoords['lng'],
                'end_lat'           => $endCoords['lat'],
                'end_lng'           => $endCoords['lng'],
                'path_coordinates'  => $path,
            ]);

            return Redirect::back()
                ->with('success', 'Route updated successfully.');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return Redirect::back()
                ->withErrors(['route' => 'Route not found or you do not have permission to update it.']);
        } catch (Exception $e) {
            Log::error('Route update failed: ' . $e->getMessage());

            return Redirect::back()
                ->withErrors(['route' => $e->getMessage()]);
        }
    }

    /**
     * Delete a single route
     */
    public function destroy(Route $route)
    {
        abort_if($route->user_id !== auth()->id(), 403);

        $route->delete();

        return Redirect::back()
            ->with('success', 'Route deleted successfully.');
    }

    /**
     * Bulk delete multiple routes
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:routes,id'
        ]);

        try {
            // Delete only routes that belong to the authenticated user
            $deletedCount = Route::where('user_id', auth()->id())
                ->whereIn('id', $validated['ids'])
                ->delete();

            if ($deletedCount === 0) {
                return Redirect::back()
                    ->withErrors(['route' => 'No routes were deleted. Make sure the routes belong to you.']);
            }

            return Redirect::back()
                ->with('success', "{$deletedCount} route(s) deleted successfully.");

        } catch (Exception $e) {
            Log::error('Bulk delete failed: ' . $e->getMessage());

            return Redirect::back()
                ->withErrors(['route' => 'Failed to delete routes: ' . $e->getMessage()]);
        }
    }

    /**
     * Geocode location
     */
    private function geocodeLocation($location)
    {
        $url = 'https://nominatim.openstreetmap.org/search?' . http_build_query([
            'format' => 'json',
            'q'      => $location,
            'limit'  => 1,
        ]);

        $context = stream_context_create([
            'http' => [
                'header'  => "User-Agent: DirectionMapApp/1.0\r\n",
                'timeout' => 10,
            ]
        ]);

        $response = file_get_contents($url, false, $context);
        $data = json_decode($response, true);

        if (empty($data)) {
            throw new Exception("Location not found: {$location}");
        }

        return [
            'lat' => (float) $data[0]['lat'],
            'lng' => (float) $data[0]['lon'],
        ];
    }
}