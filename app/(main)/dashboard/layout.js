import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-extrabold tracking-tight mb-3 
                       bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight">Industry Insights</h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
