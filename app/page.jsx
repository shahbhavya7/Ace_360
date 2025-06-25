import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero";
import { features } from "@/data/features";
import { Card, CardContent } from "@/components/ui/card";
import React from "react"; // ✅ Required for cloneElement
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import {
  ArrowRight,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger,AccordionContent } from "@/components/ui/accordion";


export default function Home() {
  return (
    <div>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 ">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Title */}
          <h2
            className="text-3xl font-extrabold tracking-tight text-center mb-3 
                       bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight"
          >
            Unlock the Tools That Drive Your Career Forward
          </h2>

          {/* Optional Subtitle */}
          <p className="text-center text-cyan-200/70 max-w-xl mx-auto mb-12 text-sm md:text-base">
            Discover everything you need to stand out in today’s competitive job market.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={index}
                  className="bg-[#111827] border border-cyan-500/20 hover:border-cyan-400/50 
                             hover:shadow-cyan-400/20 transition duration-300 rounded-2xl"
                >
                  <CardContent className="pt-6 text-center flex flex-col items-center space-y-3">
                    <div className="flex flex-col items-center justify-center">
                      {/* Feature Icon */}
                      <Icon className="w-10 h-10 mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />

                      {/* Feature Title */}
                      <h3 className="text-lg font-semibold text-cyan-100">{feature.title}</h3>

                      {/* Feature Description */}
                      <p className="text-cyan-200/70 text-sm">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
<section className="w-full py-12 md:py-24 ">
  <div className="container mx-auto px-4 md:px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
      
      {/* Stat Item */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
          50+
        </h3>
        <p className="text-cyan-100/80 text-sm">Industries Covered</p>
      </div>

      {/* Stat Item */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
          1000+
        </h3>
        <p className="text-cyan-100/80 text-sm">Interview Questions</p>
      </div>

      {/* Stat Item */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
          95%
        </h3>
        <p className="text-cyan-100/80 text-sm">Success Rate</p>
      </div>

      {/* Stat Item */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
          24/7
        </h3>
        <p className="text-cyan-100/80 text-sm">AI Support</p>
      </div>

    </div>
  </div>
</section>

{/* How It Works Section */}
<section className="w-full py-12 md:py-24 ">
  <div className="container mx-auto px-4 md:px-6">
    
    {/* Section Header */}
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h2 className="text-3xl font-extrabold tracking-tight 
                     bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                     bg-clip-text text-transparent animate-gradient-slow mb-4">
        How It Works
      </h2>
      <p className="text-cyan-200/80 text-sm md:text-base">
        Four simple steps to accelerate your career growth
      </p>
    </div>

    {/* Steps Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
      {howItWorks.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center space-y-4 px-4"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center shadow-inner">
            {React.cloneElement(item.icon, {
              className: "w-8 h-8 text-cyan-300",
            })}
          </div>
          <h3 className="font-semibold text-cyan-100 text-lg">{item.title}</h3>
          <p className="text-cyan-200/70 text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>



{/* FAQ Section */}
<section className="w-full py-12 md:py-24 ">
  <div className="container mx-auto px-4 md:px-6">
    <div className="text-center max-w-3xl mx-auto mb-12">
      <h2 className="text-3xl font-extrabold tracking-tight 
                     bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                     bg-clip-text text-transparent animate-gradient-slow mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-cyan-200/70 text-sm md:text-base">
        Find answers to the most common questions about using our platform effectively.
      </p>
    </div>

    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-cyan-100 hover:text-cyan-300 transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-cyan-200/80">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
</section>

{/* CTA Section */}
<section className="w-full ">
  <div className="mx-auto py-24 gradient rounded-lg px-4 md:px-0">
    <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold tracking-tight 
                     bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                     bg-clip-text text-transparent animate-gradient-slow sm:text-4xl md:text-5xl">
        Supercharge Your Job Search with AI
      </h2>
      <p className="mx-auto max-w-[600px] text-cyan-200/80 md:text-xl">
        Get personalized interview prep, salary insights, and resume analysis — all in one place.
      </p>
      <Link href="/dashboard" passHref>
<Button
  size="lg"
  className="h-11 mt-5 px-8 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:brightness-110 transition animate-bounce rounded-2xl"
>
  Start Free – No Signup Needed
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>



      </Link>
    </div>
  </div>
</section>


    </div>
  );
}
