import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ace 360 - Your Career Companion",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
   <ClerkProvider
     appearance={{
    baseTheme: dark,
    variables: {
      colorPrimary: "#06b6d4", // Cyan-400
      colorText: "#0ea5e9", // Light cyan/blue text
      colorBackground: "#0f172a", // Match your app bg
      colorInputBackground: "#0d1117", // Match input bg
      colorInputText: "#ffffff",
      colorDanger: "#f87171", // Red-400 for errors
    },
    elements: {
      card: "shadow-lg border border-cyan-500/20 bg-[#0f172a]",
      headerTitle: "text-cyan-400 text-lg font-bold",
      formButtonPrimary:
        "bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:opacity-90 transition",
      formFieldInput: "bg-[#0d1117] text-white placeholder:text-gray-400",
      footerActionText: "text-cyan-400",
      footer: "border-t border-cyan-400",
    },
    layout: {
      socialButtonsPlacement: "top",
      socialButtonsVariant: "button", // Or "iconButton" if you prefer
      helpPageUrl: "/help",
      privacyPageUrl: "/privacy",
      termsPageUrl: "/terms",
      showOptionalFields: false,
    },
  }}
    >
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <Header/>
            <main className="min-h-screen">  {children}</main>
            <Toaster richColors/>
            {/* Footer */}
      <footer className="text-center py-8 bg-transparent text-sm">
  <div className="container mx-auto px-4 space-y-1 text-cyan-200/80">
    <p>
      © 2025 <span className="text-cyan-400 font-semibold">Ace 360</span>
    </p>
    <p>
      Crafted with care by <span className="text-cyan-400 font-semibold">Bhavya</span>.
    </p>
  </div>
</footer>


          
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
