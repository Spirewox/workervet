// Built-in training content keyed by skill/category. Content is resolved by
// fuzzy-matching the candidate's failed skill names against these entries; any
// unrecognised category falls back to a generic professional-development
// module. This keeps the training experience working without a backend; the
// resolver can later be swapped for a CMS/API-backed source.

export interface TrainingLesson {
  title: string;
  body: string;
}

export interface TrainingModule {
  summary: string;
  lessons: TrainingLesson[];
  checklist: string[];
}

const CONTENT: Record<string, TrainingModule> = {
  trust: {
    summary:
      "Trust is built through consistency, honesty, and following through on commitments. Employers look for people whose words and actions reliably match.",
    lessons: [
      {
        title: "Do what you say",
        body: "Only commit to what you can deliver, then deliver it. When something slips, communicate early rather than letting it surprise others.",
      },
      {
        title: "Be transparent under pressure",
        body: "When a scenario tempts you to hide a mistake or shade the truth, the trustworthy choice is to surface it promptly with a plan to fix it.",
      },
      {
        title: "Protect what's shared with you",
        body: "Handle sensitive information and others' reputations carefully. Discretion is a core signal of trustworthiness.",
      },
    ],
    checklist: [
      "I disclose mistakes early instead of hiding them",
      "I keep commitments or renegotiate them openly",
      "I keep confidential information confidential",
    ],
  },
  integrity: {
    summary:
      "Integrity means doing the right thing even when no one is watching and even when it's inconvenient. It shows up most in the hard, low-visibility choices.",
    lessons: [
      {
        title: "Consistency over convenience",
        body: "Apply the same standard whether or not you'll be observed or rewarded. Shortcuts that compromise honesty erode trust quickly.",
      },
      {
        title: "Own your decisions",
        body: "Take responsibility for outcomes rather than shifting blame. Accountability is integrity in action.",
      },
      {
        title: "Refuse the gray area",
        body: "When a scenario offers a small dishonest gain, the high-integrity answer almost always declines it and seeks a clean alternative.",
      },
    ],
    checklist: [
      "I act the same whether or not I'm being watched",
      "I decline gains that require bending the rules",
      "I take ownership instead of assigning blame",
    ],
  },
  ethics: {
    summary:
      "Workplace ethics is about applying fairness, honesty, and respect to real situations — especially where rules, incentives, and people's interests collide.",
    lessons: [
      {
        title: "Identify the stakeholders",
        body: "Before deciding, ask who is affected. Ethical answers weigh the impact on colleagues, customers, and the organisation, not just yourself.",
      },
      {
        title: "Follow policy, then judgment",
        body: "Start from established rules and codes of conduct. Where they run out, choose the option you'd be comfortable explaining publicly.",
      },
      {
        title: "Escalate, don't ignore",
        body: "When you spot misconduct, raising it through the right channel is the ethical course — silence can make you complicit.",
      },
    ],
    checklist: [
      "I consider who is affected before I act",
      "I would be comfortable explaining my choice openly",
      "I report misconduct through the proper channel",
    ],
  },
  communication: {
    summary:
      "Strong communicators are clear, timely, and respectful. They listen first, confirm understanding, and adapt their message to the audience.",
    lessons: [
      {
        title: "Listen to understand",
        body: "Let the other person finish, then reflect back what you heard before responding. Most conflict comes from assumptions, not facts.",
      },
      {
        title: "Be clear and concise",
        body: "State the point first, then the detail. Avoid jargon and ambiguity, especially in writing where tone is easy to misread.",
      },
      {
        title: "Communicate early and often",
        body: "Share status, blockers, and bad news promptly. People forgive delays far more easily than silence.",
      },
    ],
    checklist: [
      "I confirm I understood before responding",
      "I lead with the main point, then supporting detail",
      "I raise blockers and bad news early",
    ],
  },
  professionalism: {
    summary:
      "Professionalism is the everyday discipline of being reliable, respectful, and composed — on time, prepared, and constructive even under stress.",
    lessons: [
      {
        title: "Reliability is the baseline",
        body: "Show up prepared and on time, and meet deadlines. Dependability is what colleagues notice first.",
      },
      {
        title: "Stay composed",
        body: "Respond to frustration and conflict calmly. Reacting professionally to a difficult moment builds your reputation faster than avoiding one.",
      },
      {
        title: "Respect boundaries and roles",
        body: "Treat everyone with courtesy regardless of seniority, and keep personal and work matters appropriately separate.",
      },
    ],
    checklist: [
      "I arrive prepared and meet my deadlines",
      "I stay calm and constructive under pressure",
      "I treat everyone with consistent respect",
    ],
  },
  teamwork: {
    summary:
      "Effective team members share credit, support others, and put the shared goal ahead of individual recognition.",
    lessons: [
      {
        title: "Make others successful",
        body: "Offer help before being asked and share information freely. Teams reward people who lift the group, not just themselves.",
      },
      {
        title: "Handle disagreement well",
        body: "Debate ideas, not people. Once a decision is made, commit to it even if it wasn't your preference.",
      },
      {
        title: "Share credit and ownership",
        body: "Acknowledge contributions publicly and absorb blame privately. This is how trust compounds within a team.",
      },
    ],
    checklist: [
      "I offer help and share information proactively",
      "I disagree respectfully and then commit",
      "I give credit to others generously",
    ],
  },
  accountability: {
    summary:
      "Accountability means owning your results — good and bad — and acting to put things right rather than explaining them away.",
    lessons: [
      {
        title: "Own the outcome",
        body: "When something goes wrong on your watch, lead with 'here's what I'll do to fix it' rather than 'here's why it wasn't my fault'.",
      },
      {
        title: "Close the loop",
        body: "Follow up on commitments and confirm they're done. Unfinished follow-through is the most common accountability gap.",
      },
      {
        title: "Learn out loud",
        body: "Treat mistakes as data. Sharing what you learned turns a failure into credibility.",
      },
    ],
    checklist: [
      "I own problems instead of explaining them away",
      "I follow up until commitments are truly done",
      "I share lessons from my mistakes",
    ],
  },
  confidentiality: {
    summary:
      "Confidentiality is about safeguarding sensitive information — protecting people, customers, and the organisation by sharing only on a need-to-know basis.",
    lessons: [
      {
        title: "Default to discretion",
        body: "Assume information is private unless you know it's meant to be shared. When unsure, ask before disclosing.",
      },
      {
        title: "Mind the channel",
        body: "Sensitive details belong in secure, approved channels — never casual chat, personal devices, or public spaces.",
      },
      {
        title: "Respect after you leave the room",
        body: "Confidentiality doesn't end when a conversation does. Don't repeat what was shared in confidence.",
      },
    ],
    checklist: [
      "I share sensitive information only on a need-to-know basis",
      "I use secure, approved channels for private details",
      "I keep confidences even after the moment passes",
    ],
  },
};

const generic = (skillName: string): TrainingModule => ({
  summary: `Strengthening "${skillName}" is about applying sound judgment consistently in real workplace situations. Focus on understanding the principle, then practising it in everyday decisions.`,
  lessons: [
    {
      title: "Understand what good looks like",
      body: `Review what strong ${skillName.toLowerCase()} looks like in practice, and the behaviours assessors are looking for in each scenario.`,
    },
    {
      title: "Slow down on the hard cases",
      body: "The questions you missed usually involve a trade-off. Read each scenario carefully, identify who is affected, and choose the response you could defend openly.",
    },
    {
      title: "Practise deliberately",
      body: `Reflect on recent situations where ${skillName.toLowerCase()} mattered, and rehearse how you'd handle them before retaking the assessment.`,
    },
  ],
  checklist: [
    "I can describe what strong performance looks like here",
    "I pause to weigh trade-offs on difficult scenarios",
    "I've rehearsed how I'd respond before retaking",
  ],
});

export const getTrainingModule = (skillName: string): TrainingModule => {
  const key = (skillName || "").trim().toLowerCase();
  for (const entry of Object.keys(CONTENT)) {
    if (key.includes(entry)) return CONTENT[entry];
  }
  return generic(skillName || "this skill");
};
