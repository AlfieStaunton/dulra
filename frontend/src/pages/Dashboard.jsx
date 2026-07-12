/* Dashboard.jsx
Alfie Staunton
06.07.26
*/


import React, {useState, useEffect} from 'react';
import {Bell, Plus, ChevronRight, BarChart3, Clock, Map, Settings, LogOut} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

function Dashboard() {
    //safe nav hook
    let navigate;
    try{
        navigate =  useNavigate();
    } catch (e) {
        console.warn("useNavigate failed (likely not inside a Router). Using window.location fallback.");
        navigate =(path) => {window.location.href = path;};

    }

    //state setup
    const [userData, setUserData] = useState({username: 'User', initials: 'U'});
    const [sightings, setSightings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    //fetch data
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    setUserData({
                        username: user.username || 'User',
                        initials: (user.username || 'U').charAt(0).toUpperCase()
                    });
                } catch (e) {
                    console.error("Failed to parse user data from localStorage", e);
                }
            }

            //fetch sightings ( simulated for now)
            const fetchSightings = async() => {
                try {
                    setTimeout(() => {
                        setSightings([
                            {id: 1, species:"Red Admiral", emoji: "🦋", date:"Yesterday · 14:30", count:3},
                            {id: 2, species:"Small Tortiseshell", emoji: "🦋", date:"July 2 · 11:15", count:1}
                        ]);
                        setLoading(false);
                    }, 500);
                } catch (error) {
                    console.error("Failed to fetch sightings", error);
                    setLoading(false);
                }
                };

                fetchSightings();
            }, []);

            //helper for nav
            const handleNavigation = (path) => {
                if (navigate) {
                    navigate(path);
                }
            };

            //logout func
            const handleLogout = () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (navigate) {
                    navigate('/');
                }
            };

    return (
        <div className="min-h-screen bg-[#f0f7f2] font-['Nunito'] text-[#0f2318] flex flex-col items-center">

            {/* mobile frame constraint - max width for desktop */}
            <div className="w-full max-w-[390px] min-h-screen flex flex-col relative shadow-xl bg-[#f0f7f2]">

                {}
                <header className="px-6 pt-12 pb-6 flex justify-between items-center">
                    <div>
                        <p className="font-['DM_Mono'] text-sm text-[#4d7460]"> Dia Dhuit 👋</p>
                        <h1 className="font-['Lora'] text-2xl font-semibold text-[#1a5c35]">
                            Fáilte, {userData.username}!
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-full hover:bg-[#ddeee5] transition-colors">
                            <Bell size={24} className="text-[#1a5c35]"/>
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-[#f0f7f2]"></span>
                        </button>


                    {/*avatar drop down*/}
                    <div className="relative">
                        <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-10 h-10 rounded-full bg-[#1a5c35] text-white flex items-center justify-center font-bold shadow-sm hover:opacity-90 transition-opacity">
                            {userData.initials}
                        </button>

                        {/* dropdown menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[rgba(26,92,53,0.1)] py-2 overflow-hidden transform origin-top-right transition-all">
                                <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    handleNavigation('/settings'); // not functionsl yet
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#f0f7f2] transition-colors text-[#1a5c35] text-sm font-semibold">
                                    <Settings size={18} />
                                    Account Settings
                                </button>

                                <div className="h-[1px] bg-[rgba(26,92,53,0.1)] w-full my-1"></div>

                                <button onClick={handleLogout}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 transition-colors text-red-600 text-sm font-semibold">
                                    <LogOut size={18} />
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>

                    </div>
                </header>

                <main className="flex-1 px-6 pb-24 overflow-y-auto">

                    {/* stats */}
                    <div className="flex gap-3 mb-8">
                        <div className="flex-1 bg-white p-4 rounded-2xl border border-[rgba(26,92,54,0.15)] shadow-sm text-center">
                            <p className="font-['DM_Mono'] text-2xl font-medium text-[#1a5c35]">12</p>
                            <p className="text-xs font-semibold text-[#4d7460] uppercase tracking-wider mt-1">Sightings</p>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-2xl border border-[rgba(26,92,54,0.15)] shadow-sm text-center">
                            <p className="font-['DM_Mono'] text-2xl font-medium text-[#1a5c35]">4</p>
                            <p className="text-xs font-semibold text-[#4d7460] uppercase tracking-wider mt-1">Species</p>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-2xl border border-[rgba(26,92,54,0.15)] shadow-sm text-center">
                            <p className="font-['DM_Mono'] text-2xl font-medium text-[#1a5c35]">3</p>
                            <p className="text-xs font-semibold text-[#4d7460] uppercase tracking-wider mt-1">Sessions</p>
                        </div>
                    </div>

                    {/* log a sighting */}
                    <button
                    onClick={() => handleNavigation('/survey-select')}
                    className="w-full bg-gradient-to-r from-[#1a5c35] to-[#1a6b8c] rounded-[24px] p-6 shadow-lg hover:shadow-xl hover:scale-[0.98] transition-all relative overflow-hidden text-left mb-10 group">

                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-110 transition-transform"></div>

                        <p className="text-white/80 font-medium text-sm mb-1"> Ready to record?</p>
                        <div className="flex justify-between items-center">
                            <h2 className="font-['Lora'] text-3xl text-white font-semibold"> Log a Sighting</h2>
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                            <Plus size={28} className="text-white"/>
                            </div>
                        </div>

                    </button>

                    {/* recent sightings */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="font-['Lora'] text-xl text-[#2a5c35] font-semibold"> Recent Sightings</h3>
                            <button className="text-[#1a6b8c] text-sm font-semibold hover:underline"> View all</button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {loading ? (
                                <p className="text-center text-[#4d7460] py-4">Loading sightings...</p>
                            ) : sightings.length === 0 ? (
                                <p className="text-center text-[#4d7460] py-4 bg-white rounded-2xl border border-[rgba(26,92,53,0.15)]">No Sightings logged yet</p>
                            ) : (
                                sightings.map((sighting) => (
                                    <button key={sighting.id} className="bg-white p-4 rounded-2xl border border-[rgba(26,92,53,0.15)] shadow-sm flex items-center justify-between hover:bg-[#fafdfa] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#ddeee5] rounded-xl flex items-center justify-center text-2xl">
                                                {sighting.emoji}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-[#0f2318]">{sighting.species}</p>
                                                <p className="text-xs text-[#4d7460]">{sighting.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-['DM_Mono'] bg-[#f0f7f2] text-[#1a5c35] px-3 py-1 rounded-lg text-sm -font-medium">x{sighting.count}</span>
                                            <ChevronRight size={20} className="text-[#4d7460]" />
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </main>

                {/* navigation */}
                <nav className="absolute bottom-0 w-full bg-white border-t border-[rgba(26,92,53,0.15)] px-6 py-4 flex justify-between items-center pb-8 shadow-[0_-4px_20px_rgba(0,0,0.03)] z-50">
                    <button className="flex flex-col items-center gap-1 text-[#4d7460] hover:text-[#1a5c35] transition-colors">
                        <BarChart3 size={24} />
                        <span className="text-[10px] font-bold">My Data</span>
                    </button>

                    <button
                        onClick={() => handleNavigation('/survey-select')}
                        className="flex flex-col items-center gap-1 text-[#1a5c35]">

                            <div className="relative">
                                <div className="absolute inset-0 bg-[#ddeee5] rounded-full scale-150 -z-10"></div>
                                <Plus size={24} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-bold mt-1">Log</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-[#4d7460] hover:text-[#1a5c35] transition-colors">
                        <Map size={24} />
                        <span className="text-[10px] font-bold">Map</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-[#4d7460] hover:text-[#1a5c35] transition-colors">
                        <Map size={24} />
                        <span className="text-[10px] font-bold">Guides</span>
                    </button>
                </nav>

            </div>
        </div>
    );
}
export default Dashboard;
