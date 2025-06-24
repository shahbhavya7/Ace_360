import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1
          className="text-6xl font-extrabold tracking-tight mb-3 
                       bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight"
        >
          My Cover Letters
        </h1>
        <Link href="/ai-cover-letter/new">
          <Button className="bg-[#0f172a] text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950 hover:text-white shadow shadow-cyan-500/20 transition">
            <Plus className="h-4 w-4 mr-2 " />
            Create New
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
