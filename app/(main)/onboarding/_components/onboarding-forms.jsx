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
import { updateUser } from "@/actions/user";

const OnboardingForm = ({industries}) => {
  const router = useRouter(); // this hook helps us to navigate between pages
  const [selectedIndustry, setSelectedIndustry] = useState(null);


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


  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card className="w-full max-w-lg border border-cyan-500/20 bg-[#111827] shadow-md hover:shadow-cyan-400/10 transition duration-300 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient-slow"> Complete Your Profile</CardTitle>
          <CardDescription className="text-cyan-200/70 pt-2">
            Fill out the form below to unlock the full potential of <span className="text-cyan-400 font-medium">Ace 360</span>.
          </CardDescription>
        </CardHeader>
<CardContent>
  <form>
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
          className="bg-[#0d1117] border border-cyan-500/20 text-cyan-100 placeholder-cyan-400 focus:ring-cyan-400 focus:border-cyan-400"
        >
          <SelectValue placeholder="Select an industry" />
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
  </form>
</CardContent>

      </Card>
    </div>
  )
}

export default OnboardingForm