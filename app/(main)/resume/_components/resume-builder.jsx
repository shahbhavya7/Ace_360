"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import useFetch from "@/hooks/use-fetch";
import { PencilLine, FileText } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";

export default function ResumeBuilder({ initialContent }) {
  // initialContent is the resume content passed from the server
  const [activeTab, setActiveTab] = useState("edit"); // State to manage the active tab , initially set to "edit" to show the form first
  const [previewContent, setPreviewContent] = useState(initialContent); // State to manage the preview content, initially set to initialContent passed
  // from the server but can be updated based on form values in edit mode
  const { user } = useUser(); // Get the user object from Clerk, which contains user information like fullName for the resume header
  const [resumeMode, setResumeMode] = useState("preview");

  const {
    // after using passing setting react hook form our own way we extract the methods we need from it like control, register, handleSubmit, watch
    // and errors which they provide us using our own custom schema resumeSchema
    control,
    register,
    handleSubmit,
    watch, // watch is returned by useForm and allows us to subscribe to form value changes
    formState: { errors },
  } = useForm({
    // passing our custom schema to the form using zodResolver so that our custom form connects to react-hook-form
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      // default values for the form fields, if initialContent is provided, we set the previewContent to it in react-hook-form
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    // passing saveResume fn to useFetch api which makes our function more user-friendly and handles loading, error, and data states and also returns
    // data received from the server after saving the resume i.e after calling saveResume function. Our saveResume function is modified to saveResumeFn
    // for more feature-rich functionality like loading, error handling, and data management
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields in edit mode for updates , this allows us to simultaneously update preview tab also
  const formValues = watch(); // watches also gives us the current form values.

  useEffect(() => {
    // this effect runs when their is already initialContent exists, meaning the user is editing an existing resume
    // so we by default set the active tab to "preview" so that user can see the preview of the resume
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change or active tab changes
  // This effect updates the preview content whenever the form values change or the active tab is switched to "edit"
  useEffect(() => {
    if (activeTab === "edit") {
      // If the active tab is "edit", we update the preview content based on the current form values
      const newContent = getCombinedContent(); // to update we call getCombinedContent function which combines all the form values into a markdown string
      setPreviewContent(newContent ? newContent : initialContent); // If newContent is empty, we fallback to initialContent
    }
  }, [formValues, activeTab]); // we run this effect whenever formValues or activeTab changes

  // Handle save result
  useEffect(() => {
    // This effect runs when saveResult or saveError changes
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    // Generate markdown for contact information section
    const { contactInfo } = formValues; // Extract contact information from form values
    const parts = []; // Initialize an array to hold contact information parts
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`); // If email exists, add it to the parts array with formatting
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`); // If mobile exists, add it to the parts array with formatting
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`); // If LinkedIn exists, add it to the parts array with formatting
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`); // If Twitter exists, add it to the parts array with formatting

    return parts.length > 0 // If there are any contact information parts then create a div with the user's full name and contact information
      ? // centered in the markdown format and the contact information parts are joined with a pipe separator and whole section is wrapped in a markdown div
        // else return an empty string
        `## <div align="center">${user.fullName}</div> 
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    // Combine all sections into a single markdown string
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(), // Get contact information markdown
      summary && `## Professional Summary\n\n${summary}`, // Add summary if it exists
      skills && `## Skills\n\n${skills}`, // Add skills if it exists
      entriesToMarkdown(experience, "Work Experience"), // Convert experience entries to markdown
      entriesToMarkdown(education, "Education"), // Convert education entries to markdown
      entriesToMarkdown(projects, "Projects"), // Convert projects entries to markdown
    ]
      .filter(Boolean) // Filter out any empty sections
      .join("\n\n"); // Join all sections with double newlines
  };

  const [isGenerating, setIsGenerating] = useState(false); // State to manage PDF generation status , if true, it indicates that PDF generation is in progress

  const generatePDF = async () => {
    setIsGenerating(true); // Set generating state to true to indicate PDF generation is in progress
    try {
      const element = document.getElementById("resume-pdf");
      if (!element) throw new Error("Resume DOM not found");

      // Temporarily force it visible
      element.style.visibility = "visible";
      element.style.position = "absolute";
      element.style.left = "-9999px";

      await new Promise((res) => setTimeout(res, 300));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false); // Reset generating state to false after PDF generation is complete
    }
  };
  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent // Get the current preview content from the state and format it
        .replace(/\n/g, "\n") // Normalize newlines as needed
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="space-y-4" data-color-mode="light">
      <div className="flex flex-col items-center justify-center text-center gap-2 mt-4">
        <h1 className="font-bold text-5xl md:text-6xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent animate-gradient-slow">
          Resume Builder
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* we can switch between the form and the preview using the tabs and based that we can show different content
        i.e editor or preview */}
        {/* whenever active tab changes it is catched by the effect hook which updates the preview content */}
        {/* Centered TabsList with margin below */}
        <div className="w-full flex justify-center mt-6 mb-4">
          <TabsList className="border border-cyan-500/20 rounded-lg px-4 py-2 flex gap-2 shadow-md shadow-cyan-500/10 bg-[#0f172a]">
            <TabsTrigger
              value="edit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
        text-cyan-300 hover:text-cyan-100 data-[state=active]:bg-gradient-to-r 
        data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 
        data-[state=active]:text-white"
            >
              <PencilLine className="h-4 w-4" />
              Form
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
        text-cyan-300 hover:text-cyan-100 data-[state=active]:bg-gradient-to-r 
        data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 
        data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4" />
              Markdown
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit">
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <form className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#0f172a] p-6 shadow shadow-cyan-500/10">
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-200">
                      Email
                    </label>
                    <Input // / Input component is a custom input component (from shadcn) which is used to render the input fields
                      // and controls the validation errors using the error prop from react-hook-form
                      {...register("contactInfo.email")} // contactInfo obj comes from the resumeSchema and we are using register to connect the shadcn input field
                      // email to react-hook-form's email field i.e use contactInfo.email from the resumeSchema to connect the input field to the form
                      // so that we can validate the email field using zod schema
                      type="email"
                      placeholder="your@email.com"
                      className="bg-[#0f172a] border border-cyan-500/20 text-cyan-100"
                    />
                    {errors.contactInfo?.email && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.email.message}
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-200">
                      Mobile Number
                    </label>
                    <Input
                      {...register("contactInfo.mobile")}
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="bg-[#0f172a] border border-cyan-500/20 text-cyan-100"
                    />
                    {errors.contactInfo?.mobile && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.mobile.message}
                      </p>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-200">
                      LinkedIn URL
                    </label>
                    <Input
                      {...register("contactInfo.linkedin")}
                      type="url"
                      placeholder="https://linkedin.com/in/your-profile"
                      className="bg-[#0f172a] border border-cyan-500/20 text-cyan-100"
                    />
                    {errors.contactInfo?.linkedin && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.linkedin.message}
                      </p>
                    )}
                  </div>

                  {/* Twitter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cyan-200">
                      Twitter/X Profile
                    </label>
                    <Input
                      {...register("contactInfo.twitter")}
                      type="url"
                      placeholder="https://twitter.com/your-handle"
                      className="bg-[#0f172a] border border-cyan-500/20 text-cyan-100"
                    />
                    {errors.contactInfo?.twitter && (
                      <p className="text-sm text-red-500">
                        {errors.contactInfo.twitter.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#0f172a] p-6 shadow shadow-cyan-500/10">
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  Professional Summary
                </h3>
                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="h-32 bg-[#0f172a] border border-cyan-500/20 text-cyan-100"
                      placeholder="Write a compelling professional summary..."
                    />
                  )}
                />
                {errors.summary && (
                  <p className="text-sm text-red-500">
                    {errors.summary.message}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#0f172a] p-6 shadow shadow-cyan-500/10">
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  Skills
                </h3>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="h-32 bg-[#0f172a] border border-cyan-500/20 text-cyan-100"
                      placeholder="List your key skills..."
                    />
                  )}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">
                    {errors.skills.message}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#0f172a] p-6 shadow shadow-cyan-500/10">
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  Work Experience
                </h3>
                <Controller
                  name="experience"
                  control={control}
                  render={(
                    { field } // render prop is used to render the EntryForm component with the current entries and current properties like onChange
                  ) => (
                    // onChange is used to update the entries when user adds or removes an entry
                    <EntryForm
                      type="Experience"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              {/* Education */}
              <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#0f172a] p-6 shadow shadow-cyan-500/10">
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  Education
                </h3>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Education"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.education && (
                  <p className="text-sm text-red-500">
                    {errors.education.message}
                  </p>
                )}
              </div>

              {/* Projects */}
              <div className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#0f172a] p-6 shadow shadow-cyan-500/10">
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  Projects
                </h3>
                <Controller
                  name="projects"
                  control={control}
                  render={({ field }) => (
                    <EntryForm
                      type="Project"
                      entries={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.projects && (
                  <p className="text-sm text-red-500">
                    {errors.projects.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2 flex items-center gap-2 hover:no-underline"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4 text-cyan-400" />
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent animate-gradient-slow">
                    Edit Resume
                  </span>
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4 text-cyan-400" />
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent animate-gradient-slow">
                    Show Preview
                  </span>
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg" data-color-mode="dark">
            <MDEditor // shows the markdown editor with the preview content
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
              theme="dark"
            />
          </div>
          <div
            id="resume-pdf"
            style={{
              visibility: "hidden", // keeps layout but invisible
              position: "absolute",
              left: "-9999px",
              background: "white",
              color: "black",
              width: "794px",
              padding: "24px",
            }}
            className="prose prose-sm leading-relaxed print-resume"
          >
            <MDEditor.Markdown source={previewContent} />
          </div>
           <div className="flex justify-center mt-10 space-x-4">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="bg-[#0f172a] text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950 hover:text-white shadow shadow-cyan-500/20 transition"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Resume
            </>
          )}
        </Button>

        <Button
          onClick={generatePDF}
          disabled={isGenerating}
          className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-white font-medium hover:opacity-90 shadow-lg transition"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
      </div>
        </TabsContent>
      </Tabs>
     
    </div>
  );
}
