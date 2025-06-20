"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function saveResume(content) { // this function saves or updates the user's resume content
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ // Fetch the user based on Clerk's user ID and ensure they exist if not throw an error
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({ // Upsert operation to either create a new resume or update an existing one , update or insert a resume for the user
      // If a resume already exists for the user, it updates the content; otherwise, it creates a new resume entry
      where: { // Check if a resume already exists for the user
        userId: user.id,
      },
      update: { // If it exists, update the content
        content,
      },
      create: { // If it doesn't exist, create a new resume entry with the provided content
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume"); // Revalidate the path to ensure the latest resume data is fetched on the next request , 
    // revalidate means that the next time the resume page is accessed, it will fetch the latest data from the database
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() { // this function retrieves the user's resume from the database
  // It checks if the user is authenticated and fetches their resume based on their Clerk user ID
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({ // Fetch the resume for the authenticated user
    // It returns the resume content associated with the user's ID , resume object contains the resume content and other metadata
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) { // this function uses AI to improve the user's resume content based on the provided current content 
// and type , type can be "summary", "experience", "skills", etc.
  // It generates a more impactful and industry-aligned description using Google's Generative AI model
  const { userId } = await auth(); // Authenticate the user using Clerk's auth system
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ // Fetch the user based on Clerk's user ID and ensure they exist and include their industry insights
    // This is important for tailoring the AI-generated content to the user's industry
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found"); // current is the current content of the resume section to be improved
  // type is the type of content being improved (e.g., "summary", "experience", "skills")

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt); // Generate content using the AI model based on the provided prompt
    const response = result.response;
    const improvedContent = response.text().trim(); // Extract the generated text and trim any extra whitespace
    return improvedContent; // Return the improved content to the caller , it has been enhanced to be more impactful and aligned with industry standards
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}
