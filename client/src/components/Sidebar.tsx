import { useState } from 'react';
import { Search, Navigation, MapPin, X, Menu, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface SidebarProps {
    onPlaceSelect: (place: { lat: number, lng: number, name: string }) => void;
    destination: { lat: number, lng: number, name: string } | null;
    onGetDirections: () => void;
    routeInfo: { distance: string, duration: string } | null;
}

export default function Sidebar({ onPlaceSelect, destination, onGetDirections, routeInfo }: SidebarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            setResults(response.data);
            setSidebarOpen(true);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (result: any) => {
        onPlaceSelect({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            name: result.display_name
        });
        setResults([]);
        setQuery(result.display_name.split(',')[0]);
    }

    const clearSearch = () => {
        setQuery('');
        setResults([]);
    }

    return (
        <>
            {/* Main Menu Drawer */}
            <div className={`fixed inset-0 z-[2000] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)}></div>
                <div className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 border-b flex items-center gap-3">
                        <span className="text-gray-700 font-bold text-xl">Smart Navigation</span>
                    </div>
                    <div className="py-2">
                        <div className="px-4 py-3 hover:bg-gray-100 flex items-center gap-4 cursor-pointer text-gray-700">
                            <MapPin className="w-5 h-5" />
                            <span className="font-medium text-[15px]">Your places</span>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-100 flex items-center gap-4 cursor-pointer text-gray-700">
                            <Navigation className="w-5 h-5" />
                            <span className="font-medium text-[15px]">Your timeline</span>
                        </div>
                        <div className="px-4 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer text-gray-700">
                            <span className="font-medium text-[15px] pl-9">Satellite</span>
                        </div>
                        <div className="px-4 py-2 hover:bg-gray-100 flex items-center gap-4 cursor-pointer text-gray-700">
                            <span className="font-medium text-[15px] pl-9">Traffic</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Search Box */}
            <div className="absolute top-2 left-2 z-[1000] w-[392px] max-w-[calc(100vw-20px)] flex flex-col font-sans">
                <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.2),0_-1px_0px_rgba(0,0,0,0.02)] border-none">
                    <form onSubmit={handleSearch} className="relative flex items-center h-12">
                        <button
                            type="button"
                            className="p-3 text-gray-600 hover:text-black transition-colors"
                            title="Menu"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            className="flex-1 h-full py-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none"
                            placeholder="Search Google Maps"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <div className="flex items-center pr-2 border-l border-gray-200 pl-2 ml-1 h-8 my-auto">
                            <button
                                type="button"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                onClick={handleSearch}
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        {query && (
                            <button
                                type="button"
                                className="absolute right-14 top-2 p-2 text-gray-500 hover:text-gray-800"
                                onClick={clearSearch}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </form>

                    {/* Search Progress Bar */}
                    {isLoading && (
                        <div className="h-0.5 w-full bg-blue-100 overflow-hidden rounded-b-lg">
                            <div className="animate-progress w-full h-full bg-blue-600 origin-left-right"></div>
                        </div>
                    )}
                </div>

                {/* Autocomplete Results */}
                {results.length > 0 && (
                    <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden py-2 border-t border-gray-100">
                        {results.map((res, idx) => (
                            <div
                                key={idx}
                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-4 transition-colors"
                                onClick={() => handleSelect(res)}
                            >
                                <MapPin className="text-gray-400 w-5 h-5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="font-medium text-[15px] text-gray-900 truncate">{res.display_name.split(',')[0]}</p>
                                    <p className="text-[13px] text-gray-500 truncate">{res.display_name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar / Place Details Panel - Slide out from left */}
            {destination && !results.length && (
                <div className={`absolute top-0 left-0 h-full w-[400px] z-[999] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-full flex flex-col">
                        {/* Fake Hero Image */}
                        <div className="h-60 bg-gray-200 relative group cursor-pointer">
                            <img
                                src={`https://source.unsplash.com/800x600/?${encodeURIComponent(destination.name.split(',')[0])},city,architecture`}
                                alt="Location"
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80")}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-6 text-white text-shadow-sm">
                                <h1 className="text-2xl font-medium">{destination.name.split(',')[0]}</h1>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="flex gap-4 mb-6 pt-2">
                                <button
                                    onClick={onGetDirections}
                                    className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-sm transition-colors flex justify-center items-center gap-2"
                                >
                                    <Navigation className="w-4 h-4 fill-current" />
                                    Directions
                                </button>
                                <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-[#1a73e8] rounded-full px-6 py-2.5 text-sm font-medium transition-colors">
                                    Save
                                </button>
                                <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-[#1a73e8] rounded-full px-6 py-2.5 text-sm font-medium transition-colors">
                                    Share
                                </button>
                            </div>

                            <div className="border-t border-gray-200 py-4 space-y-4">
                                <div className="flex items-start gap-4 text-gray-700 text-[15px]">
                                    <MapPin className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                                    {destination.name}
                                </div>
                            </div>

                            {routeInfo && (
                                <div className="mt-4 bg-[#f0f5ff] rounded-xl p-4 border border-blue-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-blue-800 uppercase tracking-widest">Recommended Route</span>
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Fastest</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-medium text-[#1a73e8]">{routeInfo.duration}</span>
                                        <span className="text-[#1a73e8] font-medium">({routeInfo.distance})</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Typical traffic via main roads</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Re-open sidebar button */}
            {destination && !isSidebarOpen && (
                <div className="absolute top-20 left-2 z-[990]">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="bg-white p-3 rounded-full text-gray-600 shadow-md hover:text-blue-600 transition-colors"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </>
    );
}
