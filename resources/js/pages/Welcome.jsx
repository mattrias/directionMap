import { Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Direction Map" />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                
                <div className="text-center">
                    
                    <h1 className="mb-4 text-4xl font-bold text-gray-800">Welcome to Direction Map</h1>
                    <p className="mb-6 text-lg text-gray-600">This is a Direction map application using React and Laravel.</p>
                        <div className="space-x-4">
                            <a href="/login" className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                                Log In
                            </a>
                            <a href="/register" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                Register
                            </a>
                        </div>
                </div>
            </div>
        </>
    );
}