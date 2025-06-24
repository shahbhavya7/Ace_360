"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

export default function CoverLetterList({ coverLetters }) { // CoverLetterList component to display a list of cover letters
  // This component receives coverLetters as a prop and displays them in a list format
  const router = useRouter();

  const handleDelete = async (id) => { // Function to handle deletion of a cover letter
    try {
      await deleteCoverLetter(id); // Call the deleteCoverLetter action with the provided id
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) { // If there are no cover letters, display a message
    // This condition checks if the coverLetters array is empty or undefined
    // If it is, it renders a message indicating that there are no cover letters yet
    // This is useful for providing feedback to the user when they haven't created any cover letters yet
    return (
    <Card className="border border-cyan-500/20 bg-[#0f172a] p-6 shadow shadow-cyan-500/10">
  <CardHeader>
    <CardTitle className="text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text">
      No Cover Letters Yet
    </CardTitle>
    <CardDescription className="text-cyan-200/70">
      Create your first cover letter to get started
    </CardDescription>
  </CardHeader>
</Card>

    );
  }

  return (
 <div className="space-y-4">
  {coverLetters.map((letter) => ( // Map through each cover letter and render a Card component for each
    // This iterates over the coverLetters array and creates a Card for each letter
    // Each Card displays the job title, company name, creation date, and provides options to
    <Card
      key={letter.id}
      className="group relative border border-cyan-700/40 hover:border-cyan-500/70 transition duration-300 bg-gradient-to-br from-[#0f172a] via-[#0a192f] to-[#030712] hover:shadow-md hover:shadow-cyan-400/10"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl gradient-title font-extrabold tracking-tight mb-3 
                       bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">
              {letter.jobTitle} at {letter.companyName}
            </CardTitle>
            <CardDescription className="text-cyan-300/80">
              Created {format(new Date(letter.createdAt), "PPP")}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <AlertDialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                className="text-cyan-300 hover:text-cyan-400 hover:bg-cyan-400/10"
              >
                <Eye className="h-4 w-4" />
              </Button>

              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className=" text-cyan-300 hover:text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="h-4 w-4 " />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-[#0f172a]  border border-cyan-700/40">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-cyan-300">Delete Cover Letter?</AlertDialogTitle>
                  <AlertDialogDescription className="text-cyan-100">
                    This action cannot be undone. This will permanently delete
                    your cover letter for <b>{letter.jobTitle}</b> at{" "}
                    <b>{letter.companyName}</b>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-cyan-300 hover:text-cyan-400 hover:bg-cyan-400/10">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(letter.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-cyan-100 line-clamp-3">
          {letter.jobDescription}
        </p>
      </CardContent>
    </Card>
  ))}
</div>

  );
}
