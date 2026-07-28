/* Dashboard.jsx
Alfie Staunton
06.07.26
*/

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  ChevronRight,
  BarChart3,
  Clock,
  Map,
  Settings,
  LogOut,
  Leaf,
  CloudSun,
  Activity,
  Calendar,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  //state setup
  const [userData, setUserData] = useState({ username: "User", initials: "U" });
  const [recentSurveys, setRecentSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState({ totalSightings: 0, totalSessions: 0 });

  //fetch data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          username: user.username || "User",
          initials: (user.username || "U").charAt(0).toUpperCase(),
        });
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await axios.get(
          "http://localhost:5000/api/sightings/recent",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setRecentSurveys(res.data);

        const totalS = res.data.reduce(
          (acc, curr) => acc + parseInt(curr.total_butterflies),
          0,
        );

        setStats({ totalSightings: totalS, totalSessions: res.data.length });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  //logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f7f2] font-['Nunito'] text-[#0f2318] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative shadow-xl bg-white overflow-hidden">
        {/* header */}
        <div className="px-5 pt-8 pb-6 bg-[#f0f7f2]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-[#4d7460] font-semibold mb-0.5">
                Fáilte,
              </p>
              <h1 className="font-['Lora'] text-2xl font-bold text-[#0f2318]">
                {userData.username}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-[#ddeee5] transition-colors">
                <Bell size={24} className="text-[#1a5c35]" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-[#f0f7f2]"></span>
              </button>

              {/* avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-[#1a5c35] text-white flex items-center justify-center font-bold shadow-sm hover:opacity-90 transition-opacity"
                >
                  {userData.initials}
                </button>

                {/* dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full text-left px-4 py-2 text-sm text-[#0f2318] hover:bg-[#f0f7f2] flex items-center gap-2"
                    >
                      <Settings size={16} className="text-[#4d7460]" /> Account
                      Settings
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#1a5c35]/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#f0f7f2] flex items-center justify-center">
                  <Leaf size={14} className="text-[#1a5c35]" />
                </div>
                <span className="text-xs font-bold text-[#4d7460]">
                  This Month
                </span>
              </div>
              <p className="text-2xl font-bold font-mono">
                {stats.totalSightings}
              </p>
              <p className="text-[10px] text-[#4d7460] uppercase tracking-wider font-bold mt-1">
                Total Sightings
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#1a5c35]/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#f0f7f2] flex items-center justify-center">
                  <Activity size={14} className="text-[#1a5c35]" />
                </div>
                <span className="text-xs font-bold text-[#4d7460]">
                  Active Days
                </span>
              </div>
              <p className="text-2xl font-bold font-mono">
                {stats.totalSessions}
              </p>
              <p className="text-[10px] text-[#4d7460] uppercase tracking-wider font-bold mt-1">
                Sessions Logged
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-5 pt-6 pb-24 overflow-y-auto">
          {/* select survey */}
          <button
            onClick={() => navigate("/survey-select")}
            className="w-full bg-[#1a5c35] text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-[#1a5c35]/20 hover:bg-[#134226] hover:-translate-y-0.5 transition-all duration-300 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Plus size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Start New Survey</p>
                <p className="text-white/80 text-xs">
                  Record a 15-minute count
                </p>
              </div>
            </div>
            <ChevronRight className="text-white/50" />
          </button>

          {/* recent activity*/}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Lora'] text-lg font-bold text-[#0f2318]">
              Recent Activity
            </h2>
            <button className="text-xs font-bold text-[#1a5c35] hover:opacity-70 transition-opacity">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : recentSurveys.length > 0 ? (
              // activity list
              recentSurveys.map((survey) => (
                <div
                  key={survey.session_id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-[#1a5c35]/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f0f7f2] flex flex-col items-center justify-center shrink-0 border border-[#ddeee5]">
                    <span className="text-xs font-bold text-[#1a5c35]">🦋</span>
                    <span className="text-sm font-black font-mono text-[#1a5c35] leading-none mt-1">
                      {survey.total_butterflies}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#0f2318] mb-0.5">
                      {survey.site_name || "Unspecified Location"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#4d7460] font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(survey.session_date)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))
            ) : (
              // empty
              <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-400">
                  🦋
                </div>
                <p className="text-sm font-bold text-gray-700">
                  No surveys yet
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Start a 15-minute count to log your first sightings!
                </p>
              </div>
            )}

            {/* guides*/}
            <button
            onClick={() => navigate("/guides")}
            className="w-full mt-6 bg-[#f0f7f2] border border-[#1a5c35]/20 p-4 rounded-2xl flex items-center gap-4 hover:border-[#1a5c35]"
            >
              <div className="p-2 bg-white rounded-xl text-[#1a5c35]">
                <BookOpen size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold tex-sm text-[#0f2318]">Survey Guides</p>
                <p className="text-[10px] text-[#4d7460]"> Learn to identify and record wildlife </p>
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
