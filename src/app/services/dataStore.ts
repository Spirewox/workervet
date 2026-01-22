import { User, Question, JobPosting, Department, INITIAL_DEPARTMENTS } from '../types';

// Initial Mock Data
let users: User[] = [
  {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "555-0101",
    targetDepartment: "Sales & Customer Management",
    cvFileName: "alex_resume.pdf",
    assessments: [
      {
        id: "res-mock-1",
        department: "Sales & Customer Management",
        jobId: "job-default-1", 
        date: new Date(Date.now() - 86400000).toISOString(),
        score: 6,
        totalQuestions: 7,
        passed: true,
        answers: [
            { questionId: 'q-preset-1', selectedOptionIndex: 1, isCorrect: true, skill: 'Accountability' },
            { questionId: 'q-preset-4', selectedOptionIndex: 1, isCorrect: true, skill: 'Communication' },
            { questionId: 'q-preset-7', selectedOptionIndex: 2, isCorrect: true, skill: 'Integrity' },
            { questionId: 'q-preset-10', selectedOptionIndex: 2, isCorrect: true, skill: 'Ethics' },
            { questionId: 'q-preset-13', selectedOptionIndex: 0, isCorrect: true, skill: 'Communication' },
            { questionId: 'q-preset-17', selectedOptionIndex: 2, isCorrect: true, skill: 'Communication' },
            { questionId: 'q-preset-20', selectedOptionIndex: 1, isCorrect: true, skill: 'Communication' }
        ]
      }
    ]
  }
];

// Curated Questions from PDF Document
let presetQuestions: Question[] = [
  // 1. Cognitive Ability
  {
    id: "q-preset-1",
    skill: "Accountability",
    scenario: "You purchased 10 yams for a total cost of ₦1,500. You sell each yam for ₦300 in the market.",
    questionText: "What is your profit percentage on this transaction?",
    options: ["50%", "100%", "150%", "200%"],
    correctOptionIndex: 1,
    explanation: "Revenue (10 x 300 = ₦3,000) minus Cost (₦1,500) equals ₦1,500 profit. (Profit / Cost) x 100% = 100%.",
    timeLimit: 45,
    isPreset: true
  },
  {
    id: "q-preset-2",
    skill: "Accountability",
    scenario: "Your delivery truck has a capacity of 10 tons of produce. The standard delivery baskets hold 50 kg each.",
    questionText: "How many baskets are required to fill the truck to its full capacity?",
    options: ["100 baskets", "200 baskets", "500 baskets", "1000 baskets"],
    correctOptionIndex: 1,
    explanation: "10 tons = 10,000 kg. 10,000 kg / 50 kg per basket = 200 baskets.",
    timeLimit: 45,
    isPreset: true
  },
  {
    id: "q-preset-3",
    skill: "Teamwork",
    scenario: "You need to make three urgent deliveries in Lagos: Surulere, Tejuosho, and Obalende. You are starting from the Mainland during morning traffic.",
    questionText: "Which route represents the most efficient geographical sequence to minimize traffic delays?",
    options: ["Tejuosho > Surulere > Obalende", "Obalende > Surulere > Tejuosho", "Surulere > Obalende > Tejuosho", "Tejuosho > Obalende > Surulere"],
    correctOptionIndex: 0,
    explanation: "This route follows the logical geographical layout of Lagos to optimize delivery time and efficiency.",
    timeLimit: 40,
    isPreset: true
  },
  {
    id: "q-preset-4",
    skill: "Communication",
    scenario: "A long-term client approaches you claiming that a competitor's delivery service is significantly faster and cheaper than yours.",
    questionText: "What is the most professional way to handle this objection?",
    options: [
      "Immediately offer a 20% discount to keep their business.",
      "Ask which specific products and delivery times they refer to for an accurate comparison.",
      "Tell the client the competitor is lying about their prices.",
      "Ignore the comment and continue with the current sales pitch."
    ],
    correctOptionIndex: 1,
    explanation: "Gathering data shows a structured, non-emotional approach to sales objections and critical thinking.",
    timeLimit: 30,
    isPreset: true
  },

  // 2. Situational Judgment
  {
    id: "q-preset-5",
    skill: "Ethics",
    scenario: "You arrive at a client's office to deliver goods, but the authorized manager is out. A junior staff member offers to sign the delivery note so you can leave.",
    questionText: "How do you proceed according to standard professional procedure?",
    options: [
      "Let the junior staff sign and head to your next delivery.",
      "Sign the manager's name yourself to save everyone time.",
      "Firmly explain policy and wait for the client or an authorized person to sign.",
      "Leave the goods without a signature to maintain the schedule."
    ],
    correctOptionIndex: 2,
    explanation: "Respecting company procedures prevents future disputes and demonstrates reliability and trustworthiness.",
    timeLimit: 30,
    isPreset: true
  },
  {
    id: "q-preset-6",
    skill: "Trust",
    scenario: "A potential customer is hesitant to buy fresh produce because they had a bad experience with spoiled goods from another vendor recently.",
    questionText: "What is the best way to regain their confidence?",
    options: [
      "Promise it will never happen with you.",
      "Show them photos of other happy customers.",
      "Empathize with their experience, explain your cold chain solution, and offer a low-risk sample.",
      "Tell them they are being too sensitive about a common industry issue."
    ],
    correctOptionIndex: 2,
    explanation: "Empathy combined with a practical solution (cold chain) and low-risk trial builds professional trust.",
    timeLimit: 35,
    isPreset: true
  },
  {
    id: "q-preset-7",
    skill: "Integrity",
    scenario: "You are comparing your product to a competitor's product during a sales presentation.",
    questionText: "What approach demonstrates the highest level of professional integrity?",
    options: [
      "Point out every flaw you know about the competitor's company.",
      "Claim your product is better without providing any evidence.",
      "Focus on your verifiable promise of 'Freshness You Can Trust' and transparent sourcing.",
      "Tell the client the competitor is going out of business soon."
    ],
    correctOptionIndex: 2,
    explanation: "Focusing on verifiable strengths rather than attacking competitors promotes brand value and professionalism.",
    timeLimit: 30,
    isPreset: true
  },
  {
    id: "q-preset-8",
    skill: "Accountability",
    scenario: "A customer wants to place a large order on credit, but company policy strictly requires payment in full for new clients.",
    questionText: "How do you balance the policy with the need to make a sale?",
    options: [
      "Grant the credit anyway to secure the big commission.",
      "Reject the customer immediately and walk away.",
      "Explain the policy but offer to provide a smaller order that they can pay for in full.",
      "Tell them you will change the policy just for them."
    ],
    correctOptionIndex: 2,
    explanation: "This balances adherence to company policy with relationship building and sound business judgment.",
    timeLimit: 35,
    isPreset: true
  },

  // 3. Personality Traits
  {
    id: "q-preset-9",
    skill: "Accountability",
    scenario: "Halfway through the month, you realize you are significantly behind your sales targets due to unexpected market shifts.",
    questionText: "What is your proactive response to this situation?",
    options: [
      "Wait for the market to improve on its own next month.",
      "Ask your manager to lower your target because it's too difficult.",
      "Analyze your strategy, work late, and increase prospecting efforts to catch up.",
      "Blame the marketing team for not providing enough leads."
    ],
    correctOptionIndex: 2,
    explanation: "This demonstrates a tenacious, goal-oriented personality that takes proactive steps to meet targets.",
    timeLimit: 30,
    isPreset: true
  },
  {
    id: "q-preset-10",
    skill: "Integrity",
    scenario: "You make a cash sale to a customer who explicitly states they do not want a receipt and walk away quickly.",
    questionText: "What is the correct action to take with the funds received?",
    options: [
      "Keep the cash since there is no paper trail for the sale.",
      "Buy lunch for the team to boost morale with the extra cash.",
      "Log the full sale and deposit the cash with the company, explaining the lack of receipt.",
      "Donate the cash to a local charity instead of reporting it."
    ],
    correctOptionIndex: 2,
    explanation: "Transparency with company funds, even when unmonitored, is the hallmark of true honesty and integrity.",
    timeLimit: 30,
    isPreset: true
  },
  {
    id: "q-preset-11",
    skill: "Ethics",
    scenario: "A friend offers you a side-gig that pays well but would require you to use your company's delivery contacts during work hours.",
    questionText: "How do you respond to this offer?",
    options: [
      "Accept it; as long as you finish your main work, it doesn't matter.",
      "Ask for a higher cut because of the risk involved.",
      "Politely decline and explain that you need to focus on your company's sales targets.",
      "Do it once just to see if you can get away with it."
    ],
    correctOptionIndex: 2,
    explanation: "This shows self-discipline and a strong work ethic, understanding professional priorities.",
    timeLimit: 30,
    isPreset: true
  },
  {
    id: "q-preset-12",
    skill: "Accountability",
    scenario: "You have spent weeks trying to close a deal with a major restaurant group, but they ultimately decide to go with a different provider.",
    questionText: "How do you handle this professional rejection?",
    options: [
      "Delete their contact and never speak to them again.",
      "Send an angry email explaining why they made a mistake.",
      "Thank them for their time and ask if it's okay to stay in touch for future needs.",
      "Complain about the restaurant on social media."
    ],
    correctOptionIndex: 2,
    explanation: "Demonstrates resilience and a positive attitude, keeping doors open for future opportunities.",
    timeLimit: 30,
    isPreset: true
  },

  // 4. Emotional Intelligence (EQ)
  {
    id: "q-preset-13",
    skill: "Communication",
    scenario: "A customer is shouting because the specific item they wanted is sold out and they had a long journey to get to the store.",
    questionText: "What is your immediate response to their frustration?",
    options: [
      "Validate their frustration, explain the stock issue, and recommend a good alternative.",
      "Shout back so they understand that stockouts aren't your fault.",
      "Call security immediately to remove the customer.",
      "Tell the customer they should have called ahead of time."
    ],
    correctOptionIndex: 0,
    explanation: "Validating frustration (empathy) and offering solutions shows high emotional maturity.",
    timeLimit: 30,
    isPreset: true
  },
  {
    id: "q-preset-14",
    skill: "Teamwork",
    scenario: "You are having a very stressful day and feel your temper rising just as a difficult customer walks in.",
    questionText: "What is the best self-regulation technique to use?",
    options: [
      "Tell the customer to come back another day when you are in a better mood.",
      "Take a moment to breathe and reset your emotions before engaging the customer.",
      "Engage the customer immediately and let them see you are stressed so they are nicer.",
      "Quit your job on the spot to avoid the confrontation."
    ],
    correctOptionIndex: 1,
    explanation: "Conscious steps to manage emotions before they affect performance is a sign of self-regulation.",
    timeLimit: 25,
    isPreset: true
  },
  {
    id: "q-preset-15",
    skill: "Teamwork",
    scenario: "During a sales call, a customer starts talking at length about personal difficulties they are currently facing.",
    questionText: "How do you manage the conversation professionally?",
    options: [
      "Interrupt them and tell them you only have time for business.",
      "Acknowledge what they said with empathy, then respectfully transition back to the product.",
      "Hang up the phone because it is not a productive sales use of time.",
      "Tell them your own personal problems to see who has it worse."
    ],
    correctOptionIndex: 1,
    explanation: "Empathy and social awareness build rapport before transitioning back to professional tasks.",
    timeLimit: 35,
    isPreset: true
  },
  {
    id: "q-preset-16",
    skill: "Communication",
    scenario: "You have explained a product feature three times, but the customer still doesn't seem to understand how it works.",
    questionText: "How do you handle this communication barrier?",
    options: [
      "Tell the customer they aren't listening properly.",
      "Take a deep breath and re-explain the feature in a different way with a calm tone.",
      "Give up and tell them the product is probably too complicated for them.",
      "Call a manager to come and deal with the 'difficult' customer."
    ],
    correctOptionIndex: 1,
    explanation: "Demonstrates patience and self-control, finding new ways to ensure the information is understood.",
    timeLimit: 30,
    isPreset: true
  },

  // 5. Communication Skills
  {
    id: "q-preset-17",
    skill: "Communication",
    scenario: "You are asked to give a 30-second 'elevator pitch' about why your company, Fudfarmer, is the best choice for fresh produce.",
    questionText: "Which statement is the most effective value proposition?",
    options: [
      "We are the biggest company in the city and have the most trucks.",
      "Our owner has 20 years of experience in the farming industry.",
      "We ensure 'Freshness You Can Trust' by using our cold chain to get produce from farm to kitchen.",
      "We have a nice logo and our staff wear very clean uniforms."
    ],
    correctOptionIndex: 2,
    explanation: "Effective communication highlights the unique value proposition (freshness/trust) and the 'how' (cold chain).",
    timeLimit: 30,
    isPreset: true
  },
  {
    id: "q-preset-18",
    skill: "Communication",
    scenario: "A skeptical restaurant owner asks you to prove that your produce is actually fresher than the open market.",
    questionText: "What is your most credible response?",
    options: [
      "Just trust me, I wouldn't lie to a valued customer like you.",
      "Our solar-powered cold rooms and refrigerated vehicles maintain farm-fresh quality to your kitchen.",
      "Markets are dirty and our warehouse is much cleaner.",
      "The market sellers buy their produce from us anyway."
    ],
    correctOptionIndex: 1,
    explanation: "Directly addressing concerns with clear, credible evidence (infrastructure) builds trust.",
    timeLimit: 35,
    isPreset: true
  },
  {
    id: "q-preset-19",
    skill: "Communication",
    scenario: "You are trying to explain a contract to a customer who speaks a different primary language than you and is struggling with the terms.",
    questionText: "What is the most resourceful way to communicate effectively?",
    options: [
      "Speak louder and slower so they can understand you better.",
      "Just tell them to sign it and trust that you have their best interests in mind.",
      "Find a colleague who can help translate or use a reliable translation tool/guide.",
      "Refuse to sell to them because of the language barrier."
    ],
    correctOptionIndex: 2,
    explanation: "Resourcefulness in finding ways to communicate effectively values the customer and ensures clarity.",
    timeLimit: 30,
    isPreset: true
  },
  {
    id: "q-preset-20",
    skill: "Communication",
    scenario: "A customer is giving you a list of five different delivery addresses and specific times for each one.",
    questionText: "As they are speaking, what should you do to ensure accuracy?",
    options: [
      "Try to memorize it all and write it down after they leave.",
      "Politely say: 'I'm having a little trouble keeping up. Would you mind repeating that for me?'",
      "Just guess the addresses later; you can call them back if you get lost.",
      "Nod and pretend you understand everything even if you are confused."
    ],
    correctOptionIndex: 1,
    explanation: "This demonstrates active listening and clarity, ensuring professional accuracy without rushing the client.",
    timeLimit: 30,
    isPreset: true
  }
];

let departments: string[] = [...INITIAL_DEPARTMENTS];

let jobPostings: JobPosting[] = [
  {
    id: "job-default-1",
    title: "Junior Sales Associate",
    department: "Sales & Customer Management",
    description: "We are looking for a motivated Junior Sales Associate to join our dynamic team. You will be responsible for generating leads, meeting sales goals, and building relationships with clients.",
    requirements: "- High school diploma or equivalent.\n- Strong communication skills.\n- Ability to work in a team.\n- Prior experience in sales is a plus.",
    location: "Lagos, Nigeria (On-site)",
    salaryRange: "₦150,000 - ₦250,000",
    createdAt: new Date().toISOString(),
    active: true
  }
];

// --- Department Operations ---
export const getDepartments = () => [...departments];

export const addDepartment = (name: string) => {
  if (name && !departments.includes(name)) {
    departments.push(name);
  }
};

export const deleteDepartment = (name: string) => {
  departments = departments.filter(d => d !== name);
};

// --- User Operations ---
export const getUsers = () => [...users];

export const getUserByEmail = (email: string) => {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (user: User) => {
  const existingIndex = users.findIndex(u => u.email === user.email);
  if (existingIndex >= 0) {
    const existingUser = users[existingIndex];
    users[existingIndex] = {
      ...existingUser,
      ...user, 
      password: user.password || existingUser.password,
      assessments: [
        ...existingUser.assessments,
        ...user.assessments
      ]
    };
  } else {
    users.push(user);
  }
};

export const updateUserPassword = (email: string, password: string) => {
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (index >= 0) {
    users[index] = { ...users[index], password };
    return true;
  }
  return false;
};

// --- Question Bank Operations ---
export const getPresetQuestions = (department?: Department) => {
  return [...presetQuestions];
};

export const addPresetQuestion = (question: Question) => {
  presetQuestions.push({ ...question, isPreset: true });
};

export const updatePresetQuestion = (question: Question) => {
  const index = presetQuestions.findIndex(q => q.id === question.id);
  if (index !== -1) {
    presetQuestions[index] = question;
  }
};

export const removePresetQuestion = (id: string) => {
  presetQuestions = presetQuestions.filter(q => q.id !== id);
};

// --- Job Posting Operations ---
export const getJobPostings = () => [...jobPostings];
export const getJobPostingById = (id: string) => jobPostings.find(j => j.id === id);
export const addJobPosting = (job: JobPosting) => jobPostings.push(job);
export const updateJobPosting = (updatedJob: JobPosting) => {
  const index = jobPostings.findIndex(j => j.id === updatedJob.id);
  if (index !== -1) jobPostings[index] = updatedJob;
};
export const deleteJobPosting = (id: string) => {
  jobPostings = jobPostings.filter(j => j.id !== id);
};