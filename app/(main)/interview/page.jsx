import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-extrabold tracking-tight mb-3 
                       bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">
          Interview Insights
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
       <QuizList assessments={assessments} />
      </div>
    </div>
  );
}