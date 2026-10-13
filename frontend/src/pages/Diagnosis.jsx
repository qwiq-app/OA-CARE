import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Activity, Stethoscope, Search, Layers, Info } from 'lucide-react';

const steps = [
  "Medical History",
  "Physical Exam",
  "X-Ray",
  "MRI if needed",
  "Blood tests to rule out RA",
];

const grades = [
  ["Grade 1", "Mild joint changes, often with little or no narrowing."],
  ["Grade 2", "Possible bone spurs and mild joint-space narrowing."],
  ["Grade 3", "Clear joint-space narrowing and more visible bone changes."],
  ["Grade 4", "Severe narrowing with significant joint changes."],
];

export default function Diagnosis() {
  useEffect(() => {
    document.title = "Diagnosis — OA Care";
    return () => { document.title = "OA Care"; };
  }, []);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="container-main">
            <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Home / Diagnosis</div>
            <h1 className="section-title mb-0">Diagnosis</h1>
            <p className="section-subtitle mb-0 mt-2">A patient-friendly overview of how clinicians assess hip and knee osteoarthritis.</p>
          </div>
        </div>

        <section className="bg-white section-pad">
          <div className="container-main">
            <h2 className="section-title text-center mb-8">How is OA Diagnosed?</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="card flex items-center gap-4 text-base font-semibold text-primary-dark">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0">
                    {index + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background section-pad">
          <div className="container-main">
            <h2 className="section-title text-center mb-8">What to Expect at Your Appointment</h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
              {["Questions about pain and daily activities", "Joint movement and strength checks", "Walking and balance observation", "Review of medicines and medical history", "Discussion of exercise and treatment options", "Plan for follow-up or imaging if needed"].map((item) => (
                <div key={item} className="card flex gap-3 text-sm leading-relaxed text-slate-700">
                  <Stethoscope className="w-5 h-5 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-8">Understanding X-Ray Grades</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Grade</th>
                    <th className="px-6 py-4 font-semibold">What it may mean</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grades.map(([grade, meaning]) => (
                    <tr key={grade} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-primary-dark">{grade}</td>
                      <td className="px-6 py-4 text-slate-600">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="bg-background section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <div className="card mb-6 border-l-4 border-l-primary">
              <h2 className="text-xl font-heading font-bold text-primary-dark mb-3">WOMAC Score Explained</h2>
              <p className="text-sm leading-relaxed text-slate-600 m-0">
                WOMAC is a questionnaire used to understand how osteoarthritis affects pain, stiffness,
                and daily activities. It helps clinicians track changes over time and discuss which parts
                of daily life need the most support.
              </p>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <span>Only a qualified clinician can diagnose osteoarthritis and rule out other conditions.</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
