// KillMyIdea — local deterministic mock analysis engine.
// No backend, no AI calls. Swap this module for a live research API later.

const hashSeed = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h;
};

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const verdictFor = (score) => {
  if (score >= 70)
    return {
      tone: "green",
      label: "DON'T KILL IT",
      text: "The opportunity appears strong enough to justify validation.",
    };
  if (score >= 50)
    return {
      tone: "amber",
      label: "WORTH EXPLORING",
      text: "There may be an opportunity, but the current positioning needs validation.",
    };
  return {
    tone: "red",
    label: "KILL IT",
    text: "The evidence does not justify spending significant engineering time on this idea.",
  };
};

export const riskLabelFor = (score) => {
  if (score >= 70) return { tone: "green", label: "VIABLE" };
  if (score >= 50) return { tone: "amber", label: "UNCERTAIN" };
  return { tone: "red", label: "HIGH RISK" };
};

export const factorLevel = (score) => {
  if (score >= 65) return { tone: "green", label: "LOW RISK" };
  if (score >= 40) return { tone: "amber", label: "MODERATE RISK" };
  return { tone: "red", label: "HIGH RISK" };
};

export const stepsFor = (tone) => {
  if (tone === "green")
    return [
      "Interview 10 target customers to pressure-test the assumptions",
      "Secure 2–3 design partners before building the full product",
      "Test pricing against existing spend, not against what feels fair",
    ];
  if (tone === "amber")
    return [
      "Interview 10 target customers in the narrowed segment",
      "Create a landing page for the new positioning and measure conversion",
      "Validate willingness to pay at a real price point before building",
    ];
  return [
    "Do not build an MVP. Interview 10 potential customers first",
    "Look for existing spend or painful workarounds — if none exist, kill it",
    "Redirect the saved engineering time into a problem with a budget attached",
  ];
};

const figmaResult = () => ({
  viability: 42,
  killRisk: 78,
  confidence: 84,
  quote:
    "The problem appears real, but the current positioning faces strong competition and does not provide enough differentiation to justify switching from existing solutions.",
  factors: [
    { key: "problem", name: "Problem Strength", score: 72, text: "Design-to-code handoff is a real, recurring pain. Teams genuinely lose hours translating Figma into production React." },
    { key: "market", name: "Market Opportunity", score: 61, text: "Large addressable base of frontend teams, but budgets for handoff tooling are small and often absorbed by existing design-tool spend." },
    { key: "competition", name: "Competition", score: 28, text: "Severe. Anima, Locofy, Builder.io, v0, and Figma's own Dev Mode already cover large parts of this workflow." },
    { key: "differentiation", name: "Differentiation", score: 34, text: "\"Pixel-perfect output\" reads as a feature, not a moat. Incumbents ship the same claim on their landing pages." },
    { key: "monetization", name: "Monetization", score: 57, text: "Subscriptions are plausible, but willingness to pay is capped — teams expect this inside tools they already pay for." },
    { key: "distribution", name: "Distribution", score: 31, text: "No obvious low-cost channel to the first 100 customers. SEO is saturated and dev communities punish mediocre output quality." },
    { key: "execution", name: "Execution Feasibility", score: 82, text: "Technically achievable. The hard part is not building it — it is getting anyone to switch." },
    { key: "defensibility", name: "Defensibility", score: 24, text: "No data advantage, no network effect, low switching costs. A Figma API update can obsolete the core engine overnight." },
  ],
  findings: [
    { tone: "red", title: "Competition is the biggest problem", body: "Several established products already solve a large portion of this workflow, and Figma itself is moving into code output." },
    { tone: "red", title: "Differentiation is weak", body: "The current differentiator looks more like a feature than a durable competitive advantage." },
    { tone: "amber", title: "Distribution is unclear", body: "There is no obvious low-cost path to the first 100 customers." },
    { tone: "green", title: "Execution is not the problem", body: "The MVP appears technically achievable. The primary risk is market positioning, not engineering." },
  ],
  evidence: [
    {
      title: "Competition Risk",
      level: "HIGH",
      levelTone: "red",
      strength: "Strong",
      points: [
        "Existing product category is mature.",
        "Multiple established solutions target the same workflow.",
        "Open-source alternatives exist.",
        "Switching costs appear relatively low.",
      ],
    },
    {
      title: "Differentiation",
      level: "WEAK",
      levelTone: "red",
      strength: "Moderate",
      points: [
        "The proposed differentiator is a feature incumbents can copy in one release cycle.",
        "No proprietary data or workflow lock-in identified in the input.",
        "The claim mirrors existing competitors' marketing almost verbatim.",
      ],
    },
    {
      title: "Distribution",
      level: "UNCERTAIN",
      levelTone: "amber",
      strength: "Moderate",
      points: [
        "No channel advantage stated in the input.",
        "The target audience is broad and expensive to reach.",
        "Comparable tools relied on community-led growth that is hard to replicate on demand.",
      ],
    },
    {
      title: "Problem Strength",
      level: "REAL",
      levelTone: "green",
      strength: "Strong",
      points: [
        "Design-to-code handoff friction is widely reported in engineering teams.",
        "The pain recurs on every feature, not once.",
        "Existing spend in adjacent tools confirms a budget exists.",
      ],
    },
  ],
  save: {
    possible: true,
    change:
      "Narrow the target customer from \"all developers\" to \"enterprise frontend teams maintaining large React applications.\"",
    paragraph:
      "Enterprise teams maintaining large React codebases feel the handoff pain repeatedly, hold real budget, and buy through a reachable procurement channel. Narrowing converts a weak horizontal tool into a vertical workflow product.",
    projected: 64,
    reasons: [
      "Clearer buyer",
      "Stronger pain point",
      "Higher willingness to pay",
      "Better distribution path",
      "More defensible positioning",
    ],
    steps: [
      "Interview 10 enterprise frontend teams about their handoff workflow",
      "Create a landing page for the enterprise positioning and measure conversion",
      "Test pricing with 3–5 design partners before writing production code",
    ],
  },
  nextSteps: [
    "Do not build the general-purpose version",
    "Interview 10 enterprise frontend teams about their handoff workflow",
    "Validate whether teams would pay outside their existing Figma and dev-tool budget",
  ],
});

const codeReviewResult = () => ({
  viability: 24,
  killRisk: 86,
  confidence: 88,
  quote:
    "The category is dominated by well-funded incumbents with platform distribution. Entering now with a generic offering is unlikely to work.",
  factors: [
    { key: "problem", name: "Problem Strength", score: 55, text: "Code review bottlenecks are real, but teams already patched the pain with AI assistants they already pay for." },
    { key: "market", name: "Market Opportunity", score: 48, text: "Spending exists, but it flows to bundled platforms, not standalone newcomers." },
    { key: "competition", name: "Competition", score: 12, text: "Severe. GitHub ships this natively. CodeRabbit and Greptile are entrenched. You are competing with \"already installed\"." },
    { key: "differentiation", name: "Differentiation", score: 18, text: "\"Faster and cheaper\" is a race to the bottom against free tiers backed by platform subsidies." },
    { key: "monetization", name: "Monetization", score: 30, text: "Willingness to pay for a standalone review tool is collapsing as platforms bundle review into existing seats." },
    { key: "distribution", name: "Distribution", score: 22, text: "Marketplaces are pay-to-play and incumbents dominate search. Cold outreach to engineering teams converts poorly for tooling." },
    { key: "execution", name: "Execution Feasibility", score: 76, text: "Building it is easy. That is precisely the problem — everyone else can too." },
    { key: "defensibility", name: "Defensibility", score: 15, text: "No proprietary data, no lock-in, and the underlying models are available to every competitor at the same price." },
  ],
  findings: [
    { tone: "red", title: "You are competing with \"already installed\"", body: "GitHub reviews code where the code already lives. Distribution beats features." },
    { tone: "red", title: "No durable advantage", body: "Every competitor has access to the same foundation models at the same cost." },
    { tone: "red", title: "Monetization is collapsing", body: "Standalone review pricing is being absorbed into platform bundles." },
    { tone: "green", title: "Engineering is fine", body: "The product is buildable. The business is not." },
  ],
  evidence: [
    {
      title: "Competition Risk",
      level: "HIGH",
      levelTone: "red",
      strength: "Strong",
      points: [
        "GitHub ships native AI review to its entire user base.",
        "At least three funded startups already hold category mindshare.",
        "Free tiers from incumbents undercut any entry price.",
        "Switching costs are near zero for a tool with no stored state.",
      ],
    },
    {
      title: "Differentiation",
      level: "WEAK",
      levelTone: "red",
      strength: "Strong",
      points: [
        "\"Faster and cheaper\" is not defensible against subsidized platform features.",
        "No unique data source or workflow ownership was identified.",
      ],
    },
    {
      title: "Willingness to Pay",
      level: "LOW",
      levelTone: "red",
      strength: "Moderate",
      points: [
        "Adjacent capability is bundled into seats teams already pay for.",
        "Standalone dev-tool purchases under $50/mo face heavy scrutiny.",
      ],
    },
  ],
  save: {
    possible: false,
    explanation:
      "The core problem appears to be market structure rather than positioning. Changing the target customer or pricing model is unlikely to materially improve the opportunity.",
  },
  nextSteps: [
    "If you still believe in the space, talk to 10 engineering leads about what their current review stack fails at",
    "Look for an adjacent niche the platforms ignore",
    "Otherwise, kill it and take the learning",
  ],
});

const todoResult = () => ({
  viability: 24,
  killRisk: 88,
  confidence: 90,
  quote:
    "This enters one of the most saturated categories in software with no structural advantage. Adding \"AI\" does not change the market math.",
  factors: [
    { key: "problem", name: "Problem Strength", score: 35, text: "Task management is a solved problem for most developers. The pain is annoyance, not budget." },
    { key: "market", name: "Market Opportunity", score: 30, text: "The market is huge and worthless to you: users expect todo tools to be free." },
    { key: "competition", name: "Competition", score: 8, text: "Extremely crowded. Todoist, Linear, GitHub Issues, Notion, and a thousand free alternatives." },
    { key: "differentiation", name: "Differentiation", score: 15, text: "\"AI-powered\" is a 2023 differentiator. Every incumbent already shipped it." },
    { key: "monetization", name: "Monetization", score: 20, text: "Developers churn off cheap productivity subscriptions relentlessly." },
    { key: "distribution", name: "Distribution", score: 18, text: "Productivity app acquisition is brutally expensive, and dev communities punish hype-driven tools." },
    { key: "execution", name: "Execution Feasibility", score: 80, text: "A competent team ships this in a month. So can everyone else." },
    { key: "defensibility", name: "Defensibility", score: 10, text: "Zero lock-in. Users export their tasks in minutes." },
  ],
  findings: [
    { tone: "red", title: "Extremely crowded category", body: "You are the ten-thousandth todo app. The market does not need another one." },
    { tone: "red", title: "Differentiation is weak", body: "\"AI-powered\" is table stakes, not an advantage." },
    { tone: "red", title: "Switching costs are near zero", body: "Users migrate task lists in minutes, and free alternatives are everywhere." },
    { tone: "red", title: "Distribution is brutal", body: "There is no credible low-cost path to the first 100 customers." },
    { tone: "green", title: "Execution is not the problem", body: "The app is easy to build. That is exactly why it is worthless as a business." },
  ],
  evidence: [
    {
      title: "Competition Risk",
      level: "HIGH",
      levelTone: "red",
      strength: "Strong",
      points: [
        "Category is mature with entrenched free incumbents.",
        "Platform players bundle task management into tools developers already use.",
        "Open-source clones exist for every feature on the roadmap.",
      ],
    },
    {
      title: "Monetization",
      level: "WEAK",
      levelTone: "red",
      strength: "Strong",
      points: [
        "Productivity subscription churn is structurally high.",
        "Developers strongly prefer free or bundled tools for personal task management.",
      ],
    },
    {
      title: "Distribution",
      level: "BLOCKED",
      levelTone: "red",
      strength: "Moderate",
      points: [
        "Paid acquisition for productivity apps rarely pays back at consumer price points.",
        "Category SEO and app-store search are fully saturated.",
      ],
    },
  ],
  save: {
    possible: false,
    explanation:
      "The core problem appears to be market structure rather than positioning. Changing the target customer or pricing model is unlikely to materially improve the opportunity.",
  },
  nextSteps: [
    "Kill it. Redirect the energy into a problem with a budget attached",
    "If you cannot let go: find one niche workflow where existing tools genuinely fail, and interview 10 people in that niche first",
  ],
});

const contextResult = () => ({
  viability: 67,
  killRisk: 44,
  confidence: 76,
  quote:
    "The timing is right and the pain is emerging, but selling to individual developers caps revenue and invites platform competition.",
  factors: [
    { key: "problem", name: "Problem Strength", score: 74, text: "Context quality is the top failure mode of coding agents on large repos. The pain is real and growing with agent adoption." },
    { key: "market", name: "Market Opportunity", score: 66, text: "Rides the AI-coding wave, which is expanding fast — but the segment is young and budgets are still forming." },
    { key: "competition", name: "Competition", score: 45, text: "Moderate and rising. IDE-native agents are building context engines in-house; standalone players are emerging." },
    { key: "differentiation", name: "Differentiation", score: 58, text: "Repo-aware context packaging is genuinely distinct today, but the gap is measured in months, not years." },
    { key: "monetization", name: "Monetization", score: 52, text: "Individual developers pay $10–20/mo and churn fast. The money is in teams, not individuals." },
    { key: "distribution", name: "Distribution", score: 49, text: "Developer word-of-mouth is possible, but individual-developer acquisition is slow relative to contract size." },
    { key: "execution", name: "Execution Feasibility", score: 71, text: "Non-trivial indexing and ranking work, but achievable by a strong small team." },
    { key: "defensibility", name: "Defensibility", score: 55, text: "Usage data on what context works could compound — if you own the workflow before the IDEs absorb it." },
  ],
  findings: [
    { tone: "amber", title: "The buyer is wrong, not the product", body: "Individual developers churn and haggle. Engineering organizations pay for agent reliability." },
    { tone: "amber", title: "Platform risk is real", body: "The major coding agents are all building context engines. Your window is not infinite." },
    { tone: "red", title: "Consumer pricing caps the business", body: "At $15/mo per individual, you need thousands of sticky users before this is a business." },
    { tone: "green", title: "The pain is real and early", body: "This is one of the few dev-tool spaces where the problem is getting worse, not better." },
  ],
  evidence: [
    {
      title: "Market Timing",
      level: "FAVORABLE",
      levelTone: "green",
      strength: "Moderate",
      points: [
        "Agent-based coding adoption is accelerating in professional teams.",
        "Context failure is a documented top complaint with coding agents.",
        "Budget ownership for AI tooling is moving to engineering leadership.",
      ],
    },
    {
      title: "Competition",
      level: "MODERATE",
      levelTone: "amber",
      strength: "Moderate",
      points: [
        "IDE-native agents are investing in context internally.",
        "No dominant standalone category leader yet.",
        "Open-source retrieval stacks lower the barrier for copycats.",
      ],
    },
    {
      title: "Monetization",
      level: "AT RISK",
      levelTone: "red",
      strength: "Strong",
      points: [
        "Individual-developer ARPU in dev tools rarely exceeds $20/mo.",
        "Team plans in adjacent categories sell at 5–10x individual pricing.",
      ],
    },
  ],
  save: {
    possible: true,
    change: "Target large engineering teams instead of individual developers.",
    paragraph:
      "Selling agent reliability to a platform team is a budget line, not a hobby purchase. The same product, pointed at organizations, changes the economics of the entire idea.",
    projected: 78,
    reasons: [
      "Budget holder with a real pain budget",
      "Team-wide contracts instead of $15 subscriptions",
      "Procurement channel is reachable",
      "Usage data compounds defensibility",
      "Platform players underserve enterprise compliance needs",
    ],
    steps: [
      "Interview 10 platform and engineering leads about agent failures on large repos",
      "Test a team-plan landing page before building self-serve",
      "Validate willingness to pay at team price points",
    ],
  },
  nextSteps: [
    "Interview 10 platform and engineering leads about agent failures on large repos",
    "Test a team-plan landing page before building self-serve",
    "Validate willingness to pay at team price points",
  ],
});

const complianceResult = () => ({
  viability: 81,
  killRisk: 26,
  confidence: 82,
  quote:
    "Strong business pain with a clear buyer and recurring budget. This is one of the rare ideas where the market structure works in your favor.",
  factors: [
    { key: "problem", name: "Problem Strength", score: 88, text: "Audit prep is a hated, recurring, budget-backed pain. Companies pay consultants five figures to make it go away." },
    { key: "market", name: "Market Opportunity", score: 78, text: "Every SaaS company selling to enterprises needs compliance. The trigger is revenue, so the market grows with your customers." },
    { key: "competition", name: "Competition", score: 62, text: "Vanta and Drata own the broad market, but workflow gaps remain — especially post-certification evidence maintenance." },
    { key: "differentiation", name: "Differentiation", score: 71, text: "\"Continuous evidence from existing tools\" is a workflow wedge, not just a feature — if you integrate deeper than incumbents' checklists." },
    { key: "monetization", name: "Monetization", score: 84, text: "Compliance budgets are real, recurring, and defended. Churn is low because ripping out an audit trail is painful." },
    { key: "distribution", name: "Distribution", score: 68, text: "Buyers are identifiable and reachable through compliance consultants and auditor partnerships." },
    { key: "execution", name: "Execution Feasibility", score: 74, text: "Integration breadth is the grind, but nothing here is technically heroic." },
    { key: "defensibility", name: "Defensibility", score: 73, text: "Historical evidence trails create switching costs. Data accumulates value over time." },
  ],
  findings: [
    { tone: "green", title: "The pain has a budget attached", body: "Compliance blocks enterprise deals. Companies do not evaluate this purchase emotionally — they need it." },
    { tone: "amber", title: "Incumbents are strong but not complete", body: "Vanta and Drata are real threats. Your wedge must be a workflow they structurally underserve, not a nicer UI." },
    { tone: "amber", title: "Integrations are the moat and the grind", body: "The value is in deep, reliable connections to customers' stacks. That is slow, unglamorous work." },
    { tone: "green", title: "Churn works for you", body: "Once a company's audit trail lives in your system, leaving is a project nobody wants." },
  ],
  evidence: [
    {
      title: "Willingness to Pay",
      level: "HIGH",
      levelTone: "green",
      strength: "Strong",
      points: [
        "Compliance is a revenue blocker, not a nice-to-have.",
        "Existing spend on consultants and platforms confirms budget.",
        "Renewals in this category are among the stickiest in SaaS.",
      ],
    },
    {
      title: "Market Structure",
      level: "FAVORABLE",
      levelTone: "green",
      strength: "Strong",
      points: [
        "Compliance requirements expand as customers move upmarket.",
        "Regulatory pressure is increasing, not decreasing.",
        "Recurring annual audits guarantee recurring need.",
      ],
    },
    {
      title: "Competition",
      level: "MODERATE",
      levelTone: "amber",
      strength: "Moderate",
      points: [
        "Two dominant platforms own broad mindshare.",
        "Post-certification maintenance remains underserved.",
        "Auditor and consultant channels are still open to new entrants.",
      ],
    },
  ],
  save: {
    possible: false,
    explanation:
      "No meaningful improvement found. The constraint on this idea is execution and validation, not positioning — changing the target customer or pricing model would not materially raise the score.",
    positive: true,
  },
  nextSteps: [
    "Interview 10 SaaS founders or CTOs who recently passed an audit",
    "Map the post-certification workflow gaps the incumbents leave open",
    "Secure 2–3 design partners before building integrations",
    "Test pricing against consultant spend, not against software seats",
  ],
});

const QUOTES = [
  "The problem may be real, but the input does not establish durable differentiation or a credible path to the first 100 customers.",
  "Nothing in the input shows why this wins. The market rarely rewards \"another one\".",
  "The idea is buildable, which is exactly the problem — buildability is not a business case.",
];

const truncate = (s, n) => (s.length > n ? s.slice(0, n).trimEnd() + "…" : s);

const generatedResult = (form) => {
  const rnd = mulberry32(hashSeed(form.idea + "|" + form.target));
  const f = (min, span) => Math.round(min + rnd() * span);
  const target = truncate(form.target || "the stated audience", 64);
  const diff = truncate(form.differentiation || "The stated differentiator", 80);
  const model = (form.monetization || "Subscription").toLowerCase();

  const factors = [
    { key: "problem", name: "Problem Strength", score: f(32, 34), text: `The problem may be real for ${target}, but the input does not establish that it is urgent or budget-backed.` },
    { key: "market", name: "Market Opportunity", score: f(30, 34), text: "The addressable market is plausible on paper. Plausible markets are where most startups go to die." },
    { key: "competition", name: "Competition", score: f(8, 30), text: "The category shows signs of existing solutions and low switching costs. Entering without a structural advantage is expensive." },
    { key: "differentiation", name: "Differentiation", score: f(12, 34), text: `"${diff}" reads as a feature, not a moat. Incumbents could copy it in one release cycle.` },
    { key: "monetization", name: "Monetization", score: f(25, 39), text: `A ${model} model can work, but the input provides no evidence of willingness to pay at a price that sustains a business.` },
    { key: "distribution", name: "Distribution", score: f(15, 34), text: "No credible low-cost path to the first 100 customers was identified in the input." },
    { key: "execution", name: "Execution Feasibility", score: f(60, 29), text: "The MVP appears technically achievable. Engineering is not your problem." },
    { key: "defensibility", name: "Defensibility", score: f(10, 29), text: "No data advantage, network effect, or switching cost was identified. Anything you build can be rebuilt." },
  ];

  const get = (k) => factors.find((x) => x.key === k).score;
  const viability = Math.round(
    get("problem") * 0.16 +
      get("market") * 0.13 +
      get("competition") * 0.14 +
      get("differentiation") * 0.14 +
      get("monetization") * 0.12 +
      get("distribution") * 0.13 +
      get("execution") * 0.07 +
      get("defensibility") * 0.11,
  );

  const quote = QUOTES[Math.floor(rnd() * QUOTES.length)];

  const save =
    viability >= 40
      ? {
          possible: true,
          change: `Narrow the target customer from "${target}" to one specific niche with an urgent, budget-backed version of this problem.`,
          paragraph:
            "A narrower wedge turns a generic product into a specific solution someone can say yes to. It does not fix a broken market — it only works when the underlying pain is real.",
          projected: Math.min(78, viability + 14 + Math.round(rnd() * 8)),
          reasons: [
            "Clearer buyer",
            "Stronger pain point",
            "Higher willingness to pay",
            "A distribution path you can actually name",
            "More defensible positioning",
          ],
          steps: stepsFor("amber"),
        }
      : {
          possible: false,
          explanation:
            "The core problem appears to be market structure rather than positioning. Changing the target customer or pricing model is unlikely to materially improve the opportunity.",
        };

  return {
    viability,
    killRisk: Math.min(95, 100 - viability + 8),
    confidence: 68 + Math.round(rnd() * 12),
    quote,
    factors,
    findings: [
      { tone: "red", title: "Differentiation is weak", body: "The stated differentiator is a feature, not a durable advantage." },
      { tone: "red", title: "Distribution is unclear", body: "There is no obvious low-cost path to the first 100 customers." },
      { tone: "amber", title: "Willingness to pay is unproven", body: `A ${model} model is a hypothesis, not evidence.` },
      { tone: "green", title: "Execution is not the problem", body: "The MVP is buildable. The risk is market structure, not engineering." },
    ],
    evidence: [
      {
        title: "Competition Risk",
        level: "HIGH",
        levelTone: "red",
        strength: "Moderate",
        points: [
          "Comparable solutions likely already exist in or adjacent to this category.",
          "Switching costs for this type of product appear low.",
          "No platform or data advantage was identified in the input.",
        ],
      },
      {
        title: "Differentiation",
        level: "WEAK",
        levelTone: "red",
        strength: "Moderate",
        points: [
          "The stated differentiator is replicable by incumbents.",
          "No proprietary workflow or dataset was described.",
        ],
      },
      {
        title: "Demand",
        level: "UNPROVEN",
        levelTone: "amber",
        strength: "Moderate",
        points: [
          "The input asserts a problem but provides no demand evidence.",
          "No existing spend or workaround behavior was identified.",
        ],
      },
    ],
    save,
    nextSteps: stepsFor(verdictFor(save.possible ? save.projected : viability).tone === "green" ? "amber" : verdictFor(viability).tone),
  };
};

export function analyzeIdea(form) {
  const text = `${form.idea} ${form.differentiation} ${form.problem}`.toLowerCase();
  let result;
  if (text.includes("todo")) result = todoResult();
  else if (text.includes("code review")) result = codeReviewResult();
  else if (text.includes("context package") || text.includes("coding agent")) result = contextResult();
  else if (text.includes("compliance") || text.includes("audit") || text.includes("soc 2")) result = complianceResult();
  else if (text.includes("figma")) result = figmaResult();
  else result = generatedResult(form);

  return {
    ...result,
    form,
    analyzedAt: new Date().toISOString(),
  };
}
