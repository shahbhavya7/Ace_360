import {
  BadgePlus,
  FileText,
  BotMessageSquare,
  TrendingUp,
} from "lucide-react";

export const howItWorks = [
  {
    title: "Smart Onboarding",
    description: "Kickstart with tailored questions that map your career journey.",
    icon: <BadgePlus className="w-8 h-8 text-cyan-400" />,
  },
  {
    title: "Optimize Your Resume",
    description: "Create AI-optimized resumes and standout cover letters.",
    icon: <FileText className="w-8 h-8 text-cyan-400" />,
  },
  {
    title: "Mock Interviews with AI",
    description: "Get real-time feedback through simulated interviews and role-play.",
    icon: <BotMessageSquare className="w-8 h-8 text-cyan-400" />,
  },
  {
    title: "Measure and Improve",
    description: "Visualize your growth with skill metrics and performance graphs.",
    icon: <TrendingUp className="w-8 h-8 text-cyan-400" />,
  },
];
