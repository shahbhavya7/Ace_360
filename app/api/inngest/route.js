import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest/client";
import { generateIndustryInsights } from "@/lib/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest, // Inngest client instance to handle the serverless function it has name , gemini API key and other credentials
  functions: [
    generateIndustryInsights, // Register the generateIndustryInsights function to be run by Inngest 
  ],
});
