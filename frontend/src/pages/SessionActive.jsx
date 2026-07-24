/*SurveySelect.jsx
Alfie Staunton
20.07.26*/

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, X, Play, Pause, Plus, Minus } from "lucide-react";

export default function SessionActive() {
  const navigate = useNavigate();

  //timer
  const [timeLeft, setTimeLeft] = useState(900);
  const [isPaused, setIsPaused] = useState(false);

  //camera overlay
  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [cameraError, setCameraError] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef(null);

 //butterfly species
  const [speciesList, setSpeciesList] = useState([
    { id: 1, common:"Speckled Wood", latin: "Pararge Aegeria", count: 0 },
    { id: 2, common: "Painted Lady", latin: "Vanessa Cardui", count: 0 },
    { id: 3, common: "Large White", latin: "Pieris Brassicae", count: 0 },
    { id: 4, common: "Green-veined White", latin: "Pieris Napi", count: 0 },
    { id: 5, common: "Small White", latin:"Pieris Rapae", count: 0 },
    { id: 6, common: "Orange-tip", latin: "Anthocharis Cardamines", count: 0 },
    { id: 7, common: "Meadow Brown", latin: "Maniola Jurtina", count: 0 },
    { id: 8, common: "Holly Blue", latin: "Celastrina Argiolus", count: 0 },
    { id: 9, common: "Red Admiral", latin: "Vanessa Atalanta", count: 0 },
    { id: 10, common: "Ringlet", latin: "Aphantopus Hyperantus", count: 0 },
    { id: 11,common: "Small Tortoiseshell", latin: "Aglais Urticae",count: 0,},
    { id: 12, common: "Peacock", latin: "Aglais Io", count: 0},
    { id: 13, common: "Common Blue", latin: "Polyommatus Icarus", count: 0 },
    { id: 14, common: "Wood White", latin: "Leptidea Sinapis", count: 0 },
    { id: 15, common: "Comma", latin: "Polygonia C-album", count: 0 },
    { id: 16, common: "Brimstone", latin:"Gonepteryx Rhamni", count: 0 },
    { id: 17, common: "Small Copper", latin: "Lycaena Phlaeas", count: 0 },
    { id: 18,common: "Silver-washed Fritillary",latin: "Argynnis Paphia",count: 0},
    { id: 19, common: "Wall", latin: "Lasiommata Megera", count: 0 },
    { id: 20, common: "Essex Skipper", latin: "Thymelicus Lineola", count: 0 },
    { id: 21, common: "Small Heath", latin: "Coenonympha Pamphilus", count: 0 },
    { id: 22,common: "Unidentified Butterfly",latin: "Unidentified Butterfly",count: 0},
  ]);

  //handle timer
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  //calculate total count across al species
  const totalCount = speciesList.reduce((sum, item) => sum + item.count, 0);

  //update tally and re-render
  const updateCount = (id, delta) => {
    setSpeciesList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, count: Math.max(0, item.count + delta) };
        }
        return item;
      }),
    );
  };

  //sort by count, then alphabetical fallback
  const sortedSpecies = [...speciesList].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.common.localeCompare(b.common);
  });

  const handleEndSession = () => {
    //save to local storage so review can access easily
    const sessionData = {
      counts: speciesList.filter((s) => s.count > 0),
      photos,
      duration: 900 - timeLeft,
    };
    localStorage.setItem("currentSession", JSON.stringify(sessionData));

    //route logic - whether photos taken or not
    if (photos.length > 0) {
      navigate("/session-review");
    } else {
      navigate("/session-conditions");
    }
  };

  //manage camera stream
  useEffect(() => {
    let stream = null;
    if (showCamera) {
      setCameraLoading(true);
      setCameraError(false);
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setCameraLoading(false);
        })
        .catch((err) => {
          console.error("Camera access denied:", err);
          setCameraError(true);
          setCameraLoading(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera]);

  //capture image from video stream
  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    setPhotos((prev) => [
      ...prev,
      { url: dataUrl, timestamp: formatTime(900 - timeLeft) },
    ]);
    setShowCamera(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f7f2] font-['Nunito'] text-[#0f2318] flex justify-center">
      <div className="w-full max-w-[390px] bg-white shadow-2xl min-h-screen flex flex-col relative">
        {/*Sticky Header*/}
        <div className=" sticky top-0 bg-white z-10 border-b border-[#1a5c35]/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/survey-select")}
            className=" flex items-center gap-1 text-sm text-gray-500 hover:text-[#1a5c35] transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="font-bold text-xs text-[#0f2318]">
            {" "}
            Garden Butterfly Monitoring
          </span>
          <button
            onClick={handleEndSession}
            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            End
          </button>
        </div>

        {/* timer*/}
        <div className="p-4 bg-[#f0f7f2]">
          <div
            className={`text-white p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden transition-colors duration-500 ${
              timeLeft < 60 ? "bg-red-600" : "bg-[#1a5c35]"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-4xl font-bold tracking-wider">
                  {formatTime(timeLeft)}
                </span>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  {isPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
              </div>
              <p className=" text-xs text-white/90  , mt-1 font-semibold">
                {timeLeft < 60
                  ? "⚠️  Almost done!"
                  : isPaused
                    ? "Paused"
                    : "Count in progress"}
              </p>
            </div>
          </div>

          {/*Progress Bar*/}
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft < 60 ? "bg-red-600" : "bg-[#1a5c35]"
              }`}
              style={{ width: `${(timeLeft / 900) * 100}%` }}
            ></div>
          </div>
        </div>

        {/*Info Strip*/}
        <div className="px-4 py-2 bg-[#ddeee5]/50 flex justify-between items-center text-xs text-[#4d7460] font-bold border-y border-[#1a5c35]/10">
          <span> Tap + each time you see a butterfly</span>
          <span className="bg-[#1a5c35] text-white px-2 py-0.5 rounded-full">
            🦋 {totalCount} total
          </span>
        </div>

        {/*Species tally list*/}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 pb-28">
          {sortedSpecies.map((species) => {
            const isActive = species.count > 0;
            return (
              <div
                key={species.id}
                className={`flex justify-between items-center p-3 rounded-2xl border transition-all ${
                  isActive
                    ? "bg-[#f0f7f2] border-[#1a5c35] shadow-sm"
                    : "bg-white border-gray-100 hover:border-grey-200"
                }`}
              >
                <div>
                  <p
                    className={`text-sm ${isActive ? "font-bold text-[#0f2318]" : "text-gray-700"}`}
                  >
                    🦋{species.common}
                  </p>
                  <p className="text-xs italic text-[#4d7460]">
                    {species.latin}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isActive && (
                    <button
                      onClick={() => updateCount(species.id, -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transformation-transform"
                    >
                      <Minus size={14} />
                    </button>
                  )}

                  {isActive && (
                    <span className="font-bold text-lg w-6 text-center text-[#0f2318]">
                      {species.count}
                    </span>
                  )}

                  <button
                    onClick={() => updateCount(species.id, 1)}
                    className="w-10 h-10 rounded-full bg-[#1a5c35] text-white flex items-center justify-center shadow-sm hover:opacity-90 active:scale-95 transition-transform"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* footer bar*/}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 flex items-center gap-3 shadow[0_-4px_20pxrgba(0,0,0,0.05)]">
          {photos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto max-w-[140px] scrollbar-hide">
              {photos.map((p, idx) => (
                <div
                  key={idx}
                  className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0"
                >
                  <img
                    src={p.url}
                    alt={`Capture ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowCamera(true)}
            className="flex-1 bg-[#1a5c35] text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#134226] active:scale-[0.98] transition-all"
          >
            <Camera size={18} />
            Take a photo ({photos.length})
          </button>
        </div>

        {/* Camera overlay*/}
        {showCamera && (
          <div className="absolute inset-0 bg-black z-50 flex flex-col justify-between p-6">
            <div className="flex justify-between items-center text-white mt-4">
              <button
                onClick={() => setShowCamera(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <span className="font-mono text-lg font-bold bg-black/50 px-3 py-1 rounded-lg">
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className=" relative flex-1 flex items-center justify-center my-6 overflow-hidden rounded-3xl bg-gray-900 border border-white/10">
              {cameraLoading && (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <p className="text-white text-sm font-sm font-semibold mt-2 animate-pulse">
                    Starting camera...
                  </p>
                </div>
              )}

              {cameraError && (
                <div className="text-center p-6 text-white max-w-[250px]">
                  <p className="text-sm mb-4 leading-relaxed">
                    {" "}
                    Camera permission denied.
                  </p>
                  <button
                    onClick={() => setShowCamera(false)}
                    className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm"
                  >
                    Go Back
                  </button>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Viewfinder*/}
              <div className="absolute inset-8 border border-white/20 pointer-events-none rounded-xl">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-br-lg"></div>
              </div>
            </div>

            <div className="flex justify-center pb-8">
              <button
                onClick={capturePhoto}
                className="w-20 h-20 bg-[#1a5c35] rounded-full border-[6px] border-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
              >
                <Camera size={32} className="text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
