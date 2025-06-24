
import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  Book,
  GraduationCap,
  ChevronDown,
  Brain,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";



const header = async() => {
  await checkUser();
  return (
      <header className="fixed top-0 w-full z-50 border-b bg-[#0d1117] bg-[radial-gradient(circle_at_top_center,rgba(0,200,255,0.06)_0%,transparent_70%),url('/grid.svg')] bg-[length:100%_100%,60px_60px] bg-no-repeat bg-fixed bg-top backdrop-blur-md">
  <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
    {/* Logo */}
    <Link href="/">
      <Image
        src={"/log.png"}
        alt="Ace 360 Logo"
        width={200}
        height={60}
        className="h-12 py-1 w-auto object-contain"
      />
    </Link>

    {/* Right Side */}
    <div className="flex items-center space-x-2 md:space-x-4">
      <SignedIn>
        {/* Dashboard Button */}
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="bg-[#0f172a] text-cyan-300 border border-cyan-500 hover:bg-cyan-900/40 transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            Industry Insights
          </Button>
          <Button variant="ghost" className="md:hidden w-10 h-10 p-0 text-cyan-300 hover:text-cyan-100">
            <LayoutDashboard className="h-4 w-4" />
          </Button>
        </Link>

        {/* Growth Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold transition"
            >
              <StarsIcon className="h-4 w-4" />
              <span className="hidden md:block">Growth Tools</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#0f172a] border border-cyan-500/10 text-cyan-300 shadow-xl"
          >
            <DropdownMenuItem asChild>
              <Link href="/resume" className="flex items-center gap-2 hover:text-cyan-100">
                <FileText className="h-4 w-4 text-cyan-200" />
                Build Resume
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/ai-cover-letter" className="flex items-center gap-2 hover:text-cyan-100">
                <PenBox className="h-4 w-4 text-cyan-200" />
                Cover Letter
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/interview" className="flex items-center gap-2 hover:text-cyan-100">
                <Book className="h-4 w-4 text-cyan-200"/>
                Interview Prep
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>

      {/* Auth Buttons */}
      <SignedOut>
        <SignInButton>
          <Button
            variant="outline"
            className="text-cyan-300 border-cyan-500 hover:bg-cyan-600/10"
          >
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "bg-[#0f172a] border border-cyan-500/10 text-cyan-100 shadow-xl",
              userPreviewMainIdentifier: "font-semibold text-cyan-300",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  </nav>
</header>

  )
}

export default header