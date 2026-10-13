import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, ChevronDown } from 'lucide-react';

const defaultFaqs = [
  {
    q: "Is osteoarthritis the same as other types of arthritis?",
    a: "OA is the most common form of arthritis — it is caused by wear and tear of joint cartilage. Unlike rheumatoid arthritis, OA is not an autoimmune disease. It typically develops gradually with age and is most common in knees, hips, and hands.",
  },
  {
    q: "Is osteoarthritis reversible?",
    a: "OA cannot be fully reversed, but its progression can be significantly slowed. With the right exercise, weight management, medications, and lifestyle changes, most people can manage their pain effectively and maintain good quality of life.",
  },
  {
    q: "Can exercise make my OA worse?",
    a: "No — in fact, regular low-impact exercise is one of the best treatments for OA. It strengthens the muscles around the joint, reduces pain, and improves mobility. Avoid high-impact activities like running or jumping. Swimming, cycling, and the exercises in our library are ideal.",
  },
  {
    q: "How can I manage pain at home?",
    a: "Effective home pain management includes: applying heat or cold packs, doing your prescribed exercises regularly, taking medications as directed by your doctor, maintaining a healthy weight, using assistive devices such as a walking stick, and pacing your activities to avoid overexertion.",
  },
  {
    q: "Are there natural remedies that help OA?",
    a: "Some people find relief with turmeric (curcumin), ginger, and omega-3 fatty acids from oily fish. These have anti-inflammatory properties. However, always discuss supplements with your doctor before taking them, as they may interact with medications.",
  },
  {
    q: "What are the side effects of pain medications?",
    a: "Paracetamol is generally safe at recommended doses. NSAIDs (like ibuprofen) can cause stomach irritation, kidney issues, and raised blood pressure with long-term use. Always take with food and consult your doctor about the safest option for you, especially if you have other health conditions.",
  },
  {
    q: "Should I use heat or cold for pain?",
    a: "Use HEAT for morning stiffness and before exercise — it relaxes muscles and improves circulation. Use COLD after exercise or during flare-ups — it reduces swelling and numbs acute pain. Never apply ice directly to skin; always wrap it in a towel.",
  },
  {
    q: "When should I consider surgery?",
    a: "Surgery (typically joint replacement) is considered when pain is severe and not controlled by other treatments, when mobility is significantly affected, or when quality of life is greatly reduced. Your doctor will discuss this option with you when conservative treatments are no longer effective.",
  },
  {
    q: "Can diet really affect my OA?",
    a: "Yes. An anti-inflammatory diet rich in omega-3 fatty acids, fruits, vegetables, and olive oil can help reduce joint inflammation. Maintaining a healthy weight through diet is also critical — every 1 kg lost reduces knee joint pressure by 4 kg.",
  },
  {
    q: "How often should I do my exercises?",
    a: "Aim to do your prescribed exercises at least 4–5 times per week. Consistency is more important than intensity. Start slowly if you are new to exercise, and gradually increase. If you experience pain that lasts more than 2 hours after exercise, reduce the intensity and speak with your physiotherapist.",
  },
  {
    q: "Can I still work and live normally with OA?",
    a: "Yes, most people with OA continue working and living full lives. You may need to modify some activities, use assistive devices, take regular breaks, and adjust your work setup for ergonomics. Discuss reasonable adjustments with your employer if needed.",
  },
  {
    q: "What assistive devices are recommended for OA?",
    a: "Common assistive devices include: a walking stick or cane (held on the opposite side of the affected joint), knee braces or supports, cushioned shoe insoles, grab rails in the bathroom, and long-handled tools for daily tasks. Ask your physiotherapist for personalised recommendations.",
  },
  {
    q: "Is swimming good for OA?",
    a: "Yes — swimming and water aerobics are excellent for OA. Water supports your body weight, reducing joint stress while allowing full range of motion. It is particularly recommended for those with severe pain or obesity where land exercises are difficult.",
  },
];

async function fetchFAQs() {
  return defaultFaqs;
}

export default function FAQ() {
  const [faqItems, setFaqItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "FAQs — OA Care";
    return () => { document.title = "OA Care"; };
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await fetchFAQs();
        if (!Array.isArray(data)) {
          throw new Error("FAQ data did not return a list.");
        }
        if (isMounted) {
          setFaqItems(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load FAQs.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFaqs = faqItems.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* PAGE HEADER */}
        <div className="bg-white border-b border-slate-100 py-10 md:py-14">
          <div className="container-main">
            <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Home / FAQ</div>
            <h1 className="section-title mb-0">Frequently Asked Questions</h1>
            <p className="section-subtitle mb-0 mt-2">Common questions about OA answered</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-white border-b border-slate-100 py-4 sticky top-16 z-30">
          <div className="container-main">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 shrink-0" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
                placeholder="Search questions..."
              />
            </div>
            {searchQuery && !loading && !error && (
              <div className="text-sm text-slate-400 mt-2 text-center">
                {filteredFaqs.length} result{filteredFaqs.length !== 1 && 's'}
              </div>
            )}
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="container-main section-pad max-w-3xl mx-auto space-y-3">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-100 px-6 py-5 text-slate-500 shadow-card">
              Loading FAQs...
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-2xl border border-red-100 px-6 py-5 text-red-700 shadow-card">
              Error: {error}
            </div>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const originalIndex = faqItems.indexOf(faq);
              const isOpen = openIndex === originalIndex;
              
              return (
                <div key={originalIndex} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card hover:shadow-md transition-shadow">
                  <div 
                    onClick={() => toggleOpen(originalIndex)}
                    className={`w-full flex items-center justify-between px-6 py-5 cursor-pointer text-left hover:bg-slate-50 transition-colors ${isOpen ? 'bg-blue-50/50 text-primary' : ''}`}
                  >
                    <div className={`font-semibold text-base pr-4 flex-1 ${isOpen ? 'text-primary' : 'text-slate-800'}`}>
                      {faq.q}
                    </div>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isOpen ? 'text-primary rotate-180' : 'text-slate-400'}`} />
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <Search className="text-slate-200 w-12 h-12 mx-auto mb-4" />
              <p className="font-semibold text-slate-500 mb-1 mt-0">
                No questions found for '{searchQuery}'
              </p>
              <p className="text-slate-400 text-sm mb-4 mt-0">
                Try different keywords or browse all questions
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="btn-secondary text-sm py-2 px-4 cursor-pointer border-0"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
