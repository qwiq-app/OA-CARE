import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ExternalLink, AlertCircle, MessageCircle, Mail, Phone } from 'lucide-react';

export default function Resources() {
  useEffect(() => {
    document.title = "Resources — OA Care";
    return () => { document.title = "OA Care"; };
  }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* PAGE HEADER */}
        <div className="bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="container-main">
            <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Home / Resources</div>
            <h1 className="section-title mb-0">Resources & Support</h1>
            <p className="section-subtitle mb-0 mt-2">Guides, links and support for OA patients</p>
          </div>
        </div>

        {/* Section 1: Understanding Osteoarthritis */}
        <section className="bg-white section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <h2 className="section-title text-center">Understanding Osteoarthritis</h2>
            <p className="section-subtitle text-center mb-8">
              Osteoarthritis (OA) is the most common form of arthritis, affecting millions of people worldwide. It occurs when the protective cartilage that cushions the ends of the bones wears down over time.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card border border-slate-100 p-6 rounded-2xl bg-slate-50/50">
                <h3 className="font-heading font-bold text-lg text-primary-dark mb-3 mt-0 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                  Common Symptoms
                </h3>
                <ul className="space-y-2 text-slate-600 text-sm pl-4 list-disc">
                  <li><strong>Pain:</strong> Affected joints may hurt during or after movement.</li>
                  <li><strong>Stiffness:</strong> Joint stiffness might be most noticeable upon awakening or after being inactive.</li>
                  <li><strong>Tenderness:</strong> The joint might feel tender when applying light pressure to or near it.</li>
                  <li><strong>Loss of flexibility:</strong> You might not be able to move the joint through its full range of motion.</li>
                  <li><strong>Grating sensation:</strong> You might feel or hear a scraping or popping sensation when using the joint.</li>
                </ul>
              </div>

              <div className="card border border-slate-100 p-6 rounded-2xl bg-slate-50/50">
                <h3 className="font-heading font-bold text-lg text-primary-dark mb-3 mt-0 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  Evidence-Based Self-Care
                </h3>
                <ul className="space-y-2 text-slate-600 text-sm pl-4 list-disc">
                  <li><strong>Low-Impact Exercise:</strong> Activities like swimming, cycling, and walking strengthen muscles around the joints without putting excessive impact on them.</li>
                  <li><strong>Weight Management:</strong> Maintaining a healthy weight reduces the load on weight-bearing joints (such as hips and knees) and minimizes inflammatory markers.</li>
                  <li><strong>Physical Therapy:</strong> Structured exercises under guidance help restore mobility, flexibility, and stability.</li>
                  <li><strong>Temperature Therapy:</strong> Applying heat helps relax stiff muscles, while cold packs can relieve acute joint swelling and pain.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-background section-pad">
          <div className="container-main">
            <h2 className="section-title text-center">Useful Links</h2>
            <p className="section-subtitle text-center mb-8">Trusted external resources for more information</p>
            
            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              <a href="https://www.arthritis.org/" target="_blank" rel="noopener noreferrer" className="card hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-start gap-4 no-underline block cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ExternalLink className="text-primary w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-700 mb-1 mt-0">Arthritis Foundation</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3 m-0">Comprehensive information on all types of arthritis, treatments, and community support.</p>
                  <div className="text-primary text-sm font-medium flex items-center gap-1 group-hover:underline">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> Visit
                  </div>
                </div>
              </a>

              <a href="https://www.who.int/news-room/fact-sheets/detail/osteoarthritis" target="_blank" rel="noopener noreferrer" className="card hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-start gap-4 no-underline block cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ExternalLink className="text-primary w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-700 mb-1 mt-0">WHO Osteoarthritis Facts</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3 m-0">Global statistics and public health perspective on osteoarthritis from the World Health Organization.</p>
                  <div className="text-primary text-sm font-medium flex items-center gap-1 group-hover:underline">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> Visit
                  </div>
                </div>
              </a>

              <a href="https://www.nhs.uk/conditions/osteoarthritis/" target="_blank" rel="noopener noreferrer" className="card hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-start gap-4 no-underline block cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ExternalLink className="text-primary w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-700 mb-1 mt-0">NHS Guide to OA</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3 m-0">Detailed clinical guide covering diagnosis, prevention, and treatment options available.</p>
                  <div className="text-primary text-sm font-medium flex items-center gap-1 group-hover:underline">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> Visit
                  </div>
                </div>
              </a>

              <a href="https://oarsi.org/" target="_blank" rel="noopener noreferrer" className="card hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-start gap-4 no-underline block cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ExternalLink className="text-primary w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-700 mb-1 mt-0">OARSI</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-3 m-0">Osteoarthritis Research Society International — for those interested in the latest clinical research.</p>
                  <div className="text-primary text-sm font-medium flex items-center gap-1 group-hover:underline">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" /> Visit
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500 w-6 h-6 shrink-0" />
                <h3 className="text-red-800 font-heading font-bold text-xl m-0">When to Seek Urgent Help</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700 leading-relaxed">Sudden severe increase in joint pain</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700 leading-relaxed">Joint becomes hot, red and very swollen</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700 leading-relaxed">Unable to bear weight on the joint</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700 leading-relaxed">Joint locks or suddenly gives way</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-red-400 w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700 leading-relaxed">Fever with joint pain</span>
                </div>
              </div>
              
              <div className="border-t border-red-200 mt-5 pt-4">
                <p className="font-semibold text-red-800 text-sm m-0">Contact your doctor or go to the nearest emergency department immediately</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-background section-pad">
          <div className="max-w-4xl mx-auto px-4">
            <div className="card max-w-md mx-auto text-center border border-slate-100">
              <MessageCircle className="text-primary w-10 h-10 mx-auto mb-3 shrink-0" />
              <h3 className="font-heading font-bold text-xl text-primary-dark mb-2 mt-0">Need More Help?</h3>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Our support team is available during business hours for technical questions regarding the platform.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-slate-600 text-sm mb-2">
                <Mail className="w-4 h-4 text-primary shrink-0" /> support@oacare.in
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-600 text-sm mb-2">
                <Phone className="w-4 h-4 text-primary shrink-0" /> +91 1800 123 4567
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-50">
                <p className="text-xs text-slate-400 m-0">This website does not provide personal medical advice</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
