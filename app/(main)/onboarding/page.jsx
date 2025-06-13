import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import { getUserOnboardingStatus } from "@/actions/user";
import OnboardingForm from "./_components/onboarding-forms";

export default async function OnboardingPage() {
  // Check if user is already onboarded
  const { isOnboarded } = await getUserOnboardingStatus(); // it retrives variable isOnboarded from getUserOnboardingStatus function
  // that variable isOnboarded is true if user is already onboarded

  if (isOnboarded) { // if user is already onboarded
    redirect("/dashboard");
  }

  return ( // if user is not onboarded then show the onboarding form and pass the industries recieved from default industries
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
}