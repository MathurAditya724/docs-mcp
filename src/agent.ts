import { anthropic } from "@ai-sdk/anthropic";
import { ToolLoopAgent } from "ai";

export function createAgent() {
  return new ToolLoopAgent({
    model: anthropic("claude-sonnet-4-6"),
  });
}
