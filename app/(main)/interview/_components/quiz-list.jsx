"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";

export default function QuizList({ assessments }) { // also takes assessments as a prop from the parent component
    // useState to manage the selected quiz for detailed view
    const router = useRouter();
    const [selectedQuiz, setSelectedQuiz] = useState(null); // state to hold the currently selected quiz for detailed view

    return (
        <>
            <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent animate-gradient-slow">
                                Recent Quizzes
                            </CardTitle>
                            <CardDescription className="text-cyan-400/60">
                                Review your past quiz performance
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => router.push("/interview/mock")}
                            className="bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-700
                                       bg-[length:200%_200%] animate-gradient-slow
                                     text-white font-medium px-4 py-2 rounded-md
                                      transition duration-300 ease-in-out hover:opacity-90 hover:shadow-md"
                        >
                            Start New Quiz
                        </Button>

                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {assessments?.map((assessment, i) => ( // maps through each assessment to display them in a list
                            <Card
                                key={assessment.id}
                                className="bg-[#0f172a] border border-cyan-400/5 cursor-pointer hover:border-cyan-300/20 hover:shadow-md transition duration-200"
                                onClick={() => setSelectedQuiz(assessment)}
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 
                                                          bg-clip-text text-transparent animate-gradient-slow">
                                        Quiz {i + 1}
                                    </CardTitle>
                                    <CardDescription className="flex justify-between w-full text-cyan-400/80 text-sm">
                                        <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                                        <div>
                                            {format(new Date(assessment.createdAt), "MMMM dd, yyyy HH:mm")}
                                        </div>
                                    </CardDescription>
                                </CardHeader>

                                {assessment.improvementTip && ( // conditionally renders improvement tip if available
                                    <CardContent>
                                        <p className="text-sm font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                                                      bg-clip-text text-transparent animate-gradient-slow leading-tight">
                                            {assessment.improvementTip}
                                        </p>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Dialog to show full result */}
            {/* Dialog is a component in shadcn which provides a modal dialog interface */}
            {/* opens when a quiz is selected and onOpenChange is triggered i.e when the dialog is closed then setSelectedQuiz is called with null */}
            <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-cyan-400/10">
                    <DialogHeader>
                        <VisuallyHidden>
                            <DialogTitle>Quiz Results</DialogTitle>
                        </VisuallyHidden>
                    </DialogHeader>
                    <QuizResult
                        result={selectedQuiz}
                        hideStartNew // hides the start new quiz button in the dialog
                        onStartNew={() => router.push("/interview/mock")} // function to start a new quiz hidden in the dialog
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
