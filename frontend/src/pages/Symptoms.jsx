import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Activity, AlertCircle, TrendingUp, Info } from 'lucide-react';

const symptoms = [
  ["Pain", "Aching or sharp discomfort during or after movement."],
  ["Morning Stiffness", "Stiffness after waking or after sitting for a while."],
  ["Swelling", "Puffiness or fullness around the affected joint."],
  ["Reduced Range of Motion", "Difficulty bending, straightening, or moving freely."],
  ["Clicking Sounds", "Cracking, clicking, or grinding sensations during movement."],
  ["Weakness", "The joint may feel less stable or the muscles may tire quickly."],
];

export default function Symptoms() {
  useEffect(() => {
    document.title = "Symptoms & Causes — OA Care";
    return () => { document.title = "OA Care"; };
  }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="container-main">
            <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Home / Symptoms</div>
            <h1 className="section-title mb-0">Symptoms</h1>
            <p className="section-subtitle mb-0 mt-2">Osteoarthritis symptoms can change from day to day. Tracking them helps guide safer care.</p>
          </div>
        </div>

        <section className="bg-white section-pad">
          <div className="container-main">
            <h2 className="section-title text-center">Common Symptoms</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {symptoms.map(([title, text]) => (
                <div key={title} className="card hover:shadow-md transition">
                  <Activity className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-primary-dark mb-2 mt-0">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed m-0">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background section-pad">
          <div className="container-main">
            <h2 className="section-title text-center">Hip vs Knee Specifics</h2>
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary shrink-0" />
                  <h3 className="text-xl font-heading text-primary-dark font-bold m-0">Hip OA</h3>
                </div>
                <ul className="space-y-3 m-0 p-0 list-none">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <span className="text-slate-700 text-sm">Pain in the groin, thigh, buttock, or outer hip.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <span className="text-slate-700 text-sm">Difficulty putting on socks or shoes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <span className="text-slate-700 text-sm">Trouble getting in and out of cars or low chairs.</span>
                  </li>
                </ul>
              </div>
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary shrink-0" />
                  <h3 className="text-xl font-heading text-primary-dark font-bold m-0">Knee OA</h3>
                </div>
                <ul className="space-y-3 m-0 p-0 list-none">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <span className="text-slate-700 text-sm">Pain around the kneecap or joint line.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <span className="text-slate-700 text-sm">Swelling, warmth, or stiffness after rest.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <span className="text-slate-700 text-sm">Difficulty with stairs, squatting, or kneeling.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500 w-6 h-6 shrink-0" />
                <h3 className="text-red-800 font-heading font-bold text-xl m-0">When to See a Doctor</h3>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 text-sm text-red-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" /> Sudden severe pain or inability to bear weight.</li>
                <li className="flex items-start gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" /> Joint redness, fever, or significant warmth.</li>
                <li className="flex items-start gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" /> Rapid swelling after an injury.</li>
                <li className="flex items-start gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" /> Numbness, weakness, or pain getting worse.</li>
              </ul>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <span>Symptoms can have many causes. This page is educational and does not replace medical evaluation.</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
