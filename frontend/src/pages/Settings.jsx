/*Setting.jsx
Alfie Staunton
14.07.26*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Plus,
  X,
  Pencil,
  Check,
  User,
  Bell,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("sites");

  //user data
  const [userData, setUserData] = useState({ username: "User", initials: "U" });

  //sites states
  const [sites, setSites] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [coordinates, setCordinates] = useState("");

  //new state - edit mode
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  //check coords are seperated by a comma
  const isValidCoords = (str) => {
    if (!str) return false;
    const parts = str.split(",").map((s) => s.trim());
    return (
      parts.length === 2 && parts.every((part) => !isNaN(parseFloat(part)))
    );
  };

  useEffect(() => {
    //get user details for header
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          username: user.username || "User",
          initials: (user.username || "U").charAt(0).toUpperCase(),
        });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    //load existing sites from database
    const fetchSites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/sites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSites(response.data);
      } catch (error) {
        console.error("Error fetching sites from database:", error);
      }
    };
    fetchSites();
  }, []);

  //add site
  const handleAddSite = async (e) => {
    if (e) e.preventDefault();
    if (siteName.trim() || !isValidCoords(coordinates)) return;

    const [latitude, longitude] = coordinates
      .split(",")
      .map((s) => parseFloat(s.trim()));

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/sites",
        {
          site_name: siteName,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const newSite = {
        id: response.data.siteId,
        name: siteName,
        latitude,
        longitude,
        location: coordinates,
      };

      const updatedSites = [...sites, newSite];
      setSites(updatedSites);

      //reset form
      setSiteName("");
      setCoordinates("");
      setShowForm(false); //hide form once complete
    } catch (error) {
      console.error("Error saving site to database:", error);
    }
  };

  const handleRemoveSite = async (idToRemoved) => {
    try {
      const token = localStorage.getItem("token");

      //delete site from database
      await axios.delete(`http://localhost:5000/api/sites/${idToRemoved}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedSites = sites.filter((s) => s.id !== idToRemoved);
      setSites(updatedSites);
    } catch (error) {
      console.error("Error removing site from database:", error);
    }
  };

  const startEdit = (site) => {
    setEditingId(site.id);
    setEditName(site.name);
    setEditLocation(site.location);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !isValidCoords(editLocation)) return;

    const [latitude, longitude] = editLocation
      .split(",")
      .map((s) => parseFloat(s.trim()));

    try {
      const token = localStorage.getItem("token");

      //push update to database
      await axios.put(
        `http://localhost:5000/api/sites/${editingId}`,
        {
          site_name: editName,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      //update screen instantly
      const updatedSites = sites.map((s) =>
        s.id === editingId
          ? {
              ...s,
              name: editName,
              location: editLocation,
              latitude,
              longitude,
            }
          : s,
      );
      setSites(updatedSites);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating site in database:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7f2] font-['Nunito'] text-[#0f2318] flex flex-col items-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative shadow-xl bg-[#f0f7f2] overflow-hidden">

        {/*heasder*/}
        <div className="shrink-0 px-5 pt-10 pb-5 bg-gradient-to-br from-[#0a2414] to-[#1a5c45]">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-white/60 text-sm mb-4 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center text-white text-xl font-semibold bg-white/20">
              {userData.initials}
            </div>
            <div>
              <h2 className="flex items-center gap-3">{userData.username}</h2>
              <p className="text-white/60 text-xs mt-1">Member since 2026</p>
            </div>
          </div>

          {/* tabs*/}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setTab("sites")}
              className={`px-4 py-1.5 rounded-full text-sm transition all ${
                tab === "sites"
                  ? "bg-white/25 font-semibold"
                  : "bg-white/10 text-white/50"
              }`}
            >
              📍 My Sites
            </button>

            <button
              onClick={() => setTab("account")}
              className={`px-4 py-1.5 rounded-full text-sm transition all ${
                tab === "account"
                  ? "bg-white/25 font-semibold"
                  : "bg-white/10 text-white/50"
              }`}
            >
              👤 Account
            </button>
          </div>
        </div>

        {/*  sites tab content */}
        {tab === "sites" && (
          <div
            className="flex-1 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="px-5 py-4 space-y-3 pb-12">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold font-['Lora']">
                    Survey Sites
                  </p>
                  <p className="text-xs text-[#4d7460] mt-0.5">
                    {sites.length === 0
                      ? "No sites added yet"
                      : `${sites.length} site(s) saved`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingId(null);
                  }}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl text-white bg-[#1a5c35]
                                hover:opacity-90"
                >
                  <Plus size={13} />
                  Add site
                </button>
              </div>

              {/*add sites form */}
              {showForm && (
                <div className="rounded-2xl border-[#1a5c35]/20 p-4 space-y-2.5 bg-white shadow-sm">
                  <p className="text-xs text-[#4d7460] uppercase font-bold">
                    New site
                  </p>
                  <input
                    type="text"
                    placeholder="Site name (e.g. Back Garden)"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-[#f0f7f2] border border-[#ddeee5] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1a5c35]/50"
                  />
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Coordinates (e.g. 51.5074, -0.1278)"
                      value={coordinates}
                      onChange={(e) => setCoordinates(e.target.value)}
                      className="w-full bg-[#f0f7f2] border border-[#ddeee5] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1a5c35]/50"
                    />

                    <button
                      type="button"
                      onClick={() => setShowHelp(!showHelp)}
                      className="p-2.5 bg-[#f0f7f2] rounded-xl hover:bg-[#ddeee5] transition-colors"
                    >
                      <HelpCircle size={18} className="text-[#1a5c35]" />
                    </button>

                    {/* Help popup */}
                    {showHelp && (
                      <div className="absolute top-12 right-0 w-64m bg-white  border border-[#1a5c35] text-[#0f2318] rounded-xl p-4 shadow-xl z-10 text-sm">
                        <p className="font-bold mb-2">
                          How to get coordinates:
                        </p>
                        <ol className="list-decimal pl-4 space-y-1 text-[#4d7460]">
                          <li>Open up Google Maps.</li>
                          <li>Tap and hold or right-click on your garden.</li>
                          <li>
                            Tap or click on numbers at the top (e.g., 51.5074, -0.1278) to copy them!
                          </li>
                        </ol>

                        <button
                          type="button"
                          onClick={() => setShowHelp(false)}
                          className="mt-3 bg-[#f0f7f2] w-full text-[#1a5c35] py-2 rounded-lg font-bold hover:bg-[#ddeee5]"
                        >
                          Got it!
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setShowHelp(false);
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-[#1a5c35]/20 text-sm text-[#4d7460] font-bold"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleAddSite}
                      disabled={!siteName.trim() || !isValidCoords(coordinates)}
                      className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium bg-[#1a5c35] disabled:opacity-40 "
                    >
                      Save Site
                    </button>
                  </div>
                </div>
              )}

              {/*Empty list*/}
              {sites.length === 0 && !showForm && (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <div className="w-14 h-14 rounded-3xl bg-[#ddeee5] flex items-center justify-center">
                    <MapPin size={24} className="text-[#1a5c35]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f2318]">
                      No sites yet
                    </p>
                    <p className="text-xs text-[#0f2318] mt-1">
                      Add your garden
                    </p>
                  </div>
                </div>
              )}

              {/*survey sites list*/}
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="bg-white border border-[#1a5c35]/15 shadow-sm rounded-2xl overflow-hidden"
                >
                  {editingId === site.id ? (
                    <div className="p-4 space-y-2.5">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-[#f0f7f2] border border-[#ddeee5] rounded-xl px-3.5 py-2.5 text-sm"
                      />
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full bg-[#f0f7f2] border border-[#ddeee5] rounded-xl px-3.5 py-2.5 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 py-2 rounded-xl border border-[#1a5c35]/20 text-sm text-[#4d7460] font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 py-2 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-1.5 bg-[#1a5c35]"
                        >
                          <Check size={13} /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className=" flex items-start gap-3 p-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#f0f7f2]">
                        <MapPin size={15} className="text-[#1a5c35]" />
                      </div>
                      <div className="flex-1">
                        <p className=" text-sm font-bold text-[#0f2318]">
                          {site.name}
                        </p>
                        <p className="text-xs text-[#4d7460] mt-0.5">
                          {site.location}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(site)}
                          className="p-2 bg-[#f0f7f2] rounded-xl"
                        >
                          <Pencil size={12} className="text-[#1a5c35]" />
                        </button>
                        <button
                          onClick={() => handleRemoveSite(site.id)}
                          className="p-2 bg-[#f0f7f2] rounded-xl"
                        >
                          <X size={12} className="text-[#4d7460]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* account tab*/}
        {tab === "account" && (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            <button className="w-full flex items-center gap-3 bg-white border border-[#1a5c35]/15 shadow-sm rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#f0f7f2] flex items-center justify-center">
                <User size={15} className="text-[#1a5c35]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold">Edit profile</p>
                <p className="text-xs text-[#4d7460]">Name, username, email</p>
              </div>
              <ChevronRight size={14} className="text-[#4d7460]" />
            </button>

            <button className="w-full flex items-center gap-3 bg-white border border-[#1a5c35]/15 shadow-sm rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#f0f7f2] flex items-center justify-center">
                <Bell size={15} className="text-[#1a5c35]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold">Notifications</p>
                <p className="text-xs text-[#4d7460]">
                  Survey reminders & Alerts
                </p>
              </div>
              <ChevronRight size={14} className="text-[#4d7460]" />
            </button>

            <button className="w-full flex items-center gap-3 bg-white border border-[#1a5c35]/15 shadow-sm rounded-2xl px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#f0f7f2] flex items-center justify-center">
                <Shield size={15} className="text-[#1a5c35]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold">Privacy & data</p>
                <p className="text-xs text-[#4d7460]">
                  Data sharing preferences
                </p>
              </div>
              <ChevronRight size={14} className="text-[#4d7460]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
