"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUser(data) { // data is the data passed from the form and form hits this api along with the data
     const { userId } = await auth(); // check if user is logged in, if logged in, get userId , {userId} is a destructured object from the auth() function
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ // find the user in the database where the userId from database matches the userId from the auth() function
    where: { clerkUserId: userId }, // if user exists, return the user object
  });

  if (!user) throw new Error("User not found");

  try{
     // Start a transaction to handle both operations
    const result = await db.$transaction( // transaction is a special function provided by Prisma to handle multiple operations in a single transaction
      // if any operation fails, the entire transaction will be rolled back and the error will be thrown

      async (tx) => { // tx is the transaction object
        // Prisma gives you a special transaction client (tx) inside db.$transaction().This tx must be used for all operations inside the transaction.
        // All queries are part of one atomic transaction.They share the same context (e.g., DB connection, isolation level).
        // It means You're executing the query within the transaction context — not as a regular standalone query.
        // operation-1 First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({// The query is part of the transaction started by db.$transaction(...).
          // we find that in industryInsight table, does the industry column has industry passed by user in the form (data.industry)
          where: {
            industry: data.industry,
          },
        });
    

        // operation-2 If industry doesn't exist, create it with default values
        if (!industryInsight) {
          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              salaryRanges: [],
              growthRate: 0,
              demandLevel: "Medium",
              topSkills: [],
              marketOutlook: "Neutral",
              keyTrends: [],
              recommendedSkills: [],
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set next update to 7 days from now
            },
          });
        }

        // operation-3 Now update the user's fields in the User table with the industry from the IndustryInsight table
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: { // from industryInsight table, these are fields that overlap with user table so we can update them in user table
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,    
          },
        });

        return { updatedUser, industryInsight }; 
    }, // end of transaction , we update user and industry in one transaction and return the updated user and industry 
    {
        timeout : 10000 // set timeout to 10 seconds if the transaction takes longer than 10 seconds, the transaction will be rolled back and the error will be thrown
    }
    );

  }
  catch(error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true, // from that user, we select the industry
      },
    });

    return {
      isOnboarded: !!user?.industry, // if user has industry, return true which means user is onboarded
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}   