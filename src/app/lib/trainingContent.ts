// Built-in training content keyed by skill/category. Each category resolves to
// a full video-based course: a description, video modules, downloadable
// resources, and a short quick-assessment quiz. Content is matched by fuzzy
// skill name with a generic fallback, so training works without a backend; the
// resolver can later be swapped for a CMS/API-backed source.

// Price to unlock a single training course (one-time). Currency matches the
// rest of the app (job salary ranges are shown in GBP).
export const TRAINING_PRICE = 500;
export const TRAINING_CURRENCY = "£";
// Fee to unlock/issue the certificate after passing an assessment.
export const CERTIFICATE_PRICE = 50;
// Fee to ship a printed, framed hard-copy certificate.
export const CERTIFICATE_HARDCOPY_FEE = 20;
export const formatPrice = (amount = TRAINING_PRICE) =>
  `${TRAINING_CURRENCY}${amount.toLocaleString()}`;

export type ResourceType = "article" | "pdf" | "video" | "link";

export interface TrainingResource {
  label: string;
  url: string;
  type: ResourceType;
}

export interface TrainingVideoModule {
  id: string;
  title: string;
  description: string;
  durationLabel: string;
  videoUrl: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export interface TrainingCourse {
  title: string;
  description: string;
  modules: TrainingVideoModule[];
  resources: TrainingResource[];
  quiz: QuizQuestion[];
  passMark: number; // fraction 0-1 of quiz questions needed to pass
}

// Stable public sample videos used as placeholders for course content.
// Replace with real training videos (or a CMS/signed-URL source) in production.
const V = (name: string) =>
  `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/${name}.mp4`;
const VIDEO_POOL = [
  "BigBuckBunny",
  "ElephantsDream",
  "ForBiggerBlazes",
  "ForBiggerEscapes",
  "ForBiggerJoyrides",
  "Sintel",
  "TearsOfSteel",
];
const pickVideo = (i: number) => V(VIDEO_POOL[i % VIDEO_POOL.length]);

const COURSES: Record<string, TrainingCourse> = {
  ethics: {
    title: "Workplace Ethics",
    description:
      "Learn to apply fairness, honesty, and sound judgment to real situations where rules, incentives, and people's interests collide.",
    modules: [
      {
        id: "ethics-1",
        title: "Recognising an ethical dilemma",
        description:
          "Spot the moments where a decision affects others, and learn the simple test of whether you'd be comfortable explaining your choice openly.",
        durationLabel: "6 min",
        videoUrl: pickVideo(0),
      },
      {
        id: "ethics-2",
        title: "Policy, judgment, and escalation",
        description:
          "Start from the code of conduct, use judgment where rules run out, and escalate misconduct through the right channel instead of staying silent.",
        durationLabel: "8 min",
        videoUrl: pickVideo(1),
      },
    ],
    resources: [
      { label: "Ethical decision-making framework (PDF)", url: "#", type: "pdf" },
      { label: "Worked scenarios: hard calls at work", url: "#", type: "article" },
    ],
    quiz: [
      {
        id: "ethics-q1",
        question:
          "A colleague asks you to overlook a small policy breach 'just this once'. The most ethical response is to:",
        options: [
          "Agree, since it's small and no one will notice",
          "Decline and follow the policy, raising it if it continues",
          "Ignore it and hope it resolves itself",
          "Do it but tell them not to ask again",
        ],
        answerIndex: 1,
      },
      {
        id: "ethics-q2",
        question: "A useful test for an ethical decision is whether you would:",
        options: [
          "Gain the most personally from it",
          "Be comfortable explaining it openly to others",
          "Finish it fastest",
          "Avoid involving your manager",
        ],
        answerIndex: 1,
      },
      {
        id: "ethics-q3",
        question: "When you witness clear misconduct, the right first step is usually to:",
        options: [
          "Say nothing to avoid conflict",
          "Confront the person publicly",
          "Report it through the proper channel",
          "Wait until someone else notices",
        ],
        answerIndex: 2,
      },
    ],
    passMark: 0.67,
  },
  communication: {
    title: "Effective Communication",
    description:
      "Become clear, timely, and respectful: listen first, confirm understanding, and adapt your message to your audience.",
    modules: [
      {
        id: "comm-1",
        title: "Listening to understand",
        description:
          "Let people finish, reflect back what you heard, and replace assumptions with confirmed facts to prevent avoidable conflict.",
        durationLabel: "5 min",
        videoUrl: pickVideo(2),
      },
      {
        id: "comm-2",
        title: "Clear, concise, and early",
        description:
          "Lead with the main point, cut jargon, and share status and bad news early — people forgive delays far more than silence.",
        durationLabel: "7 min",
        videoUrl: pickVideo(3),
      },
    ],
    resources: [
      { label: "Active listening checklist (PDF)", url: "#", type: "pdf" },
      { label: "Writing clear workplace messages", url: "#", type: "article" },
    ],
    quiz: [
      {
        id: "comm-q1",
        question: "The best way to make sure you understood a request is to:",
        options: [
          "Assume you got it and start work",
          "Reflect it back and confirm before responding",
          "Wait and ask later if it goes wrong",
          "Do part of it and see the reaction",
        ],
        answerIndex: 1,
      },
      {
        id: "comm-q2",
        question: "When delivering an update, you should generally:",
        options: [
          "Lead with the main point, then detail",
          "Save the conclusion for the very end",
          "Include every detail you can think of",
          "Use as much jargon as possible",
        ],
        answerIndex: 0,
      },
      {
        id: "comm-q3",
        question: "You realise a deadline will slip. The best move is to:",
        options: [
          "Say nothing and hope to catch up",
          "Tell people only once it's already late",
          "Communicate early with a plan",
          "Blame the workload",
        ],
        answerIndex: 2,
      },
    ],
    passMark: 0.67,
  },
  professionalism: {
    title: "Professionalism at Work",
    description:
      "Build the everyday discipline of being reliable, respectful, and composed — prepared, on time, and constructive under stress.",
    modules: [
      {
        id: "prof-1",
        title: "Reliability is the baseline",
        description:
          "Show up prepared, on time, and meet deadlines. Dependability is what colleagues notice and remember first.",
        durationLabel: "5 min",
        videoUrl: pickVideo(4),
      },
      {
        id: "prof-2",
        title: "Composure under pressure",
        description:
          "Respond to frustration and conflict calmly and respectfully — handling a hard moment well builds your reputation fast.",
        durationLabel: "6 min",
        videoUrl: pickVideo(5),
      },
    ],
    resources: [
      { label: "Professional conduct quick-guide (PDF)", url: "#", type: "pdf" },
      { label: "Staying composed in difficult conversations", url: "#", type: "article" },
    ],
    quiz: [
      {
        id: "prof-q1",
        question: "The most fundamental signal of professionalism is:",
        options: [
          "Working the longest hours",
          "Being reliable — prepared, on time, meeting deadlines",
          "Never asking for help",
          "Always agreeing with your manager",
        ],
        answerIndex: 1,
      },
      {
        id: "prof-q2",
        question: "A customer becomes rude and frustrated. The professional response is to:",
        options: [
          "Match their tone",
          "Stay calm and focus on resolving the issue",
          "Walk away without a word",
          "Argue until they back down",
        ],
        answerIndex: 1,
      },
      {
        id: "prof-q3",
        question: "Treating colleagues professionally means:",
        options: [
          "Being courteous only to senior staff",
          "Respect for everyone regardless of role",
          "Keeping to yourself entirely",
          "Sharing office gossip to bond",
        ],
        answerIndex: 1,
      },
    ],
    passMark: 0.67,
  },
  integrity: {
    title: "Integrity & Accountability",
    description:
      "Do the right thing even when it's inconvenient or unobserved, and own your outcomes instead of explaining them away.",
    modules: [
      {
        id: "int-1",
        title: "Consistency over convenience",
        description:
          "Apply the same standard whether or not you're watched or rewarded, and decline gains that require bending the rules.",
        durationLabel: "6 min",
        videoUrl: pickVideo(0),
      },
      {
        id: "int-2",
        title: "Owning the outcome",
        description:
          "Lead with 'here's what I'll do to fix it', close the loop on commitments, and turn mistakes into credibility by learning out loud.",
        durationLabel: "7 min",
        videoUrl: pickVideo(6),
      },
    ],
    resources: [
      { label: "Accountability self-check (PDF)", url: "#", type: "pdf" },
      { label: "Owning mistakes the right way", url: "#", type: "article" },
    ],
    quiz: [
      {
        id: "int-q1",
        question: "Integrity is best described as doing the right thing:",
        options: [
          "Only when it benefits you",
          "Even when no one is watching",
          "Only when required by a manager",
          "When it's convenient",
        ],
        answerIndex: 1,
      },
      {
        id: "int-q2",
        question: "Something went wrong on your task. The accountable response is to:",
        options: [
          "Explain why it wasn't your fault",
          "Say what you'll do to put it right",
          "Hope no one noticed",
          "Pass it to a colleague",
        ],
        answerIndex: 1,
      },
      {
        id: "int-q3",
        question: "You're offered a small dishonest gain with no chance of being caught. You should:",
        options: [
          "Take it — no one will know",
          "Decline and find a clean alternative",
          "Take it but feel bad",
          "Ask a colleague to do it instead",
        ],
        answerIndex: 1,
      },
    ],
    passMark: 0.67,
  },
  trust: {
    title: "Building Trust",
    description:
      "Earn trust through consistency, honesty, and follow-through — making your words and actions reliably match.",
    modules: [
      {
        id: "trust-1",
        title: "Do what you say",
        description:
          "Commit only to what you can deliver, then deliver it — and communicate early when something is at risk of slipping.",
        durationLabel: "5 min",
        videoUrl: pickVideo(2),
      },
      {
        id: "trust-2",
        title: "Transparency and discretion",
        description:
          "Surface mistakes promptly with a fix, and protect sensitive information and others' reputations carefully.",
        durationLabel: "6 min",
        videoUrl: pickVideo(3),
      },
    ],
    resources: [
      { label: "Trust-building behaviours (PDF)", url: "#", type: "pdf" },
      { label: "Handling confidential information", url: "#", type: "article" },
    ],
    quiz: [
      {
        id: "trust-q1",
        question: "Trust is built mainly through:",
        options: [
          "Big one-off gestures",
          "Consistency and following through on commitments",
          "Telling people what they want to hear",
          "Avoiding difficult conversations",
        ],
        answerIndex: 1,
      },
      {
        id: "trust-q2",
        question: "You made a mistake that others haven't noticed yet. You should:",
        options: [
          "Hide it and hope it's fine",
          "Surface it promptly with a plan to fix it",
          "Wait until someone asks",
          "Blame a system error",
        ],
        answerIndex: 1,
      },
      {
        id: "trust-q3",
        question: "A colleague shares something in confidence. The trustworthy thing to do is:",
        options: [
          "Repeat it to bond with others",
          "Keep it confidential",
          "Share it only with your manager for fun",
          "Post about it indirectly",
        ],
        answerIndex: 1,
      },
    ],
    passMark: 0.67,
  },
};

const generic = (skillName: string): TrainingCourse => {
  const lower = skillName.toLowerCase();
  return {
    title: skillName,
    description: `Strengthen "${skillName}" by understanding what strong performance looks like, then practising it in everyday workplace decisions.`,
    modules: [
      {
        id: "gen-1",
        title: `What good ${lower} looks like`,
        description: `Review the behaviours assessors look for in ${lower}, and the common mistakes that lower a score.`,
        durationLabel: "6 min",
        videoUrl: pickVideo(0),
      },
      {
        id: "gen-2",
        title: "Applying it to hard scenarios",
        description:
          "Slow down on trade-off questions: identify who is affected and choose the response you could defend openly.",
        durationLabel: "7 min",
        videoUrl: pickVideo(1),
      },
    ],
    resources: [
      { label: `${skillName} quick-reference (PDF)`, url: "#", type: "pdf" },
      { label: "Workplace scenario practice", url: "#", type: "article" },
    ],
    quiz: [
      {
        id: "gen-q1",
        question: `When a ${lower} scenario involves a trade-off, you should first:`,
        options: [
          "Pick the fastest option",
          "Identify who is affected and weigh the impact",
          "Choose what benefits you most",
          "Avoid deciding",
        ],
        answerIndex: 1,
      },
      {
        id: "gen-q2",
        question: "A good check before committing to a decision is whether you could:",
        options: [
          "Keep it secret",
          "Explain and defend it openly",
          "Finish it without telling anyone",
          "Undo it later",
        ],
        answerIndex: 1,
      },
      {
        id: "gen-q3",
        question: "The best way to improve before a retake is to:",
        options: [
          "Guess faster next time",
          "Rehearse how you'd handle real situations",
          "Memorise the previous answers",
          "Skip the hard questions",
        ],
        answerIndex: 1,
      },
    ],
    passMark: 0.67,
  };
};

export const getTrainingCourse = (skillName: string): TrainingCourse => {
  const key = (skillName || "").trim().toLowerCase();
  for (const entry of Object.keys(COURSES)) {
    if (key.includes(entry)) return COURSES[entry];
  }
  return generic(skillName || "this skill");
};
