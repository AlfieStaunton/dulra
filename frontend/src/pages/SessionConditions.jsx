/*SessionConditions.jsx
Alfie Staunton
26.07.26*/


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight} from "lucide-react";
import axios from "axios";

export default function SessionConditions() {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [selectedSite , setSelectedSite] = useState("");
  const [date , setDate] = useState("");
  const [startTime , setStartTime] = useState("");
  const [endTime , setEndTime] = useState("");
  const [temperature , setTemperature] = useState("15");
  const [sunshine , setSunshine] = useState("partial");
  const [windSpeed , setWindSpeed] = useState("2");

  //load data
  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);

    const formatTime =(d) => d.toTimeString().slice(0,5);
    setEndTime(formatTime(now));

    const start =new Date(now.getTime() -15 * 60000);
    setStartTime(formatTime(start));

    //get user sites from db
    const fetchSites = async () => {
        try {
            const token = localStorage.getItem("token");
            if(!token) return;

            const response = await axios.get("http://localhost:5000/api/sites", {
                headers: {Authorization:`Bearer ${token}`}
            });

            setSites(response.data);

            //auto select first saved site
            if(response.data.length > 0) {
                setSelectedSite(response.data[0].id);
            }
        } catch(error) {
            console.error("Error fetching sites:", error);
        }
    };
    fetchSites();
  }, []);

  //temp array
  const tempOptions= Array.from({ length:26}, (_,i) => i + 5);

  //wind
  const windOptions = [
    {val: "0", label: "Bf 0 — Smoke rises vertically" },
    { val: "1", label: "Bf 1 — Slight smoke drift" },
    { val: "2", label: "Bf 2 — Wind felt on face, leaves rustle" },
    { val: "3", label: "Bf 3 — Leaves and twigs in slight motion" },
    { val: "4", label: "Bf 4 — Dust raised and small branches move" },
    { val: "5", label: "Bf 5 — Small trees in leaf sway" },
    { val: "6", label: "Bf 6 — Large branches move and trees sway" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sessionData= JSON.parse(localStorage.getItem("currentSession") || "{}");

    const finalLog = {
        ...sessionData, conditions: {
            siteId: selectedSite,
            date,
            startTime,
            endTime,
            temperature,
            sunshine,
            windSpeed
        }
    };

    try {
        const token = localStorage.getItem("token");
        if(!token) {
            console.error("No token found, user might not be logged in.");
            return;
        }
         await axios.post("http://localhost:5000/api/sessions", finalLog, {
            headers: {Authorization:`Bearer ${token}`}
         });

    localStorage.removeItem("currentSession");
    navigate("/dashboard");
    } catch(error) {
        console.error("Error saving session to database:", error);
        alert("failed to save survey.Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7f2] font-['Nunito'] text-[#0f2318] flex justify-center">
        <div className="w-full max-w-[390px] bg-white shadow-2xl min-h-screen flex flex-col relative">

            {/* Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-[#1a5c35]/10 px-4 py-3 flex items-center justify-between">
                <button
                 onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-sm text-gray-500  hover:text-[#1a5c35] transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <span className="font-bold text-sm text-[#0f2318]">Survey Details</span>
                <div className="w-12"></div>
            </div>

            {/* Scroll */}
            <div className="flex-1 overflow-y-auto px-5 py-6 pb-28">
                <div className=" mb-6">
                    <h1 className="font-['Lora'] text-3xl font-semibold mb-1 text-[#0f2318]">Survey Details</h1>
                    <p className="text-sm text-[#4d7460]">Conditions during your count.</p>
                 </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                {/* survey sites */}
                <div>
                    <label className="text-xs font-bold text-[#4d7460] uppercase tracking-wider mb-2 block">
                        📍 Survey Site
                    </label>

                    {sites.length >0 ? (
                        <select
                            value={selectedSite}
                            onChange={(e) => setSelectedSite(e.target.value)}
                            className="w-full bg-[#f0f7f2] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a5c35] focus:ring-1 focus:ring-[#1a5c35] text-[#0f2318] appearance-none"
                        >

                            {sites.map(site => (
                                <option key ={site.id} value={site.id}>
                                    {site.name} ({site.location})
                                </option>
                            ))}
                        </select>

                    ) : (
                    <div className="bg-orange-50 border border-orange-200 text-orange-800 text-sm p-4 rounded-xl">
                        <strong>No sites saved</strong>
                        <br/>
                        This survey will be logged without a specific location. You can add your garden in your Account Settings for your next session!
                    </div>
                    )}
                </div>

                {/* date/time */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                    <label className="text-xs font-bold text-[#4d7460] uppercase tracking-wider mb-2 block">
                        📅 Date
                    </label>
                    <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#f0f7f2] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a5c35] focus:ring-1 focus:ring-[#1a5c35] text-[#0f2318]"
                    />
                    </div>

                    <div>
                    <label className="text-xs font-bold text-[#4d7460] uppercase tracking-wider mb-2 block">
                        Start Time
                    </label>
                    <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#f0f7f2] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a5c35] focus:ring-1 focus:ring-[#1a5c35] text-[#0f2318]"
                    />
                    </div>

                    <div>
                    <label className="text-xs font-bold text-[#4d7460] uppercase tracking-wider mb-2 block">
                        End Time
                    </label>
                    <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[#f0f7f2] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a5c35] focus:ring-1 focus:ring-[#1a5c35] text-[#0f2318]"
                    />
                    </div>
                </div>

                    <hr className="border-gray-100"/>

                    {/* temp*/}
                    <div>
                        <label className="text-xs font-bold text-[#4d7460] uppercase tracking-wider mb-2 block">
                            🌡️ Temperature (°C)
                        </label>
                        <select
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className="w-full bg-[#f0f7f2] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a5c35] focus:ring-1 focus:ring-[#1a5c35] text-[#0f2318] appearance-none"
                        >
                            {tempOptions.map(temp => (
                                <option key={temp} value={temp}>{temp}°C</option>
                            ))}
                        </select>
                    </div>

                    {/* sun */}
                    <div>
                        <label className="text-xs font-bold text-[#4d7460] uppercase tracking-wider mb-2 block">
                            ☀️ Sunshine Level
                        </label>
                        <div className="flex gap-2">
                            <button
                            type="button"
                            onClick={() =>setSunshine("Full sunshine")}
                            className={`flex-1 py-3 px-1 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                                sunshine === "Full sunshine"
                                ? "bg-[#1a5c35]/10 border-[#1a5c35] text-[#1a5c35]"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                            >
                                <span className="text-xl">☀️</span>
                                Full
                            </button>

                            <button
                            type="button"
                            onClick={() =>setSunshine("Partial cloud cover")}
                            className={`flex-1 py-3 px-1 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                                sunshine === "Partial cloud cover"
                                ? "bg-[#1a5c35]/10 border-[#1a5c35] text-[#1a5c35]"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                            >
                                <span className="text-xl">⛅</span>
                                Partial
                            </button>

                            <button
                            type="button"
                            onClick={() =>setSunshine("Full cloud cover")}
                            className={`flex-1 py-3 px-1 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                                sunshine === "Full cloud cover"
                                ? "bg-[#1a5c35]/10 border-[#1a5c35] text-[#1a5c35]"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                            >
                                <span className="text-xl">☁️</span>
                                Cloudy
                            </button>
                        </div>
                        </div>

                        {/* wind */}
                        <div>
                        <label className="text-xs font-bold text-[#4d7460] uppercase tracking-wider mb-2 block">
                            💨 Wind Speed
                        </label>
                        <select
                        value={windSpeed}
                        onChange={(e) => setWindSpeed(e.target.value)}
                        className="w-full bg-[#f0f7f2] border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1a5c35] focus:ring-1 focus:ring-[#1a5c35] text-[#0f2318] appearance-none"
                        >
                            {windOptions.map(opt => (
                                <option key={opt.val} value={opt.val}>{opt.label}</option>
                            ))}
                        </select>
                        </div>
                </form>
                </div>

                {/* footer */}
                <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-[#1a5c35] to-[#1a6b8c] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
                    >
                    Complete Log 🦋
                    <ArrowRight size={18}/>

                    </button>
                </div>
        </div>
    </div>
  );
}