"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0); // State to track the current question index i.e the question being displayed
  const [answers, setAnswers] = useState([]); // State to store the user's answers for each question , initialized as an empty array
  const [showExplanation, setShowExplanation] = useState(false); // State to control whether to show the explanation for the current question

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz); // generateQuiz is a function to generate the quiz, it is passed to usefetch as callback function to fetch the quiz data
  // inside this usefetch the callback function generateQuiz is called which returns the quiz data from the server then it sets the quizData variable with the 
  // fetched data and also sets the loading state to true while fetching the data which is used to show a loading spinner while the data is being fetched
  // it also provides a function generateQuizFn which can be called to generate a new quiz when the user clicks on the "Start Quiz" button
  // so when the user clicks on the "Start Quiz" button, it calls the generateQuizFn which automatically passes the generateQuiz function to useFetch
  // and fetches the quiz data from the server and sets the quizData variable with the fetched data and also sets the loading state to true while fetching the 
  // data

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult); // saveQuizResult is a function to save the quiz result, it is passed to usefetch as callback function to save the quiz result
  // data , it is called when the user finishes the quiz and submits their answers, it saves the quiz result to the server and sets the resultData variable with
  // the answer and score data, it also sets the loading state to true while saving the data which is used to show a loading spinner while the data is being 
  // saved , so when the user finishes the quiz and clicks on the "Finish Quiz" button, it calls the saveQuizResultFn which automatically passes the saveQuizResult
  // function to useFetch along with the quizData, answers and score as parameters then it saves the quiz result to the server and sets the resultData variable 
  //  with the saved data and also sets the loading state to true while saving the data

  useEffect(() => { // When quiz data is available, initialize answers array for each question to null which will be filled as the user answers questions
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => { // Function to handle the user's answer selection, it updates the answers state with the selected answer for the current 
    // question
    const newAnswers = [...answers]; // Create a copy of the current answers array , ...answers creates a shallow copy of the answers array i.e it copies the 
    // elements of the answers array into a new array
    newAnswers[currentQuestion] = answer; // Update the answer for the current question
    setAnswers(newAnswers); // Set the updated answers array to the state variable 
  };

  const handleNext = () => { // Function to handle the next button click, it increments the current question index and resets the explanation visibility
    if (currentQuestion < quizData.length - 1) { // If there are more questions, increment the current question index
      setCurrentQuestion(currentQuestion + 1); // Increment the current question index by 1
      setShowExplanation(false); // Reset the explanation visibility to false as the user moves to the next question
    } else {
      finishQuiz(); // If there are no more questions, finish the quiz
    }
  };

  const calculateScore = () => { // Function to calculate the score based on the user's answers, it compares the user's answers with the correct answers and 
  // returns the score as a percentage
    let correct = 0;
    answers.forEach((answer, index) => { // Iterate through the user's answers in the answers array and compare with the correct answers array in quizData obj
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => { // Function to finish the quiz, it calculates the score and saves the quiz result to the server
    const score = calculateScore(); // Calculate the score based on the user's answers
    try {
      await saveQuizResultFn(quizData, answers, score); // Call the saveQuizResultfn with same parameters as saveQuizResult function which passes
      // param to saveQuizResult via useFetch, the saveQuizResult fn then executes and saves the quiz result to the server and returns the result data 
      // i.e the saved answers and score which is then set to the resultData state variable

      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => { // Function to reset the quiz state and start a new quiz with fresh data
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) { // If quiz is being generated, show a loading spinner
    return (
    <div className="w-full mt-4 flex justify-center">
      <BarLoader width={"100%"} color="#22d3ee" height={4} />
    </div>
  );
  }

  // Show results if quiz is completed
  if (resultData) {
    return ( // If resultData is available, it means the quiz has been completed and results are ready to be displayed
      // Display the quiz result in a card format and provide an option to start a new quiz by calling startNewQuiz function which resets the quiz state
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) { // If quiz data is not available, show a prompt to start the quiz in card format
    return (
<Card className="mx-2 bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
  <CardHeader>
    <CardTitle className="text-sky-400/80 text-lg font-semibold">
      Ready to test your knowledge?
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-cyan-300/70 text-sm">
      This quiz contains 10 questions specific to your industry and skills.
      Take your time and choose the best answer for each question.
    </p>
  </CardContent>
  <CardFooter>
    <Button
      onClick={generateQuizFn}
      className="w-full bg-sky-500 hover:bg-sky-400 text-[#0f172a] font-medium"
    >
      Start Quiz
    </Button>
  </CardFooter>
</Card>

    );
  }

  const question = quizData[currentQuestion]; // Get the current question based on the currentQuestion index

 return (
  <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10 mx-2">
    <CardHeader>
      <CardTitle className="text-sky-400/80 text-lg font-bold">
        Question {currentQuestion + 1} of {quizData.length}
        {/* display the current question number + 1  as array is 0-indexed */}
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">
      <p className="text-lg font-medium text-cyan-100">{question.question}</p>

      <RadioGroup
        // Radio group to display the options for the current question , onValueChange is used to handle the answer selection
        // whenevr any option is selected, it calls the handleAnswer function which updates the answers state with the selected answer for the current question
        onValueChange={handleAnswer}
        value={answers[currentQuestion]} // value is the current answer for the question 
        className="space-y-2"
      >
        {question.options.map((option, index) => (
          // Map through the options for the current question and display each option as a radio button
          // id is used to uniquely identify each radio button using the index
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option}
              id={`option-${index}`}
              className="border-cyan-600 text-cyan-300 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-black"
            />
            <Label
              htmlFor={`option-${index}`}
              className="text-cyan-200"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {showExplanation && ( // If showExplanation is true, display the explanation for the current question
        <div className="mt-4 p-4 bg-cyan-900/10 border border-cyan-400/10 rounded-lg">
          <p className="font-medium text-cyan-300">Explanation:</p>
          <p className="text-sm text-cyan-400/80">{question.explanation}</p>
        </div>
      )}
    </CardContent>

    <CardFooter className="flex justify-between">
      {!showExplanation && ( // If showExplanation is false, show the "Show Explanation" button
        <Button
          onClick={() => setShowExplanation(true)} // When clicked, it sets showExplanation to true to display the explanation
          variant="outline"
          disabled={!answers[currentQuestion]}
          className="border-cyan-600 text-cyan-300 hover:bg-cyan-800/20"
        >
          Show Explanation
        </Button>
      )}

      <Button // When clicked, it calls the handleNext function to move to the next question or finish the quiz
        onClick={handleNext} // Handle the next button click
        disabled={!answers[currentQuestion] || savingResult} // Disable the button if no answer is selected or if the result is being saved
        className="ml-auto bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
      >
        {savingResult ? ( // If savingResult is true, show a loading spinner else show the next question or finish quiz text
          // If quiz is being saved, show a loading spinner
          <div className="w-full flex justify-center">
            <BarLoader width={60} color="#22d3ee" height={4} />
          </div>
        ) : ( 
          currentQuestion < quizData.length - 1 // If there are more questions, show "Next Question" else show "Finish Quiz"
            ? "Next Question"
            : "Finish Quiz"
        )}
      </Button>
    </CardFooter>
  </Card>
);

}
