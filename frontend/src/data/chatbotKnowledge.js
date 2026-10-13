// Knowledge base for the OA Care help assistant.
// Every answer is drawn from content already published on the site's pages
// (About, Symptoms, Diagnosis, Counselling, Pharmacological, Non-Pharmacological,
// FAQ, Resources) plus how-to help for the site's own features.
//
// Each intent:
//   keywords – single words/phrases that signal the topic (weighted 1)
//   strong   – highly specific words/phrases (weighted 3)
//   answer   – reply text. Lines starting with "• " render as bullets, **x** renders bold.
//   links    – in-app pages to suggest
//   followUps – suggested next questions (shown as quick-reply chips)

export const SUGGESTED_STARTERS = [
  'What is osteoarthritis?',
  'Show knee exercises',
  'Heat or cold for pain?',
  'How do I log my pain?',
  'When should I see a doctor urgently?',
];

export const intents = [
  // ── Conversation ────────────────────────────────────────────
  {
    id: 'greeting',
    strong: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening', 'good afternoon', 'hii', 'helo'],
    keywords: [],
    answer:
      "Hello! I'm the OA Care assistant. I can answer questions about hip and knee osteoarthritis, the exercises on this site, treatments, and how to use your dashboard. What would you like to know?",
    followUps: SUGGESTED_STARTERS.slice(0, 4),
  },
  {
    id: 'thanks',
    strong: ['thank', 'thanks', 'thx', 'thankyou', 'great help', 'helpful'],
    keywords: [],
    answer: "You're welcome! Is there anything else I can help you with?",
    followUps: ['Show hip exercises', 'Tips for daily living', 'What foods help OA?'],
  },
  {
    id: 'bye',
    strong: ['bye', 'goodbye', 'see you', 'good night'],
    keywords: [],
    answer: 'Take care of your joints! You can open this chat again any time from the button in the corner.',
  },
  {
    id: 'about_bot',
    strong: ['who are you', 'what can you do', 'what are you', 'help me', 'how can you help', 'your name'],
    keywords: ['bot', 'assistant', 'chatbot'],
    answer:
      "I'm the OA Care help assistant. I can help with:\n• Osteoarthritis basics, causes and symptoms\n• Step-by-step instructions for all 20 exercises\n• Medicines and non-drug treatments covered on this site\n• Using the site: registering, logging exercises, the pain diary and your dashboard\n\nI give general education only, not personal medical advice.",
    followUps: SUGGESTED_STARTERS.slice(0, 4),
  },

  // ── Emergency / red flags (checked with priority by the engine) ──
  {
    id: 'emergency',
    priority: true,
    strong: [
      'emergency', 'urgent', 'urgently', 'severe pain', 'cannot walk', "can't walk", 'cant walk',
      'unable to walk', 'bear weight', 'red and swollen', 'hot joint', 'fever', 'locked', 'gives way',
      'give way', 'numb', 'numbness', 'sudden pain', 'had a fall', 'after a fall', 'after an injury', 'after injury',
      'hot and swollen', 'swollen and hot', 'hot and red', 'red and hot', 'very swollen', 'suddenly swollen',
      'sudden swelling', 'very hot', 'very red', 'cannot stand', "can't stand", 'cant stand', 'unbearable',
    ],
    keywords: ['red', 'swollen', 'warm', 'sudden', 'suddenly', 'doctor', 'hospital'],
    answer:
      "⚠️ **Seek medical help promptly** if you notice any of these:\n• Sudden severe increase in joint pain\n• The joint becomes hot, red and very swollen, or you have a fever\n• You are unable to bear weight on the joint\n• The joint locks or suddenly gives way\n• Rapid swelling after an injury\n• Numbness, weakness, or pain that keeps getting worse\n\nContact your doctor or go to the nearest emergency department immediately. This assistant cannot assess emergencies.",
    links: [{ label: 'Symptoms & warning signs', to: '/symptoms' }, { label: 'Resources', to: '/resources' }],
  },

  // ── About OA ────────────────────────────────────────────────
  {
    id: 'what_is_oa',
    strong: ['what is osteoarthritis', 'what is oa', 'define osteoarthritis', 'meaning of osteoarthritis', 'about oa', 'explain osteoarthritis'],
    keywords: ['osteoarthritis', 'arthritis', 'cartilage', 'disease', 'condition'],
    answer:
      "**Osteoarthritis (OA)** is a long-term joint condition that affects the cartilage and the bone around it.\n• Most common in the knees, hips and hands\n• More common in women and people over 50\n• It is a disease, not simply \"wear and tear\"\n• It cannot be cured, but it can be managed effectively with exercise, weight management, medicines and lifestyle changes",
    links: [{ label: 'About OA', to: '/about' }],
    followUps: ['What causes OA?', 'Hip vs knee OA', 'Is OA reversible?'],
  },
  {
    id: 'causes',
    strong: ['risk factor', 'risk factors', 'cause', 'causes', 'why do i have', 'who gets', 'reason for'],
    keywords: ['risk', 'age', 'genetic', 'genetics', 'menopause', 'obesity', 'overweight', 'hereditary', 'develop'],
    answer:
      "Things that increase the chance of developing OA:\n• **Age** – risk rises significantly after 50\n• **Weight** – every extra kg adds about 4× that load on the knees\n• **Joint injury** – past injuries increase OA risk\n• **Genetics** – OA can run in families\n• **Sex** – women are more affected, especially after menopause\n• **Occupation** – repeated overuse of joints at work",
    links: [{ label: 'About OA – risk factors', to: '/about' }],
    followUps: ['How does weight affect OA?', 'Is OA reversible?'],
  },
  {
    id: 'hip_vs_knee',
    strong: ['hip vs knee', 'difference between hip and knee', 'hip or knee', 'hip and knee difference'],
    keywords: ['difference', 'compare', 'versus', 'vs', 'groin', 'buttock', 'thigh'],
    answer:
      "**Hip OA** – pain usually in the groin, thigh or buttock; worse with walking and weight-bearing; difficulty putting on shoes and socks; a limp may develop.\n\n**Knee OA** – pain around the knee itself; worse on stairs or when kneeling; the knee may feel weak or \"give way\"; swelling or a catching/locking feeling.",
    links: [{ label: 'Hip vs Knee OA', to: '/about' }],
    followUps: ['Show hip exercises', 'Show knee exercises'],
  },
  {
    id: 'reversible',
    strong: ['reversible', 'reverse', 'cure', 'cured', 'curable', 'go away', 'permanent', 'heal'],
    keywords: ['fix', 'recover', 'recovery'],
    answer:
      "OA cannot be fully reversed, but its progression can be significantly slowed. With the right exercise, weight management, medicines and lifestyle changes, most people manage their pain well and keep a good quality of life.",
    links: [{ label: 'Treatment options', to: '/non-pharmacological' }],
    followUps: ['Best non-drug treatments', 'How often should I exercise?'],
  },
  {
    id: 'other_arthritis',
    strong: ['rheumatoid', 'types of arthritis', 'same as arthritis', 'autoimmune', 'other arthritis'],
    keywords: ['type', 'types', 'gout'],
    answer:
      "OA is the most common form of arthritis. Unlike rheumatoid arthritis, OA is **not** an autoimmune disease. It usually develops gradually with age and is most common in the knees, hips and hands.",
    links: [{ label: 'FAQ', to: '/faq' }],
  },

  // ── Symptoms ────────────────────────────────────────────────
  {
    id: 'symptoms',
    strong: ['symptom', 'symptoms', 'signs', 'how do i know', 'do i have oa'],
    keywords: ['pain', 'stiff', 'stiffness', 'swelling', 'crack', 'cracking', 'clicking', 'grinding', 'crepitus', 'weak', 'weakness', 'feel', 'morning'],
    answer:
      "Common OA symptoms:\n• **Pain** – aching or sharp discomfort during or after movement\n• **Stiffness** – especially after waking or sitting for a while\n• **Swelling** – puffiness around the joint\n• **Reduced movement** – difficulty bending or straightening\n• **Crepitus** – cracking, clicking or grinding sounds\n• **Weakness** – the joint may feel unstable or muscles tire quickly\n\nSymptoms can change day to day, so tracking them in the pain diary helps guide safer care.",
    links: [{ label: 'Symptoms page', to: '/symptoms' }],
    followUps: ['When should I see a doctor urgently?', 'How do I log my pain?'],
  },
  {
    id: 'morning_stiffness',
    strong: ['morning stiffness', 'stiff in the morning', 'stiff after sitting', 'stiff when i wake'],
    keywords: [],
    answer:
      "Stiffness after waking or after sitting a while is typical of OA. Helpful steps:\n• Apply **heat** in the morning or before exercise to relax muscles\n• Do gentle stretches such as the Seated Hamstring Stretch or Calf Stretch with Towel\n• Avoid sitting or standing in one position too long",
    links: [{ label: 'Stretching exercises', to: '/exercises' }],
    followUps: ['Heat or cold for pain?', 'Show stretching exercises'],
  },

  // ── Diagnosis ───────────────────────────────────────────────
  {
    id: 'diagnosis',
    strong: ['diagnosis', 'diagnose', 'diagnosed', 'appointment', 'test', 'tests', 'mri', 'scan'],
    keywords: ['checkup', 'check', 'examine', 'examination', 'clinician', 'imaging'],
    answer:
      "At your appointment a clinician will usually:\n• Ask about your pain and daily activities\n• Check joint movement and strength\n• Watch your walking and balance\n• Review your medicines and medical history\n• Discuss exercise and treatment options\n• Plan follow-up or imaging (like an X-ray) if needed\n\nOnly a qualified clinician can diagnose OA and rule out other conditions.",
    links: [{ label: 'Diagnosis page', to: '/diagnosis' }],
    followUps: ['What do X-ray grades mean?'],
  },
  {
    id: 'grades',
    strong: ['grade', 'grades', 'x-ray', 'xray', 'x ray', 'stage', 'stages', 'severity', 'kellgren', 'kl grade'],
    keywords: ['mild', 'moderate', 'severe', 'narrowing', 'spur', 'spurs', 'progress', 'progression'],
    answer:
      "OA is often graded 1–4 on an X-ray:\n• **Grade 1** – mild joint changes, little or no narrowing\n• **Grade 2** – possible bone spurs and mild joint-space narrowing\n• **Grade 3** – clear narrowing and more visible bone changes\n• **Grade 4** – severe narrowing with significant joint changes\n\nYou can save your grade in your profile on the dashboard.",
    links: [{ label: 'Understanding X-ray grades', to: '/diagnosis' }],
  },

  // ── Counselling / daily living ─────────────────────────────
  {
    id: 'dos_donts',
    strong: ["do's and don'ts", 'dos and donts', 'do and dont', 'what should i avoid', 'what to avoid', 'avoid'],
    keywords: ['should', 'shouldnt', 'dont', 'mistake', 'mistakes'],
    answer:
      "**Do:**\n• Take medicines as prescribed and attend physiotherapy\n• Exercise regularly with low-impact activities\n• Use walking aids when needed\n• Use heat/cold therapy as directed\n• Pace your activities through the day\n\n**Don't:**\n• Skip prescribed medicines or self-medicate\n• Do high-impact activities (running, jumping)\n• Stand or sit in one position too long\n• Wear high heels or flat unsupportive shoes\n• Push through severe pain during exercise",
    links: [{ label: 'Counselling', to: '/counselling' }],
    followUps: ['Tips for daily living', 'Which shoes should I wear?'],
  },
  {
    id: 'daily_living',
    strong: ['daily living', 'daily life', 'tips', 'lifestyle', 'routine', 'live with oa', 'work with oa', 'live normally', 'job'],
    keywords: ['home', 'kitchen', 'chair', 'sit', 'sitting', 'stress', 'work', 'everyday'],
    answer:
      "Small changes make daily life easier:\n• **Sleep** on your side with a pillow between your knees\n• **Sitting** – use chairs with armrests, keep knees at 90°, avoid low soft sofas\n• **Footwear** – flat, cushioned, supportive shoes\n• **Kitchen** – sit while preparing food, keep frequently used items within reach, use long-handled tools\n• **Walking** – use a stick on the opposite side of the affected joint; install grab rails\n• **Stress** – deep breathing, meditation or gentle yoga can ease pain\n\nMost people with OA keep working and living full lives — take regular breaks and ask about workplace adjustments if needed.",
    links: [{ label: 'Counselling – daily tips', to: '/counselling' }],
  },
  {
    id: 'sleep',
    strong: ['sleep', 'sleeping', 'bed', 'night pain', 'pain at night'],
    keywords: ['pillow', 'night'],
    answer:
      "Sleep on your side with a pillow between your knees — it reduces strain on the hips and knees. If pain keeps you awake regularly, mention it to your doctor.",
    links: [{ label: 'Counselling', to: '/counselling' }],
  },
  {
    id: 'footwear',
    strong: ['shoe', 'shoes', 'footwear', 'heels', 'insole', 'insoles', 'orthotic'],
    keywords: ['slipper', 'sandal', 'wear'],
    answer:
      "Wear flat, cushioned, supportive shoes. Avoid high heels and flat unsupportive shoes. Cushioned or orthotic insoles can also help.",
    links: [{ label: 'Counselling', to: '/counselling' }],
  },
  {
    id: 'devices',
    strong: ['assistive', 'walking stick', 'cane', 'brace', 'knee brace', 'walker', 'grab rail', 'devices', 'support'],
    keywords: ['stick', 'aid', 'aids', 'device'],
    answer:
      "Helpful assistive devices:\n• A walking stick or cane — hold it on the **opposite** side of the affected joint\n• Knee braces or supports\n• Cushioned shoe insoles\n• Grab rails in the bathroom\n• Long-handled tools for daily tasks\n\nAsk your physiotherapist for personalised recommendations.",
    links: [{ label: 'Non-drug treatments', to: '/non-pharmacological' }],
  },

  // ── Non-pharmacological ─────────────────────────────────────
  {
    id: 'non_pharma',
    strong: ['non pharmacological', 'non-pharmacological', 'non drug', 'without medicine', 'without medication', 'natural treatment', 'treatment options', 'treatments', 'manage oa', 'management'],
    keywords: ['treatment', 'treat', 'manage', 'physiotherapy', 'physio', 'therapy'],
    answer:
      "The core non-drug strategies for OA:\n• **Exercise therapy** – the single most effective non-drug treatment: aerobic (walking, swimming), strengthening and stretching\n• **Weight management** – portion control combined with more activity\n• **Lifestyle & devices** – walking aids, ergonomic home/work adjustments\n• Other options: heat/cold therapy, TENS, manual therapy/massage\n\nAlways consult a physiotherapist for a safe, individualised plan.",
    links: [{ label: 'Non-drug treatments', to: '/non-pharmacological' }, { label: 'Exercise library', to: '/exercises' }],
    followUps: ['Heat or cold for pain?', 'How does weight affect OA?', 'What is TENS?'],
  },
  {
    id: 'heat_cold',
    strong: ['heat', 'cold', 'ice', 'hot pack', 'cold pack', 'ice pack', 'hot water bag', 'compress'],
    keywords: ['warm', 'cool'],
    answer:
      "• Use **HEAT** for morning stiffness and before exercise — it relaxes muscles and improves circulation.\n• Use **COLD** after exercise or during flare-ups — it reduces swelling and numbs acute pain.\n\nNever put ice directly on skin; always wrap it in a towel.",
    links: [{ label: 'Non-drug treatments', to: '/non-pharmacological' }],
  },
  {
    id: 'weight',
    strong: ['weight', 'lose weight', 'weight loss', 'bmi', 'obese', 'obesity', 'overweight', 'fat'],
    keywords: ['kg', 'diet plan', 'slim'],
    answer:
      "Weight has a big effect on knees and hips: **every 1 kg lost reduces knee joint pressure by about 4 kg**. Combine portion control with increased low-impact activity. You can store your weight and height in your dashboard profile.",
    links: [{ label: 'Non-drug treatments', to: '/non-pharmacological' }],
    followUps: ['What foods help OA?'],
  },
  {
    id: 'diet',
    strong: ['diet', 'food', 'foods', 'eat', 'eating', 'nutrition', 'anti-inflammatory', 'omega', 'turmeric', 'ginger'],
    keywords: ['fruit', 'vegetable', 'fish', 'olive', 'meal'],
    answer:
      "An anti-inflammatory diet can help reduce joint inflammation:\n• Omega-3 fatty acids (oily fish)\n• Plenty of fruits and vegetables\n• Olive oil\n• Turmeric (curcumin) and ginger may help some people\n\nKeeping a healthy weight through diet is also key. Always discuss supplements with your doctor, as they may interact with medicines.",
    links: [{ label: 'Non-drug treatments', to: '/non-pharmacological' }],
  },
  {
    id: 'tens',
    strong: ['tens', 'electrical', 'nerve stimulation', 'massage', 'manual therapy'],
    keywords: [],
    answer:
      "**TENS** (Transcutaneous Electrical Nerve Stimulation) uses a small device that sends mild electrical pulses through the skin to help ease pain. Manual therapy and massage are other supportive options. Use them with guidance from a physiotherapist.",
    links: [{ label: 'Non-drug treatments', to: '/non-pharmacological' }],
  },
  {
    id: 'swimming',
    strong: ['swim', 'swimming', 'water aerobics', 'pool', 'cycling', 'cycle', 'walking', 'running', 'jogging', 'yoga'],
    keywords: ['sport', 'sports', 'activity', 'activities'],
    answer:
      "Low-impact activities are best for OA:\n• **Swimming and water aerobics** – excellent; the water supports your weight\n• **Cycling and walking** – strengthen muscles without excess impact\n• **Gentle yoga** – helps flexibility and stress\n\nAvoid high-impact activities like running and jumping.",
    links: [{ label: 'Exercise library', to: '/exercises' }],
  },
  {
    id: 'exercise_frequency',
    strong: ['how often', 'how many times', 'how many days', 'frequency', 'per week', 'every day', 'daily exercise'],
    keywords: ['often', 'times', 'week'],
    answer:
      "Aim to do your exercises at least **4–5 times per week**. Consistency matters more than intensity. Start slowly and build up gradually. If pain lasts more than 2 hours after exercise, reduce the intensity and speak with your physiotherapist.",
    links: [{ label: 'Exercise library', to: '/exercises' }],
  },
  {
    id: 'exercise_worse',
    strong: ['make it worse', 'make oa worse', 'exercise safe', 'is exercise safe', 'hurt when exercising', 'pain during exercise', 'pain after exercise'],
    keywords: ['safe', 'worse', 'harm', 'damage'],
    answer:
      "No — regular low-impact exercise is one of the best treatments for OA. It strengthens the muscles around the joint, reduces pain and improves mobility.\n• Don't push through **severe** pain\n• If pain lasts more than 2 hours after exercising, reduce the intensity\n• Avoid high-impact activity like running or jumping",
    links: [{ label: 'Exercise library', to: '/exercises' }],
  },

  // ── Pharmacological ─────────────────────────────────────────
  {
    id: 'medicines',
    strong: ['medicine', 'medicines', 'medication', 'medications', 'drug', 'drugs', 'tablet', 'tablets', 'pill', 'pills', 'painkiller', 'painkillers', 'pharmacological'],
    keywords: ['prescription', 'dose', 'dosage'],
    answer:
      "Medicines covered on the Pharmacological page:\n• **Topical NSAIDs** (e.g. diclofenac gel) – preferred for knee OA in older adults\n• **Oral NSAIDs** (ibuprofen, naproxen, celecoxib) – lowest dose, shortest time, with food\n• **Paracetamol** – first-line baseline pain relief\n• **Duloxetine** – when NSAIDs aren't suitable or pain is widespread\n• **Supplements** (glucosamine, chondroitin)\n• **Injections** – corticosteroid or hyaluronic acid, given by a clinician\n\nNever self-medicate — always follow your doctor's advice. Medicines work best combined with exercise and weight management.",
    links: [{ label: 'Pharmacological management', to: '/pharmacological' }],
    followUps: ['Side effects of painkillers', 'Tell me about injections', 'Is paracetamol safe?'],
  },
  {
    id: 'side_effects',
    strong: ['side effect', 'side effects', 'safe to take', 'stomach', 'kidney', 'ibuprofen', 'nsaid', 'nsaids', 'naproxen', 'celecoxib'],
    keywords: ['risk', 'harmful', 'ulcer'],
    answer:
      "• **Paracetamol** is generally safe at recommended doses (in older adults the page lists a maximum of 3 g/day; take extra care with liver disease).\n• **NSAIDs** like ibuprofen can cause stomach irritation, kidney problems and raised blood pressure with long-term use — take them with food.\n• **Topical NSAID gels** have fewer whole-body side effects.\n\nAsk your doctor which option is safest for you, especially if you have other health conditions.",
    links: [{ label: 'Pharmacological management', to: '/pharmacological' }],
  },
  {
    id: 'paracetamol',
    strong: ['paracetamol', 'acetaminophen', 'tylenol', 'crocin', 'dolo', 'tramadol'],
    keywords: [],
    answer:
      "**Paracetamol** is the first-line baseline pain reliever for OA and is generally safe at recommended doses. The site notes a maximum of 3 g/day for older adults and to avoid higher doses with liver disease. **Tramadol** is only for short-term use when other pain relief fails, and can cause dizziness, constipation and falls. Follow your doctor's dosing.",
    links: [{ label: 'Pharmacological management', to: '/pharmacological' }],
  },
  {
    id: 'topical',
    strong: ['gel', 'cream', 'ointment', 'diclofenac', 'volini', 'topical', 'rub'],
    keywords: ['apply', 'skin'],
    answer:
      "**Topical NSAIDs** such as diclofenac gel are preferred for knee OA in older adults because they have fewer whole-body side effects. Don't apply them on broken skin, and wash your hands after use. Mild skin irritation can occur.",
    links: [{ label: 'Pharmacological management', to: '/pharmacological' }],
  },
  {
    id: 'supplements',
    strong: ['supplement', 'supplements', 'glucosamine', 'chondroitin', 'diacerein', 'diacerhein', 'natural remedy', 'natural remedies', 'vitamin'],
    keywords: ['natural', 'herbal', 'ayurveda'],
    answer:
      "Supplements like **glucosamine** and **chondroitin** have moderate evidence and are usually tried for about 3 months. Avoid glucosamine if you have a shellfish allergy. Turmeric, ginger and omega-3s may help some people. Always discuss supplements with your doctor first.",
    links: [{ label: 'Pharmacological management', to: '/pharmacological' }],
  },
  {
    id: 'injections',
    strong: ['injection', 'injections', 'steroid', 'corticosteroid', 'hyaluronic', 'gel injection', 'shot'],
    keywords: ['inject'],
    answer:
      "Joint injections are given only by a clinician:\n• **Corticosteroid** – short-term relief for about 4–8 weeks, at most 3–4 times a year. A brief flare can happen in the first 24–48 hours. People with diabetes should monitor blood sugar.\n• **Hyaluronic acid** – moderate evidence for knee OA, usually a weekly course of 3–5 injections.",
    links: [{ label: 'Pharmacological management', to: '/pharmacological' }],
  },
  {
    id: 'surgery',
    strong: ['surgery', 'operation', 'replacement', 'knee replacement', 'hip replacement', 'tkr', 'thr'],
    keywords: ['surgeon', 'operate'],
    answer:
      "Surgery (usually joint replacement) is considered when pain is severe and not controlled by other treatments, when mobility is significantly affected, or when quality of life is greatly reduced. Your doctor will discuss it when conservative treatments are no longer effective.",
    links: [{ label: 'FAQ', to: '/faq' }],
  },

  // ── Using the site ──────────────────────────────────────────
  {
    id: 'register',
    strong: ['register', 'sign up', 'signup', 'create account', 'new account', 'join', 'registration'],
    keywords: ['account'],
    answer:
      "To create a free account:\n1. Click **Get Started** (top right) or go to the Register page\n2. Enter your full name, email and a password of at least 8 characters (phone is optional)\n3. Submit — you'll be able to log exercises and keep a pain diary\n\nAccounts are free.",
    links: [{ label: 'Register', to: '/register' }],
  },
  {
    id: 'login',
    strong: ['login', 'log in', 'sign in', 'signin', 'cannot login', "can't login", 'logged out', 'session expired', 'logout', 'log out'],
    keywords: ['password', 'email'],
    answer:
      "Use the **Login** link at the top right and enter your email and password. Sessions stay active for several days; if yours expires, you'll be sent back to the login page. To log out, use the menu in the top bar.",
    links: [{ label: 'Login', to: '/login' }],
    followUps: ['I forgot my password'],
  },
  {
    id: 'forgot_password',
    strong: ['forgot password', 'reset password', 'forgot my password', 'change password', 'lost password'],
    keywords: [],
    answer:
      "There's no self-service password reset on the site yet. Please contact support at **support@oacare.in** and they can help you regain access.",
    links: [{ label: 'Resources & contact', to: '/resources' }],
  },
  {
    id: 'dashboard',
    strong: ['dashboard', 'my progress', 'progress', 'chart', 'charts', 'statistics', 'stats', 'history'],
    keywords: ['track', 'tracking', 'trend', 'report'],
    answer:
      "Your **Dashboard** (after logging in) shows:\n• Exercises done this week and this month\n• Your average pain score\n• Charts of your pain and stiffness over time\n• Your recent exercise logs\n\nYou can also log pain and update your profile from there.",
    links: [{ label: 'Open dashboard', to: '/dashboard' }],
    followUps: ['How do I log my pain?', 'How do I log an exercise?'],
  },
  {
    id: 'pain_diary',
    strong: ['pain diary', 'log pain', 'log my pain', 'record pain', 'pain score', 'stiffness score', 'diary', 'journal'],
    keywords: ['record', 'note', 'entry'],
    answer:
      "To add a pain diary entry:\n1. Log in and open your **Dashboard**\n2. Click **Log Pain**\n3. Set your pain score and stiffness score (0–10), choose the location, and add optional notes\n4. Save — it will appear in your charts\n\nTracking daily helps you and your clinician spot patterns.",
    links: [{ label: 'Open dashboard', to: '/dashboard' }],
  },
  {
    id: 'log_exercise',
    strong: ['log exercise', 'log an exercise', 'log my exercise', 'record exercise', 'mark complete', 'mark as complete', 'exercise status', 'started', 'completed'],
    keywords: ['status', 'complete', 'done', 'finish'],
    answer:
      "To log an exercise:\n1. Log in and open any exercise from the **Exercise Library**\n2. Set its status to **Started** or **Completed**\n3. Use **Log This Exercise** to enter sets, reps and your pain before and after (0–10)\n4. Click **Mark as Complete** — it will show up on your dashboard",
    links: [{ label: 'Exercise library', to: '/exercises' }],
  },
  {
    id: 'profile',
    strong: ['profile', 'update profile', 'edit profile', 'my details', 'change my name', 'oa grade', 'personal details'],
    keywords: ['age', 'height', 'gender', 'phone', 'details'],
    answer:
      "Open your **Dashboard** and choose **Update Profile**. You can save your name, phone, age, gender, weight, height, which joint is affected (knee, hip or both) and your OA grade (1–4).",
    links: [{ label: 'Open dashboard', to: '/dashboard' }],
  },
  {
    id: 'contact',
    strong: ['contact', 'support', 'email you', 'phone number', 'reach you', 'customer care', 'complaint', 'feedback'],
    keywords: ['help desk'],
    answer:
      "You can reach the OA Care team at **support@oacare.in**. For medical emergencies, contact your doctor or go to the nearest emergency department.",
    links: [{ label: 'Resources & contact', to: '/resources' }],
  },
  {
    id: 'resources',
    strong: ['resources', 'pdf', 'guide', 'download', 'links', 'more information', 'read more', 'website', 'websites', 'videos'],
    keywords: ['learn', 'information', 'external'],
    answer:
      "The **Resources** page has a downloadable patient guide, trusted external links (Arthritis Foundation, WHO, and OARSI for the latest research), emergency warning signs and contact details.",
    links: [{ label: 'Resources', to: '/resources' }, { label: 'FAQ', to: '/faq' }],
  },
  {
    id: 'cost',
    strong: ['free', 'cost', 'price', 'pay', 'paid', 'charge', 'subscription'],
    keywords: ['money'],
    answer: 'OA Care is free to use — creating an account, the exercise library, logging and the dashboard cost nothing.',
    links: [{ label: 'Register', to: '/register' }],
  },
  {
    id: 'privacy',
    strong: ['privacy', 'my data', 'data safe', 'secure', 'security', 'who can see'],
    keywords: ['data', 'private', 'share'],
    answer:
      "Your account data (profile, exercise logs and pain diary) is stored securely and is only accessible when you are logged in. Site administrators can view activity to support patients. For questions, contact support@oacare.in.",
    links: [{ label: 'Resources & contact', to: '/resources' }],
  },
  {
    id: 'personal_advice',
    strong: ['should i take', 'prescribe', 'what dose', 'how much should i take', 'my report', 'diagnose me', 'am i'],
    keywords: [],
    answer:
      "I can't give personal medical advice, change your medicines or diagnose you. Please speak with your doctor or physiotherapist about your specific situation. I'm happy to explain general information that's on this site.",
    links: [{ label: 'Counselling', to: '/counselling' }],
  },
];
