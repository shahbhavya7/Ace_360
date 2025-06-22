import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({ // industry is a string checked by zod if it is not a string, it will throw an error
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(), // bio is a string checked by zod if it is not a string, it will throw an error and its optional
  experience: z // experiance is string which is converted to decimal (as 10 specified in parseInt)
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe( // pipe is a method to chain multiple validators to make complex validators
      z
        .number() // number is a number checked by zod if it is not a number, it will throw an error
        .min(0, "Experience must be at least 0 years") // min is a method to check if the number is greater than 0
        .max(50, "Experience cannot exceed 50 years") // max is a method to check if the number is less than 50
    ),
  skills: z.string().transform((val) => // transfrom the comma separated string to an array by spliting it on base of comma
  // and filtering out the empty strings/spaces
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});

export const contactSchema = z.object({ // contactSchema is an object which contains the contact information of the user
  // it is used in the resumeSchema for the contact information of the user in form
  email: z.string().email("Invalid email address"), // email is a string checked by zod if it is not a string, it will throw an error
  mobile: z.string().optional(), // mobile is an optional string checked by zod if it is not a string, it will throw an error
  linkedin: z.string().optional(),  // linkedin is an optional string checked by zod if it is not a string, it will throw an error
  twitter: z.string().optional(), // twitter is an optional string checked by zod if it is not a string, it will throw an error
});

export const entrySchema = z
  .object({ // entrySchema is an object which contains the information of the user in form
    // it is used in the resumeSchema for the experience, education and projects of the user
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })
  .refine( // refine is a method to add custom validation to the schema
    // it takes a function which returns true if the data is valid and false if the data
    (data) => { // if the data is not present and the endDate is not present then it is invalid return false and show the error message on the endDate field
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

export const resumeSchema = z.object({ // combined schema for resume 
  contactInfo: contactSchema, // for contact information of the user use contactSchema
  summary: z.string().min(1, "Professional summary is required"), // summary is a string checked by zod if it is not a string, it will throw an error
  skills: z.string().min(1, "Skills are required"), // skills is a string checked by zod if it is not a string, it will throw an error
  experience: z.array(entrySchema), // experience is an array from some entrySchema objects
  education: z.array(entrySchema), // education is an array from some entrySchema objects
  projects: z.array(entrySchema), // projects is an array from some entrySchema objects
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});
