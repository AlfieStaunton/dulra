import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, BookOpen } from "lucide-react";

export default function Guides() {
  const navigate = useNavigate();


  return(
        <div className="min-h-screen bg-[#f0f7f2] font-['Nunito'] text-[#0f2318] flex flex-col items-center">
          <div className="w-full max-w-[390px] min-h-screen flex flex-col relative shadow-xl bg-[#f0f7f2] overflow-hidden">

            {/*header*/}
            <div className="shrink-0 px-5 pt-10 pb-5 bg-gradient-to-br from-[#0a2414] to-[#1a5c45]">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-white/60 text-sm mb-4 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <h1 className="font-['Lora'] text-white text-3xl font-bold">Survey Guides</h1>
            </div>

            <div className="flex-1 px-5 py-6 space-y-8">

                {/*survey sect*/}
                <section>
                    <h2 className="text-lg font-bold font-['Lora'] mb-4 flex items-center gap-2">
                        <BookOpen size={20} className="text-[#1a5c35]"/>
                        Garden Butterfly Monitoring
                    </h2>

                    <div className="space-y-3">
                        <a href="https://biodiversityireland.ie/surveys/garden-butterfly-monitoring-scheme/"
                            target="_blank" rel="noopener noreferrer"
                            className="block p-4 bg-white border border-[#1a5c35]/15 rounded-2xl shadow-sm hover:border-[#1a5c35]/30 transition-all flex justify-between items-center"
                        >
                            <span className="text-sm font-semibold">Official Scheme Page</span>
                            <ExternalLink size={16} className="text-gray-400"/>
                        </a>

                        <a href="https://rise.articulate.com/share/uTsbsKpOJpDF9H2QkXgx5PeBwyreXjYN"
                            target="_blank" rel="noopener noreferrer"
                            className="block p-4 bg-white border border-[#1a5c35]/15 rounded-2xl shadow-sm hover:border-[#1a5c35]/30 transition-all flex justify-between items-center"
                        >
                            <span className="text-sm font-semibold">Quick eCourse</span>
                            <ExternalLink size={16} className="text-gray-400"/>
                        </a>
                    </div>
                </section>

                 {/*guide photo*/}
                 <section>
                    <h3 className="text-sm font-bold text-[#4d7460] tracking-wider mb-4">Identification Guide</h3>
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        <img
                        src="/images/dulra-guide.png"
                        alt="Dulra Butterfly Guide"
                        className="w-full h-auto"/>
                    </div>
                 </section>
            </div>
        </div>
    </div>
  );
}
