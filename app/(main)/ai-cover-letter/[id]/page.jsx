import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params; // Extract the id from params to fetch the specific cover letter
  const coverLetter = await getCoverLetter(id); // Fetch the cover letter details using the id recieived from params indeed from coverletter generator

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0 text-cyan-300">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <h1 className="text-6xl font-extrabold tracking-tight mb-3 
                       bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">
          {coverLetter?.jobTitle} at {coverLetter?.companyName}
        </h1>
      </div>
      { /* Display the cover letter preview with the content fetched from the database */ }
      <CoverLetterPreview className="text-cyan-200" content={coverLetter?.content} />
    </div>
  );
}
















// As id is a dynamic route which changes according to the id of the cover letter
    // we can access id in inside of its page.jsx by using params and params.id