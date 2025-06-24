"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoverLetterGenerator() {
  const router = useRouter();

  const { // Initialize form with react-hook-form with zod validation instead of react-hook-form's built-in validation
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema), // Use the cover letter schema for validation
  });

  const { // Custom hook to handle fetching and generating cover letters
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter); // generateCoverLetter is passed to useFetch to handle the API call , useFetch adds loading state and error handling
  // and returns the generated letter data , it adds these features as layer on top of our fn and gives a new function to call generateLetterFn

  // Update content when letter is generated
  useEffect(() => {
    if (generatedLetter) { // If a cover letter is successfully generated, navigate to the preview page
      toast.success("Cover letter generated successfully!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);  // Navigate to the preview page with the generated letter's ID which will be used to fetch the letter details later
      reset();
    }
  }, [generatedLetter]); // Reset the form and navigate to the preview page when a letter is generated

  const onSubmit = async (data) => { // Function to handle form submission
    try {
      await generateLetterFn(data); // Call the generateLetterFn with the form data to generate the cover letter
      // generateLetterFn will handle the API call and set the generated letter in the data state
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#0f172a] p-6 shadow shadow-cyan-500/10">
  <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
    Job Details
  </h3>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    {/* Grid for company and title */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-cyan-200">Company Name</Label>
        <Input
          id="companyName"
          placeholder="Enter company name"
          className="bg-zinc-900 border border-cyan-700 focus-visible:ring-cyan-400 text-white"
          {...register("companyName")}
        />
        {errors.companyName && (
          <p className="text-sm text-red-500">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobTitle" className="text-cyan-200">Job Title</Label>
        <Input
          id="jobTitle"
          placeholder="Enter job title"
          className="bg-zinc-900 border border-cyan-700 focus-visible:ring-cyan-400 text-white"
          {...register("jobTitle")}
        />
        {errors.jobTitle && (
          <p className="text-sm text-red-500">
            {errors.jobTitle.message}
          </p>
        )}
      </div>
    </div>

    {/* Job Description */}
    <div className="space-y-2">
      <Label htmlFor="jobDescription" className="text-cyan-200">Job Description</Label>
      <Textarea
        id="jobDescription"
        placeholder="Paste the job description here"
        className="h-32 bg-zinc-900 border border-cyan-700 focus-visible:ring-cyan-400 text-cyan-100"
        {...register("jobDescription")}
      />
      {errors.jobDescription && (
        <p className="text-sm text-red-500">
          {errors.jobDescription.message}
        </p>
      )}
    </div>

    {/* Submit Button */}
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={generating}
        className="bg-[#0f172a] text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950 hover:text-white shadow shadow-cyan-500/20 transition"
      >
        {generating ? ( // Show loading spinner and text while generating cover letter
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Cover Letter"
        )}
      </Button>
    </div>
  </form>
</div>

  );
}
