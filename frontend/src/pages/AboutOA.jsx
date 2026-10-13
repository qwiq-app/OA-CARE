import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Activity, Target, Clock, Weight, Zap, Users, User, Repeat } from 'lucide-react';

export default function AboutOA() {
  useEffect(() => {
    document.title = "About OA — OA Care";
    return () => { document.title = "OA Care"; };
  }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* PAGE HEADER */}
        <div className="bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="container-main">
            <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Home / About OA</div>
            <h1 className="section-title mb-0">About Osteoarthritis</h1>
            <p className="section-subtitle mb-0 mt-2">Understanding OA, its causes and progression</p>
          </div>
        </div>

        {/* Section 1 */}
        <section className="bg-white section-pad">
          <div className="container-main">
            <div className="md:grid md:grid-cols-2 gap-10 items-start">
              <div className="space-y-4 text-slate-600 leading-relaxed mb-8 md:mb-0">
                <p>
                  Osteoarthritis (OA) is the most common form of arthritis, affecting millions of people worldwide. It occurs when the protective cartilage that cushions the ends of the bones wears down over time.
                </p>
                <p>
                  Although OA can damage any joint, the disorder most commonly affects joints in your hands, knees, hips, and spine. It is a progressive disease, meaning it tends to gradually worsen over time if left unmanaged.
                </p>
                <p>
                  While OA cannot be cured, the symptoms can usually be managed effectively. Staying active, maintaining a healthy weight, and certain medical treatments can slow progression of the disease and help improve pain and joint function.
                </p>
              </div>
              <div className="card bg-blue-50 border-blue-100">
                <h3 className="font-semibold text-primary-dark mb-4 text-lg">Key Facts</h3>
                <ul className="space-y-3 m-0 p-0 list-none">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Affects joint cartilage and surrounding bone</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Most common in knees, hips and hands</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">More common in women and people over 50</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Not simply 'wear and tear' — it is a disease</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Cannot be cured but can be managed effectively</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-background section-pad">
          <div className="container-main">
            <h2 className="section-title text-center">Hip vs Knee Osteoarthritis</h2>
            <p className="section-subtitle text-center mb-8">Understanding the differences in symptoms and impact</p>
            
            <div className="md:grid md:grid-cols-2 gap-6">
              {/* Hip Card */}
              <div className="card mt-6 md:mt-0">
                <div className="bg-primary text-white rounded-xl px-4 py-3 flex items-center gap-3 mb-5 -mx-6 -mt-6 rounded-t-2xl">
                  <Activity className="w-5 h-5 shrink-0" />
                  <span className="text-lg font-semibold">Hip Osteoarthritis</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm leading-relaxed m-0">Pain typically felt in the groin, thigh, or buttock area.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm leading-relaxed m-0">Pain is usually worse with weight-bearing activities or walking.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm leading-relaxed m-0">Difficulty putting on shoes and socks due to decreased range of motion.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm leading-relaxed m-0">A limp often develops as the condition progresses.</p>
                  </div>
                </div>
              </div>

              {/* Knee Card */}
              <div className="card mt-12 md:mt-0">
                <div className="bg-primary text-white rounded-xl px-4 py-3 flex items-center gap-3 mb-5 -mx-6 -mt-6 rounded-t-2xl">
                  <Target className="w-5 h-5 shrink-0" />
                  <span className="text-lg font-semibold">Knee Osteoarthritis</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm leading-relaxed m-0">Pain concentrated around the knee joint itself.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm leading-relaxed m-0">Pain often worsens when climbing stairs or kneeling.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm leading-relaxed m-0">The knee may feel weak, unstable, or tend to "give way".</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                    <p className="text-slate-600 text-sm leading-relaxed m-0">Visible swelling or a feeling of "catching" or locking in the joint.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white section-pad">
          <div className="container-main">
            <h2 className="section-title text-center">The 4 Grades of OA</h2>
            <p className="section-subtitle text-center mb-8">How osteoarthritis progresses over time</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 about-grades-grid">
              <div className="card text-center border-2 border-green-200">
                <div className="text-4xl font-bold font-heading text-green-500 mb-2 mt-2">1</div>
                <div className="font-semibold text-slate-700 mb-2">Mild</div>
                <p className="text-sm text-slate-500 leading-relaxed m-0 pb-2">Minor bone spur growth</p>
              </div>
              <div className="card text-center border-2 border-yellow-200">
                <div className="text-4xl font-bold font-heading text-yellow-500 mb-2 mt-2">2</div>
                <div className="font-semibold text-slate-700 mb-2">Moderate</div>
                <p className="text-sm text-slate-500 leading-relaxed m-0 pb-2">Noticeable bone spurs</p>
              </div>
              <div className="card text-center border-2 border-orange-200">
                <div className="text-4xl font-bold font-heading text-orange-500 mb-2 mt-2">3</div>
                <div className="font-semibold text-slate-700 mb-2">Severe</div>
                <p className="text-sm text-slate-500 leading-relaxed m-0 pb-2">Cartilage damage</p>
              </div>
              <div className="card text-center border-2 border-red-200">
                <div className="text-4xl font-bold font-heading text-red-500 mb-2 mt-2">4</div>
                <div className="font-semibold text-slate-700 mb-2">Critical</div>
                <p className="text-sm text-slate-500 leading-relaxed m-0 pb-2">Cartilage mostly gone</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-background section-pad">
          <div className="container-main">
            <h2 className="section-title text-center">Risk Factors</h2>
            <p className="section-subtitle text-center mb-8">Elements that increase your likelihood of developing OA</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="card flex items-start gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 text-sm mb-0.5">Age</div>
                  <p className="text-xs text-slate-400 leading-relaxed m-0">Risk increases significantly after age 50</p>
                </div>
              </div>

              <div className="card flex items-start gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Weight className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 text-sm mb-0.5">Obesity</div>
                  <p className="text-xs text-slate-400 leading-relaxed m-0">Every extra kg adds 4x load to knees</p>
                </div>
              </div>

              <div className="card flex items-start gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Zap className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 text-sm mb-0.5">Previous Injury</div>
                  <p className="text-xs text-slate-400 leading-relaxed m-0">Joint injuries increase OA risk</p>
                </div>
              </div>

              <div className="card flex items-start gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Users className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 text-sm mb-0.5">Family History</div>
                  <p className="text-xs text-slate-400 leading-relaxed m-0">Genetics play a role in OA risk</p>
                </div>
              </div>

              <div className="card flex items-start gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <User className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 text-sm mb-0.5">Gender</div>
                  <p className="text-xs text-slate-400 leading-relaxed m-0">Women are more affected, especially after menopause</p>
                </div>
              </div>

              <div className="card flex items-start gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Repeat className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="font-semibold text-slate-700 text-sm mb-0.5">Repetitive Use</div>
                  <p className="text-xs text-slate-400 leading-relaxed m-0">Occupational overuse of joints</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
