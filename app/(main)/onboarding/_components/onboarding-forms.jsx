"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingSchema } from "@/app/lib/schema";
//import useFetch from "@/hooks/use-fetch";

import { updateUser } from "@/actions/user";

const OnboardingForm = ({ industries }) => {
  const router = useRouter(); // this hook helps us to navigate between pages
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const { // useFetch hook does two way communication between the component and the callback function updateUser i.e it also returns the data , loading and final updateUserFn function
    // and also takes updateUser as a callback function
    loading: updateLoading,  // the loading state is set to updateLoading
    fn: updateUserFn, // the overall function returned by the useFetch hook is set to updateUserFn , this function takes the data collected from the form, 
    // and loading and error details from which it sets the loading and error states and data collected is passed to callback function updateUser when this fn is called
    data: updateResult, // the updateResult contains the data collected from the form recieved via the useFetch hook
  } = useFetch(updateUser); // the use-fetch takes updateUser as a callback function also returns the data , loading and final updateUserFn function

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ // useform returns an object containing methods and properties related to form validation like register, handleSubmit, formState
    resolver: zodResolver(onboardingSchema), // useform is a form validation library from react hook form here we say that we want to use zod
    // resolver as our form validation library passing onboardingSchema which has our form validation rules
  });


  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({ // invoke the updateUserFn function with the data collected from the form and set the loading and error state variables accordingly 
        // during submission of the form
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };



  useEffect(() => { // this useEffect hook is called whenever the updateResult or updateLoading state changes according to useFetch hook
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  const watchIndustry = watch("industry");

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card className="w-full max-w-lg border border-cyan-500/20 bg-[#111827] shadow-md hover:shadow-cyan-400/10 transition duration-300 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient-slow"> Complete Your Profile</CardTitle>
          <CardDescription className="text-sm text-cyan-400/70">
            Fill out the form below to unlock the full potential of <span className="text-cyan-400 font-medium">Ace 360</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="industry" className="text-cyan-100/80 text-sm">
                Industry
              </Label>

              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(industries.find((ind) => ind.id === value));
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger
                  id="industry"
                  className="bg-[#111827] border border-cyan-500/20 text-cyan-100
               placeholder-cyan-400 rounded-md px-4 py-2
               focus-visible:outline-none focus-visible:ring-1
               focus-visible:ring-cyan-400 focus-visible:ring-offset-0
               transition duration-200"
                >
                  <SelectValue
                    placeholder="Select an industry"
                    className="text-cyan-300"
                  />
                </SelectTrigger>


                <SelectContent className="bg-[#0d1117] border border-cyan-500/20 text-cyan-100">
                  <SelectGroup>
                    <SelectLabel className="text-cyan-100/80 font-semibold">Industries</SelectLabel>
                    {industries.map((ind) => (
                      <SelectItem
                        key={ind.id}
                        value={ind.id}
                        className="hover:bg-cyan-500/10 focus:bg-cyan-500/10 focus:text-cyan-300"
                      >
                        {ind.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {errors.industry && (
                <p className="text-sm text-red-500">{errors.industry.message}</p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry" className="text-cyan-100/80 text-sm">Specialization</Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry"
                    className="bg-[#111827] border border-cyan-500/20 text-cyan-100
               placeholder-cyan-400 rounded-md px-4 py-2
               focus-visible:outline-none focus-visible:ring-1
               focus-visible:ring-cyan-400 focus-visible:ring-offset-0
               transition duration-200">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1117] border border-cyan-500/20 text-cyan-100">
                    <SelectGroup>
                      <SelectLabel className="text-cyan-100/80 font-semibold">Specializations</SelectLabel>
                      {selectedIndustry?.subIndustries.map((sub) => (
                        <SelectItem key={sub} value={sub} className="hover:bg-cyan-500/10 focus:bg-cyan-500/10 focus:text-cyan-300">
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-6">
              {/* Years of Experience Field */}
              <div className="space-y-2">
                <Label htmlFor="experience" className="text-cyan-100/80 text-sm  ">
                  Years of Experience
                </Label >
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="Enter years of experience"
                  className="bg-[#0f172a] text-cyan-100  border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition duration-200 rounded-md "
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience.message}</p>
                )}
              </div>
            </div>

            {/* Skills Field */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-cyan-100/80 text-sm">
                Skills
              </Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                className="bg-[#0f172a] text-cyan-100  border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition duration-200 rounded-md"
                {...register("skills")}
              />
              <p className="text-sm text-cyan-400/70">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-cyan-100/80 text-sm"
              >
                Professional Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className="h-32 placeholder:text-cyan-200/60 focus-visible:ring-cyan-400/50 focus-visible:border-cyan-400/40 text-cyan-100"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 text-black font-semibold hover:brightness-110 transition"
              disabled={updateLoading}> {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}</Button>





          </form>
        </CardContent>

      </Card>
    </div>


  )
}

export default OnboardingForm