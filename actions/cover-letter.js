"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCoverLetter(data) { //data object should contain jobTitle, companyName, jobDescription
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized"); // Ensure user is authenticated

  const user = await db.user.findUnique({ // Fetch user based on Clerk user ID
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found"); // Ensure user exists in the database

 // prompt for the AI model to generate a cover letter  
  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${ 
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try { //
    const result = await model.generateContent(prompt); // Generate content using the AI model
    const content = result.response.text().trim(); // Get the generated text

    const coverLetter = await db.coverLetter.create({ // Save the generated cover letter to the database using data 
      // data here is neon object with content, jobDescription, companyName, jobTitle, status, and userId
      // content is the generated cover letter text
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter; // Return the created cover letter
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() { // Fetch all cover letters for the authenticated user , this function is used to get all cover letters for the user
  // and show them in the UI
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: { // Order by createdAt in descending order
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) { // Fetch a specific cover letter by ID for the authenticated user
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) { // Delete a specific cover letter by ID for the authenticated user
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
