export const DEMO_IDEAS = [
  {
    id: "code-review",
    label: "AI code review tool",
    form: {
      idea: "An AI-powered code review tool that automatically reviews pull requests, flags bugs, and suggests fixes.",
      target: "Software teams and indie developers",
      monetization: "Subscription",
      differentiation: "Faster and cheaper than human code review.",
      problem: "Code review is slow and bottlenecks shipping.",
    },
  },
  {
    id: "dev-productivity",
    label: "Developer productivity SaaS",
    form: {
      idea: "An AI assistant that analyzes large React codebases and creates task-specific context packages for coding agents.",
      target: "Individual developers using AI coding assistants",
      monetization: "Subscription",
      differentiation: "Builds precise, repo-aware context so coding agents stop hallucinating on large codebases.",
      problem: "Coding agents fail on large repositories because they lack the right context.",
    },
  },
  {
    id: "figma-react",
    label: "Figma-to-React generator",
    form: {
      idea: "A SaaS that automatically converts Figma designs into production-ready React components.",
      target: "Frontend developers, engineering teams, startups",
      monetization: "Subscription",
      differentiation: "Pixel-perfect output with design-token mapping, not just static HTML export.",
      problem: "Design-to-code handoff wastes hours of engineering time.",
    },
  },
];

export const EXAMPLE_FORM = DEMO_IDEAS[2].form;
