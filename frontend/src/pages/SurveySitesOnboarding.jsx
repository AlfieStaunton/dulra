/*SurveySitesOnboarding.jsx
Alfie Staunton
14.07.26*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, X, HelpCircle, ArrowRight } from "lucide-react";
import axios from "axios";

function SurveySitesOnboarding() {
  const navigate = useNavigate();
  const [siteName, setSiteName] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [sites, setSites] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  //validate if coords are seperated by a comma
  const isValidCoords = (str) => {
    if (!str) return false;
    const parts = str.split(",").map((s) => s.trim());
    return (
      parts.length === 2 && parts.every((part) => !isNaN(parseFloat(part)))
    );
  };

  //load existing sites from dataabase
  useEffect(() => {
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

  const handleAddSite = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error saving site to database:", error);
    }
  };

  const handleRemoveSite = async (idToRemoved) => {
    try {
      const token = localStorage.getItem("token");

      //delet site from database
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

  return (
    <div className="min-h-screen  bg-gradient-to-br from-[#0f2318] to [#1a5c35] font-['Nunito'] flex flex-col items-center">
      <div className="w-full max-w-[390px] min-h-screen flex flex-col relative px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
            <MapPin size={28} className="text-white" />
          </div>
          <h1 className=" font-['Lora'] text-3xl text-white font-semibold mb-2">
            Your Survey Sites
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Add your gardens or locations where you'll be monitoring
            butterflies. Dont stress! You can always add these later!
          </p>
        </div>

        {/* Add survey site Form */}
        <form
          onSubmit={handleAddSite}
          className="bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-5 mb-8 backdrop-blur-md"
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Site name (e.g. Back Garden)"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-black/20 text-white/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40 transition-colors"
            />

            <div className="relative flex items-center gap-2">
              <input
                type="text"
                placeholder="Coordinates (e.g. 51.5074, -0.1278)"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                className="flex-1 bg-black/20 text-white/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/40 transition-colors"
              />

              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <HelpCircle size={20} className="text-white" />
              </button>

              {/* Help popup */}
              {showHelp && (
                <div className="absolute top-14 right-0  w-64m bg-white text-[#0f2318] rounded-xl p-4 shadow-xl z-10 text-sm">
                  <p className="font-bold mb-2">How to get coordinates:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[#4d7460]">
                    <li>Open up Google Maps.</li>
                    <li>Tap and hold or right-click on your garden.</li>
                    <li>
                      Tap or click on numbers at the top (e.g., 51.5074,
                      -0.1278) to copy them!
                    </li>
                  </ol>

                  <button
                    type="button"
                    onClick={() => setShowHelp(false)}
                    className="mt-3 bg-[#f0f7f2] w-full text-[#1a5c35] py-2 rounded-lg font-bold"
                  >
                    Got it!
                  </button>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!siteName.trim() || !isValidCoords(coordinates)}
              className="w-full bg-white text-[#1a5c35] py-3 rounded-xl font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Add Site
            </button>
          </div>
        </form>

        {/* List of saved survey sites */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto mb-24">
          {sites.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                  <MapPin size={18} className="text-white" />
                </div>

                <div>
                  <p className="text-white font-semibold">{s.name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{s.location}</p>
                </div>
              </div>

              <button
                onClick={() => handleRemoveSite(s.id)}
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Skip to dashboard*/}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0f2318] to-transparent">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-white text-[#1a5c35] py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg mb-3 hover:bg-[#f0f7f2] transition-colors"
          >
            Continue to Dúlra
            <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-white/50 py-2 text-sm font-semibold hover:text-white transition-colors"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default SurveySiteOnboarding;
