import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  CheckCircle, Check, XCircle, X, 
  Moon, Armchair, Footprints, Brain, Utensils, Car 
} from 'lucide-react';

export default function Counselling() {
  useEffect(() => {
    document.title = "Patient Counselling — OA Care";
    return () => { document.title = "OA Care"; };
  }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* PAGE HEADER */}
        <div className="bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="container-main">
            <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Home / Counselling</div>
            <h1 className="section-title mb-0">Patient Counselling</h1>
            <p className="section-subtitle mb-0 mt-2">Guidance for living well with OA</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white section-pad">
          <div className="container-main">
            <h2 className="section-title text-center mb-8">Do's and Don'ts</h2>
            
            <div className="md:grid md:grid-cols-2 gap-6">
              {/* DO'S card */}
              <div className="card border-l-4 border-green-400 border-t-0 border-r-0 border-b-0 rounded-l-none">
                <div className="flex items-center gap-2 mb-5">
                  <CheckCircle className="text-green-500 w-6 h-6 shrink-0" />
                  <h3 className="text-xl font-heading text-green-700 font-bold m-0">Do's</h3>
                </div>
                <ul className="space-y-3 m-0 p-0 list-none">
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Take medications as prescribed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Attend physiotherapy sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Exercise regularly with low-impact activities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Manage your weight</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Use walking aids when needed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Apply heat/cold therapy as directed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Wear supportive footwear</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Pace your activities throughout the day</span>
                  </li>
                </ul>
              </div>

              {/* DON'TS card */}
              <div className="card border-l-4 border-red-400 border-t-0 border-r-0 border-b-0 rounded-l-none mt-6 md:mt-0">
                <div className="flex items-center gap-2 mb-5">
                  <XCircle className="text-red-500 w-6 h-6 shrink-0" />
                  <h3 className="text-xl font-heading text-red-700 font-bold m-0">Don'ts</h3>
                </div>
                <ul className="space-y-3 m-0 p-0 list-none">
                  <li className="flex items-start gap-3">
                    <X className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Skip prescribed medications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">High-impact activities (running, jumping)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Stand or sit in one position too long</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Ignore persistent pain</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Self-medicate without advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Wear high heels or flat unsupportive shoes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <X className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed text-sm">Push through severe pain during exercise</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-background section-pad">
          <div className="container-main">
            <h2 className="section-title text-center">Daily Living Tips</h2>
            <p className="section-subtitle text-center mb-8">Small changes to make your daily routine easier</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div className="card hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-indigo-50 text-indigo-600">
                  <Moon className="w-6 h-6 shrink-0" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2 mt-0">Sleep Position</h3>
                <p className="text-sm text-slate-500 leading-relaxed m-0">Sleep on your side with a pillow between knees to reduce hip and knee strain.</p>
              </div>

              <div className="card hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-blue-50 text-primary">
                  <Armchair className="w-6 h-6 shrink-0" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2 mt-0">Seating & Posture</h3>
                <p className="text-sm text-slate-500 leading-relaxed m-0">Use chairs with armrests. Keep knees at 90° when seated. Avoid low soft sofas.</p>
              </div>

              <div className="card hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-green-50 text-green-600">
                  <Footprints className="w-6 h-6 shrink-0" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2 mt-0">Footwear</h3>
                <p className="text-sm text-slate-500 leading-relaxed m-0">Wear flat, cushioned, supportive shoes. Avoid high heels. Consider orthotic insoles.</p>
              </div>

              <div className="card hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-purple-50 text-purple-600">
                  <Brain className="w-6 h-6 shrink-0" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2 mt-0">Stress Management</h3>
                <p className="text-sm text-slate-500 leading-relaxed m-0">Chronic stress worsens pain. Try deep breathing, meditation or gentle yoga.</p>
              </div>

              <div className="card hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-orange-50 text-orange-600">
                  <Utensils className="w-6 h-6 shrink-0" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2 mt-0">Kitchen & Cooking</h3>
                <p className="text-sm text-slate-500 leading-relaxed m-0">Use long-handled tools. Sit while preparing food. Keep frequently used items within reach.</p>
              </div>

              <div className="card hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-teal-50 text-teal-600">
                  <Car className="w-6 h-6 shrink-0" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-2 mt-0">Getting Around</h3>
                <p className="text-sm text-slate-500 leading-relaxed m-0">Use a walking stick on the opposite side of the affected joint. Install grab rails at home.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
