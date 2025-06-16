"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // create a new instance of the GoogleGenerativeAI class with the API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // get the generative model instance for the specified model

export const generateAIInsights = async (industry) => { // Generate AI insights for the specified industry
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt); // Generate content using the model with the provided prompt
  const response = result.response; // Get the response from the model
  const text = response.text(); // Extract the text from the response
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim(); // Clean the text by removing any code block formatting and trimming whitespace

  return JSON.parse(cleanedText); // Parse the cleaned text as JSON and return it
};

export async function getIndustryInsights() {
  const { userId } = await auth(); // Authenticate the user and get their userId
  if (!userId) throw new Error("Unauthorized"); // If no userId is found, throw an error

  const user = await db.user.findUnique({ // Find the user in the database by matching their clerkUserId and userId which they signed in with
    where: { clerkUserId: userId },
    include: {
      industryInsight: true, 
    }, // In user object, include the industryInsight relation to get any existing insights of the user by finding the user in the database
  });

  if (!user) throw new Error("User not found"); // If no user is found, throw an error

  // If no insights exist, generate them 
  if (!user.industryInsight) { 
    const insights = await generateAIInsights(user.industry); // Generate insights for the user's industry by retrieving the industry from the user object

    const industryInsight = await db.industryInsight.create({ // Create a new industryInsight record in the database with the generated insights
      data: { // in .create method, we pass the data object with the following properties industry, insights, and nextUpdate
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set nextUpdate to one week from now , it will be used to determine when the insights should be updated next
      }, // it returns the newly created industryInsight record
    });

    return industryInsight; // Return the newly created industryInsight record  
  }

  return user.industryInsight; // If insights already exist, return the existing industryInsight record
}
