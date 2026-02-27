export interface Feature {
  code: string;
  description: string;
  name: string;
  setup: string;
  slug: string;
}

export interface SentrySkill {
  category: "framework" | "runtime" | "library";
  ecosystem: "javascript" | "python";
  features: Feature[];
  gettingStarted: string;
  name: string;
  packages: string[];
  rank: number;
  slug: string;
}
