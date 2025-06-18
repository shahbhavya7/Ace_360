import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

export default function MockInterviewPage() {
  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0 text-cyan-300">
            <ArrowLeft className="h-4 w-4 " />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className="text-6xl font-extrabold tracking-tight mb-3 
                       bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">Mock Interview</h1>
          <p className="text-cyan-300">
            Test your knowledge with industry-specific questions
          </p>
        </div>
      </div>

      <Quiz />
    </div>
  );
}
