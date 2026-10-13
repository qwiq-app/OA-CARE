import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Pill, Syringe, Info, AlertTriangle, CheckCircle2, Circle, BookOpen, ChevronDown } from 'lucide-react';

const medications = [
  {
    category: "Topical NSAIDs (First-Line)",
    badge: "First-Line",
    icon: Pill,
    dosage: ["Diclofenac 1% gel — 2-4g, 3-4x/day", "Diclofenac 1.5% solution — 40 drops, 2x/day"],
    evidence: "Preferred for knee OA in elderly. Lower systemic side effects.",
    precautions: "Avoid broken skin. Wash hands post-application.",
    sideEffects: "Local skin irritation, rarely systemic GI effects.",
    references: "OARSI 2019; ACR 2019; EULAR 2018",
  },
  {
    category: "Oral NSAIDs",
    badge: null,
    icon: Pill,
    dosage: ["Ibuprofen 200-400mg TDS (with food)", "Naproxen 250-500mg BD (with food)", "Celecoxib 100-200mg OD/BD (COX-2 selective)"],
    evidence: "Lowest effective dose, shortest duration. Add PPI if GI risk.",
    precautions: "Contraindicated in peptic ulcer, CKD, CVD. Monitor BP & renal function.",
    sideEffects: "GI bleeding, renal impairment, cardiovascular risk, fluid retention.",
    references: "ACR 2019; NICE CG177 2022; EULAR 2018",
  },
  {
    category: "Analgesics",
    badge: "Baseline Option",
    icon: Pill,
    dosage: ["Paracetamol 325-650mg q4-6h (max 3g/day elderly)", "Tramadol 50mg BD-TDS (short-term; ≤4 weeks)"],
    evidence: "Paracetamol: first-line baseline analgesic. Tramadol: refractory pain only.",
    precautions: "Paracetamol: avoid >3g/day in liver disease. Tramadol: fall risk, dependence.",
    sideEffects: "Hepatotoxicity (overdose); Tramadol: dizziness, constipation, dependence.",
    references: "ACR 2019; EULAR 2018; NICE CG177",
  },
  {
    category: "Duloxetine (SNRI)",
    badge: "Strongly Recommended",
    icon: Pill,
    dosage: ["Duloxetine 30mg/day x1 week, then 60mg/day"],
    evidence: "Strongly recommended ACR 2019. Use when NSAIDs contraindicated or widespread pain.",
    precautions: "Monitor for suicidality. Taper slowly. Avoid in uncontrolled narrow-angle glaucoma.",
    sideEffects: "Nausea, dry mouth, fatigue, insomnia, dizziness.",
    references: "ACR 2019; EULAR 2018",
  },
  {
    category: "SySADOAs",
    badge: null,
    icon: Pill,
    dosage: ["Glucosamine sulfate 1500mg/day", "Chondroitin sulfate 800-1200mg/day", "Diacerhein 50mg BD"],
    evidence: "Moderate evidence. ESCEO recommends as Step 1. 3-month trial.",
    precautions: "Diacerhein: avoid in liver disease. GI upset common.",
    sideEffects: "GI discomfort, diarrhea (Diacerhein), allergic reaction (shellfish allergy — glucosamine).",
    references: "ESCEO 2019; EULAR 2018",
  },
];

const injections = [
  {
    category: "Intra-articular Corticosteroids",
    badge: "Short-Term Use",
    icon: Syringe,
    accentClass: "text-primary",
    dosage: ["Triamcinolone acetonide 40mg", "Methylprednisolone 40-80mg"],
    evidence: "Short-term relief 4-8 weeks. Max 3-4x/year.",
    precautions: "Clinician-administered only. Monitor blood glucose (diabetes).",
    sideEffects: "Post-injection flare (24-48h), infection, cartilage damage with repeated use.",
    references: "ACR 2019; OARSI 2019",
  },
  {
    category: "Intra-articular Hyaluronic Acid",
    badge: null,
    icon: Syringe,
    accentClass: "text-blue-500",
    dosage: ["Sodium hyaluronate 20-25mg weekly x3-5"],
    evidence: "Moderate evidence for knee OA. Conditionally recommended ACR 2019.",
    precautions: "Avoid in active joint infection or allergy to avian products.",
    sideEffects: "Local swelling, injection site pain (transient).",
    references: "ACR 2019; OARSI 2019",
  },
];

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 mb-8 text-xs text-slate-500">
      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Recommended use</span>
      <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Precautions</span>
      <span className="flex items-center gap-1.5"><Circle className="w-3 h-3 text-red-400 fill-red-400" /> Side effects</span>
      <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> Clinical references</span>
    </div>
  );
}

function AccordionCard({ item, isOpen, onToggle, borderClass }) {
  const Icon = item.icon;
  return (
    <div className={`card overflow-hidden ${borderClass || ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 text-left py-1 cursor-pointer border-0 bg-transparent outline-none p-0 focus:outline-none"
      >
        <Icon className={`w-7 h-7 shrink-0 ${item.accentClass || 'text-primary'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-primary-dark m-0">{item.category}</h3>
            {item.badge && (
              <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-0.5">
                {item.badge}
              </span>
            )}
          </div>
          {!isOpen && (
            <p className="text-sm text-slate-500 m-0 mt-1 truncate">{item.evidence}</p>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <ul className="text-sm text-slate-600 leading-relaxed mb-3 pl-1 space-y-1 list-none">
            {item.dosage.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-slate-400">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg p-3 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 font-medium m-0">{item.evidence}</p>
          </div>

          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 m-0"><span className="font-semibold">Precautions:</span> {item.precautions}</p>
          </div>

          <div className="flex items-start gap-2 mb-3">
            <Circle className="w-3 h-3 text-red-400 shrink-0 mt-1.5 fill-red-400" />
            <p className="text-sm text-slate-600 m-0"><span className="font-semibold">Side Effects:</span> {item.sideEffects}</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 w-fit">
            <BookOpen className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-500">{item.references}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PharmaMgmt() {
  const [openMed, setOpenMed] = useState(0);
  const [openInjection, setOpenInjection] = useState(null);

  useEffect(() => {
    document.title = "Medications — OA Care";
    return () => { document.title = "OA Care"; };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="container-main">
            <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Home / Pharmacological Management</div>
            <h1 className="section-title mb-0">Medications & Injections</h1>
            <p className="section-subtitle mb-0 mt-2">An overview of medical therapies used to manage OA pain and inflammation.</p>
          </div>
        </div>

        <section className="bg-white section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-6">Oral and Topical Medications</h2>
            <Legend />
            <div className="space-y-4">
              {medications.map((med, i) => (
                <AccordionCard
                  key={i}
                  item={med}
                  isOpen={openMed === i}
                  onToggle={() => setOpenMed(openMed === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <h2 className="section-title text-center mb-8">Intra-Articular Injections</h2>
            <div className="grid md:grid-cols-2 gap-6 pharma-injections-grid">
              {injections.map((inj, i) => (
                <AccordionCard
                  key={i}
                  item={inj}
                  isOpen={openInjection === i}
                  onToggle={() => setOpenInjection(openInjection === i ? null : i)}
                  borderClass={i === 0 ? "border-t-4 border-t-primary" : "border-t-4 border-t-blue-400"}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white section-pad">
          <div className="container-main max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-4 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <h3 className="text-red-800 font-bold text-base mt-0 mb-1">Important Safety Note</h3>
                <p className="text-sm text-red-700 m-0 leading-relaxed">
                  All medications carry risks. NSAIDs can affect the stomach, heart, and kidneys, especially with long-term use. 
                  Always disclose your complete medical history to your doctor before starting any new medication.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
              <span>Medications should ideally be combined with non-pharmacological treatments like exercise and weight management for best results.</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
