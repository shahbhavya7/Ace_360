"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({ // takes in props for the quiz result, optional flag to hide the start new button, and a callback function for starting a
    //  new quiz
    result,
    hideStartNew = false,
    onStartNew,
}) {
    if (!result) return null; // if no result is provided, return null to avoid rendering the component

    return (
        <div className="mx-auto">
            <h1 className="flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">
                <Trophy className="h-6 w-6 text-cyan-400" />
                Quiz Results
            </h1>


            <CardContent className="space-y-6 mt-4">
                {/* Score Overview */}
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">
                        {result.quizScore.toFixed(1)}%
                    </h3>
                    <Progress
                        value={result.quizScore}
                        className="w-full"
                    />
                </div>

                {/* Improvement Tip */}
                {result.improvementTip && (
                    <div className="bg-cyan-900/10 border border-cyan-400/10 p-4 rounded-lg">
                        <p className=" font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">Improvement Tip:</p>
                        <p className="text-sm bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">{result.improvementTip}</p>
                    </div>
                )}

                {/* Questions Review */}
                <div className="space-y-4">
                    <h3 className="font-medium text-cyan-300">Question Review - </h3>
                    {result.questions.map((q, index) => ( // map through each question in the result to display them
                        // display the question, user answer, correct answer, and explanation
                        <div
                            key={index}
                            className="border border-cyan-400/10 bg-[#0f172a] p-4 rounded-lg space-y-2"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-cyan-100">{q.question}</p>
                                {q.isCorrect ? ( // check if the answer is correct or not if correct, show a check icon, otherwise show an x icon
                                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                )}
                            </div>

                            <div className="text-sm text-cyan-400/70">
                                <p>Your answer: {q.userAnswer}</p>
                                {!q.isCorrect && ( // if the answer is incorrect, show the correct answer and explanation
                                    <p>Correct answer: <span className="text-cyan-300">{q.answer}</span></p>
                                )}
                            </div>

                            <div className="text-sm bg-cyan-900/10 border border-cyan-400/10 p-3 rounded">
                                <p className="font-medium text-cyan-300">Explanation:</p>
                                <p className="text-cyan-400/80">{q.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            {!hideStartNew && ( // if hideStartNew is false, render the button to start a new quiz
                <CardFooter>
                    <Button
                        onClick={onStartNew}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                    >
                        Start New Quiz
                    </Button>
                </CardFooter>
            )}
        </div>

    );
}
