import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => { // checkUser is an async function that checks if the user is logged in
  const user = await currentUser(); // currentUser is a function provided by Clerk that returns the current user which is logged in
  // it gives user id, sessionId, and other auth related info in object form

  if (!user) { // if the user is not logged in we return null
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({ // findUnique is a function provided by Prisma that returns the user with the given id
      where: {
        clerkUserId: user.id, // where the id is equal to the id of the current user given by Clerk
        // clerUserId variable is the id of the user in the database , so here we are checking if the user is already in the database by matching the id
      },
    });

    if (loggedInUser) { // if the user is logged in we return the user
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`; // if the user is not logged in we create a new user by combining the first name and last name

    const newUser = await db.user.create({ // create is a function provided by Prisma that creates a new user
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl, // imageUrl is the url of the user's profile picture
        email: user.emailAddresses[0].emailAddress, // emailAddresses is an array of the user's email addresses
      },
    });

    return newUser; // we return the new user
  } catch (error) {
    console.log(error.message);
  }
};
