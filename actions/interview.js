"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuiz() { // Function to generate a quiz based on user's industry and skills
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized"); // Check if user is logged in, if not throw an error

  const user = await db.user.findUnique({ // Find the user in the database using their clerkUserId if they are logged in
    where: { clerkUserId: userId },
    select: {
      industry: true, // Select the industry and skills of the user
      skills: true,
    },
  });

  if (!user) throw new Error("User not found"); // If user is not found, throw an error

  const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${ // Generate a prompt based on the user's industry and skills if available
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt); // Call the generative model to generate content based on the prompt
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText); // Parse the generated text into JSON format

    return quiz.questions; // Return the questions from the generated quiz
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) { // Function to save the quiz result, questions, answers, and score
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ // Find the user in the database using their clerkUserId if they are logged in
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found"); // If user is not found, throw an error

  const questionResults = questions.map((q, index) => ({ // Take each question and its index and Map through the questions and create an object for each 
  // question with its details
    question: q.question, // first member in the object is the question text
    answer: q.correctAnswer, // second member is the correct answer from the question object which has correctAnswer property in json format
    userAnswer: answers[index], // third member is the user's answer from the answers array passed in saveQuizResult
    isCorrect: q.correctAnswer === answers[index], // fourth member is a boolean indicating if the user's answer is correct
    explanation: q.explanation, // fifth member is the explanation for the correct answer
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect); // Filter the question results to get only the questions where the user's answer is incorrect

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) { // If there are wrong answers, generate an improvement tip
    const wrongQuestionsText = wrongAnswers
      .map( // Map through the wrong answers and format them into a string
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = ` 
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `; // Generate a prompt for the generative model to create an improvement tip based on the user's wrong answers

    try {
      const tipResult = await model.generateContent(improvementPrompt); // Call the generative model to generate content based on the improvement prompt
 
      improvementTip = tipResult.response.text().trim(); // Get the text from the response and trim it
      console.log(improvementTip); // Log the improvement tip for debugging
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try { // Save the assessment result to the database
    const assessment = await db.assessment.create({ // Create a new assessment record in the database
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() { // Function to get all assessments for the logged-in user.
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({ // Find all assessments for the user in the database according to their userId
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments; // Return the assessments found in the database
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
