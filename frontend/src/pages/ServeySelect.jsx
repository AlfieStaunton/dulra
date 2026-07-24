/*SurveySelect.jsx
Alfie Staunton
20.07.26*/

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Butterfly, Clock, ChevronRight } from "lucide-react";

export default function SurveySelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f7f2] font-['Nunito'] text-[#0f2318] flex justify-center">
      <div className="w-full max-w-[390px] bg-white shadow-2xl min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-500 mb-6 hover:text-[#f0f7f2] transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="font-[Lora] text-3xl font-semibold mb-2 text-[#0f2318]">
            Choose a Survey
          </h1>
          <p className="text-sm text-[#4d7460] mb-8">
            Select the type of biodiversity monitoring you like to do.
          </p>

          {/* Survey Card */}
          <div className="border-2 border-[#1a5c35] rounded-3xl p-5 bg-[#f0f7f2] shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#1a5c35] p-4 rounded-2xl text-white">
                <Butterfly size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#0f2318]">
                  Garden Butterfly Monitoring
                </h3>
                <p ClassName="text-xs text-[#4d7460]">
                  {" "}
                  National Biodiversity Data Centre Ireland
                </p>
              </div>
            </div>

            <p className="text-sm text-[#0f2318] mb-6 leading-relaxed">
              A 15-minute count to track butterfly populations in your garden.
            </p>

            <div className="flex justify-between items-center text-sm font-semibold mb-6">
              <div className="flex items-center gap-1.5 text-[#4d7460]">
                <Clock size={16} />
                <span>15 min</span>
              </div>
              <span className="bg-[#1a5e35]/10 text-[#1a5c35] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Active
              </span>
            </div>

            <button
              onClick={() => navigate("/session-active")}
              className="w-full bg-[#1a5c35] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Start Session
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
