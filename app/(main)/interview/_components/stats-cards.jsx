import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCards({ assessments }) { // it takes assessments as a prop from the parent component
  const getAverageScore = () => { // calculates the average score from all assessments
    if (!assessments?.length) return 0; // if no assessments, return 0
    const total = assessments.reduce( // sums up all quiz scores , reduce iterates over each assessment and adds the quizScore to the total sum
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1); // returns the average score rounded to one decimal place
  }; 

  const getLatestAssessment = () => { // retrieves the most recent assessment
    if (!assessments?.length) return null;
    return assessments[0]; // assumes assessments are sorted by date, so the first one is the latest
  };

  const getTotalQuestions = () => { // calculates the total number of questions across all assessments
    if (!assessments?.length) return 0;
    return assessments.reduce( // sums up the length of questions in each assessment
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
  <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 
             bg-clip-text text-transparent animate-gradient-slow">
        Average Score
      </CardTitle>
      <Trophy className="h-4 w-4 text-cyan-300/60" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">
        {getAverageScore()}%
      </div>
      <p className="text-xs text-cyan-400/60">Across all assessments</p>
    </CardContent>
  </Card>

  <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 
             bg-clip-text text-transparent animate-gradient-slow">
        Questions Practiced
      </CardTitle>
      <Brain className="h-4 w-4 text-cyan-300/60" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">
        {getTotalQuestions()}
      </div>
      <p className="text-xs text-cyan-400/60">Total questions</p>
    </CardContent>
  </Card>

  <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-semibold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 
             bg-clip-text text-transparent animate-gradient-slow">
        Latest Score
      </CardTitle>
      <Target className="h-4 w-4 text-cyan-300/60" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">
        {getLatestAssessment()?.quizScore.toFixed(1) || 0}% {/* displays the latest assessment score or 0 if none */}
      </div>
      <p className="text-xs text-cyan-400/60">Most recent quiz</p>
    </CardContent>
  </Card>
</div>

  );
}
