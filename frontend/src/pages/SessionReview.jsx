/*SessionReview.jsx
Alfie Staunton
25.07.26*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2} from "lucide-react";

export default function SessionReview() {
  const navigate = useNavigate();

//load session data
const [sessionData, setSessionData] = useState({ photos: [], counts: [], duration: 0});

const [currentIndex, setCurrentIndex] =useState(0);
const [identifications, setIdentifications] =useState({});

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

  useEffect(() =>{
    const savedSession = localStorage.getItem("currentSession");

    if(savedSession) {
        const parsedData  =JSON.parse(savedSession);
        setSessionData(parsedData);

        //skip if no photos taken
        if(!parsedData.photos || parsedData.photos.length === 0) {
            navigate("/sessions-conditions");
        }
    }
}, [navigate]);

//drop down
const handleIdentify = (speciesName) => {
    setIdentifications((prev) => ({
        ...prev,
        [currentIndex]: speciesName
    }));
}

//nav
    const handleNext =() =>{
        if (currentIndex < sessionData.photos.length -1) {
            setCurrentIndex(currentIndex+1);
        } else  {
            finishReview();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    //clear selection if user skips
    const handleSkip =() => {
        const updatedIds = { ...identifications};
        delete updatedIds[currentIndex];
        setIdentifications(updatedIds);
        handleNext();
    };

    //finish up review - move to next screen
    const finishReview = () => {
        const updatedPhotos = sessionData.photos.map((photo, index) => ({
            ...photo,
            identifiedAs: identifications[index] || "Unidentified Butterfly"
        }));

        const finalSessionData = {
                ...sessionData,
                photos: updatedPhotos
            };

            localStorage.setItem("currentSession", JSON.stringify(finalSessionData));
            navigate("/session-conditions");
        };

        //UI variables
        const totalPhotos = sessionData.photos.length;
        const identifiedCount = Object.keys(identifications).filter(k=> identifications[k] !== "Unidentified Butterfly").length;
        const currentPhoto = sessionData.photos[currentIndex];
        const isLastPhoto = currentIndex === totalPhotos -1;
        const hasSelectCurrent = !! identifications[currentIndex] && identifications[currentIndex] !== "Unidentified Butterfly";

        //blank screen while loading
        if (!currentPhoto) return <div className="min-h-screen bg-[#f0f7f2]"></div>

        return(
            <div className="min-h-screen bg-[#f0f7f2] font-['Nunito'] text-[#0f2318] flex justify-center">
                <div className="w-full max-w-[390px] bg-white shadow-2xl min-h-screen flex flex-col relative">

                    {/* Header*/}
                    <div className="bg-white z-10 px-5 pt-6 pb-4 border-b border-gray-100">
                    <h1 className="font-['Lora'] text-2xl font-bold text-[#0f2318] mb-1">
                      Review Photos
                    </h1>
                    <p className="text-sm text-[#4d7460] font-medium">
                        Photo {currentIndex + 1} of {totalPhotos} · {identifiedCount} identified
                    </p>

                    {/* dot nav*/}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                        {sessionData.photos.map((_, idx) => {
                            let dotColor = "bg-gray-200"; // unreviewed
                            if (idx === currentIndex) dotColor = "bg-[#1a6b8c]"; //current
                            else if (identifications[idx]) dotColor = "bg-[#1a5c35]"; //identified

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${dotColor} ${idx === currentIndex ? "w-6" : "w-2"}`}
                                    aria-label={`Go to photo ${idx + 1}`}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-6 pb-32">

                 {/* view photo */}
                 <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-inner mb-8 border border-gray-200">
                 <img
                            src={currentPhoto.url}
                            alt={`Butterfly capture ${currentIndex + 1}`}
                            className="w-full h-full object-cover"
                        />

                {/* time stamp */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg">
                        @{currentPhoto.timestamp} into session
                </div>

                {/* sucess */}
                {hasSelectCurrent && (
                    <div className="absolute bottom-3 left-3 bg-[#1a5c35]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg animate-in slide-in-from-bottom-2">
                        <CheckCircle2 size={14} />
                        {identifications[currentIndex]}
                        </div>
                )}
                 </div>

                {/* identify section */}
                <div className="space-y-4">
                    <label className="text-xs font-mono font-bold text-[#4d7460] uppercase tracking-wider block ">
                        Which butterfly is this?
                    </label>

                    <div className="relative">
                        <select
                            value={identifications[currentIndex] || "Unidentified Butterfly" }
                            onChange={(e) => handleIdentify(e.target.value)}
                              className="w-full bg-[#f0f7f2] border border-[#1a5c35]/20 rounded-xl px-4 py-4 text-sm font-semibold focus:outline-none focus:border-[#1a5c35] focus:ring-1 focus:ring-[#1a5c35] text-[#0f2318] appearance-none"
                            >
                                {speciesList.map((species) => (
                                    <option key={species.id} value={species.common}>
                                        {species.common} {species.common !== "Unidentified Butterfly" && `-${species.latin}`}
                                    </option>
                                ))}
                            </select>
                    </div>
                </div>
                </div>

                {/* footer */}
                <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 3 shadow[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3">

                {/* back */}
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`p-3.5 rounded-xl border border-gray-200 flex items-center justify-center transition-colors ${
                        currentIndex === 0 ? "opacity-30 bg-gray-50" : "hover:bg-gray-50 text-[#0f2318]"
                            }`}
                        >
                            <ArrowLeft size={20} />
                        </button>

                {/* skip - if nothing is selected*/}
                {!hasSelectCurrent ? (
                    <button
                    onClick={handleSkip}
                    className="flex-1 py-3.5 rounded-xl bg-[#f0f7f2] text-[#1a5c35] font-bold text-sm hover:bg[#e1f0e6] transition-colors"
                    >
                    Skip
                    </button>
                ):null}

                {/* continue */}
                <button
                 onClick={handleNext}
                 className={`flex-[2] py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                    hasSelectCurrent ? "bg-[#1a5c35] text-white hover:bg-[#134226]" : "bg-gray-800 text-white"
                    }`}
                    >
                        {isLastPhoto ? "Continue" : "Next"}
                        <ArrowRight size={18} />
                    </button>

                    </div>
                    </div>
                </div>
            </div>
        );
    }
