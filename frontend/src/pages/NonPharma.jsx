import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Activity, Dumbbell, Weight, Armchair, Info, ArrowRight } from 'lucide-react';

export default function NonPharma() {
  useEffect(() => {
    document.title = "Non-Pharmacological Management — OA Care";
    return () => { document.title = "OA Care"; };
  }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="container-main">
            <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Home / Non-Pharmacological</div>
            <h1 className="section-title mb-0">Non-Drug Treatments</h1>
            <p className="section-subtitle mb-0 mt-2">Core strategies for managing OA without medications.</p>
          </div>
        </div>

        <section className="bg-white section-pad">
          <div className="container-main max-w-5xl mx-auto">
            <h2 className="section-title text-center mb-10">The Big Three</h2>
            <div className="grid md:grid-cols-3 gap-6 non-pharma-grid">
              <div className="card flex flex-col cursor-pointer hover:shadow-md transition">
                <Link to="/exercises" className="flex flex-col h-full no-underline text-inherit">
                  <Dumbbell className="w-10 h-10 text-primary mb-4 shrink-0" />
                  <h3 className="text-xl font-heading font-bold text-primary-dark mb-3 mt-0">Exercise Therapy</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                    Targeted exercise is the single most effective non-drug treatment for OA. It strengthens the muscles that support joints and improves flexibility.
                  </p>
                  <ul className="text-sm text-slate-500 space-y-2 m-0 p-0 list-none border-t border-slate-100 pt-4 mb-4">
                    <li>• Aerobic exercise (walking, swimming)</li>
                    <li>• Strengthening (resistance training)</li>
                    <li>• Flexibility/Stretching</li>
                  </ul>
                  <div className="card-link">
                    View Exercises <ArrowRight className="w-4 h-4 shrink-0" />
                  </div>
                </Link>
              </div>

              <div className="card flex flex-col">
                <Weight className="w-10 h-10 text-primary mb-4 shrink-0" />
                <h3 className="text-xl font-heading font-bold text-primary-dark mb-3 mt-0">Weight Management</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                  For knee and hip OA, losing just 5% of body weight can significantly reduce pain and slow disease progression.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 m-0 p-0 list-none border-t border-slate-100 pt-4">
                  <li>• Nutritional counseling</li>
                  <li>• Portion control strategies</li>
                  <li>• Combined with increased activity</li>
                </ul>
              </div>

              <div className="card flex flex-col">
                <Armchair className="w-10 h-10 text-primary mb-4 shrink-0" />
                <h3 className="text-xl font-heading font-bold text-primary-dark mb-3 mt-0">Joint Protection</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                  Learning how to move safely and use assistive devices can dramatically reduce daily joint strain and pain.
                </p>
                <ul className="text-sm text-slate-500 space-y-2 m-0 p-0 list-none border-t border-slate-100 pt-4">
                  <li>• Pacing activities</li>
                  <li>• Using walking aids correctly</li>
                  <li>• Ergonomic workspace/home adjustments</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <div className="card border-l-4 border-l-amber-400">
              <h2 className="text-xl font-heading font-bold text-primary-dark mb-3">Other Interventions</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                In addition to the core treatments, many patients find relief from:
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700 m-0 p-0 list-none">
                <li className="flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500" /> Hot and cold therapy</li>
                <li className="flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500" /> TENS (Transcutaneous Electrical Nerve Stimulation)</li>
                <li className="flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500" /> Acupuncture</li>
                <li className="flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500" /> Manual therapy / Massage</li>
              </ul>
            </div>
            
            <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-800 text-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
              <span>Always consult with a physiotherapist to create a safe, individualized plan.</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
