"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {toast} from "sonner"
const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto text-center px-4">
          <h1
            className="text-5xl font-extrabold md:text-6xl lg:text-7xl xl:text-8xl 
                 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 
                 bg-clip-text text-transparent animate-gradient-slow leading-tight"
          >
            Your AI Mentor for
            <br />
            Achieving Career Growth
          </h1>
          <p className="mx-auto max-w-[620px] text-blue-200 md:text-lg">
            Get expert support to land your dream role—AI-led coaching, smart
            tools, and tailored job strategies.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:brightness-110 transition"
            >
              Get Started
            </Button>
          </Link>
          <Button
            size="lg"
            onClick={() => toast.warning("Coming soon!")}
            className="px-8 bg-[#0f172a] text-cyan-300 border border-cyan-500 hover:bg-cyan-900/40 transition"
          >
            Watch Demo
          </Button>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner2.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
