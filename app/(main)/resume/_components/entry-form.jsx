
// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) { // entry-form component takes type (Experience, Education or Project), entries object
// (array of existing entries) and onChange (function to update the entries), onchange here is of main form component which will be passed down to this component
  const [isAdding, setIsAdding] = useState(false); // State to toggle the visibility of the form for adding a new entry
  // isAdding will be true when the user clicks on the Add Entry button and false when the user clicks on the Cancel button or after adding a new entry

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current"); // This will track if the entry is current or not i.e whether the user is currently working at this job

  const handleAdd = handleValidation((data) => { // This function will be called when the user clicks on the Add Entry button , it will call the 
    // handleValidation given by react-hook-form to validate the form data
    // if the data is valid then it will format the data making new object with formatted dates and then call the onChange function
    // onChange fn will take the current entries and add the new entry to it
    // and then reset the form and set isAdding to false
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]); // onchange fn does the actual work it updates the entries array with the new entry and takes it to main form component

    reset();
    setIsAdding(false);
  });

  const handleDelete = (index) => { // This function will be called when the user clicks on the delete button of an entry
    // It will filter out the entry at the given index and call the onChange function with the new entries array
    // onChange fn will take the current entries and remove the entry at the given index
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const { // This will call the improveWithAI function to improve the description using AI
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI); // we pass the improveWithAI function to the useFetch hook to handle the API call and state management
  // it modifies fn to improveWithAIFn which will be used to call the improveWithAI function
  // when the user clicks on the Improve with AI button , handleImproveDescription function will be called which will call the improveWithAIFn function with 
  // the current description and type of entry (Experience, Education or Project) , this improvedWithAIFn will indeed call the improveWithAI function inside the useFetch hook
  // with params passed down from it , then improveWithAI fn is called which will return the improved content or error if any then data returned is sent from ]
  // useFetch hook to improvedContent and error is sent to improveError which will be used to display improved content or error message respectively
  // during the API call isImproving will be true and once the API call is completed it will be false

  useEffect(() => { // This effect will be called when the improvedContent or improveError changes , when improve with AI is successful is running
    // if improvedContent is available and isImproving is false then it means the AI has successfully improved the description
    // so we will set the description field in the form to the improved content and show a success toast message
    // if there is an error then we will show an error toast message
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => { // This function will be called when the user clicks on the Improve with AI button
    // It will check if the description field is empty or not , if it is empty then then it will show an error toast message
    // if it is not empty then it will call the improveWithAIFn function with the current description and type of entry
    // type will be either Experience, Education or Project passed as prop to this component
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Existing Entries */}
      {entries.length > 0 && ( // Check if there are existing entries to display i.e if user has added any entries before
        <div className="space-y-4">
          {entries.map((item, index) => ( // Map through the entries and display each entry in a Card component
            // Each entry will have a title, organization, start date, end date, description and
            <Card
              key={index}
              className="border border-cyan-500/10 bg-[#0f172a] text-cyan-100"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-cyan-300">
                  {item.title} @ {item.organization}
                </CardTitle>
                <Button // Button to delete the entry
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="text-cyan-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {item.current
                    ? `${item.startDate} - Present`
                    : `${item.startDate} - ${item.endDate}`}
                </p>
                <p className="mt-2 text-sm text-white whitespace-pre-wrap">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Entry Form */}
      {isAdding && ( // if user is adding first entry then show form only if isAdding is true i.e when user clicks on Add Entry button
        <div className="space-y-4 border border-cyan-500/20 rounded-xl p-6 bg-[#0f172a] shadow shadow-cyan-500/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Title / Position"
                {...register("title")}
                error={errors.title}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Organization / Company"
                {...register("organization")}
                error={errors.organization}
              />
              {errors.organization && (
                <p className="text-sm text-red-500">{errors.organization.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">Start Date</label>
              <Input
                type="month"
                className="bg-[#0f172a] border border-cyan-500/20 text-cyan-100 placeholder:text-cyan-500"
                placeholder="Start Date"
                {...register("startDate")}
                error={errors.startDate}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-300">End Date</label>
              <Input
                type="month"
                className="bg-[#0f172a] border border-cyan-500/20 text-cyan-100 placeholder:text-cyan-500 disabled:opacity-50"
                placeholder="End Date"
                disabled={current} // Disable end date input if current checkbox is checked i.e user is currently working at this job
                {...register("endDate")}
                error={errors.endDate}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>


          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="current"
              {...register("current")}
              onChange={(e) => { // Handle checkbox change to set current status , if checked then set endDate to empty string
                // and if unchecked then allow user to enter end date
                // setValue is used to update the form state
                setValue("current", e.target.checked);
                if (e.target.checked) setValue("endDate", "");
              }}
            />
            <label htmlFor="current" className="text-cyan-300">
              Current {type}
            </label>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder={`Description of your ${type.toLowerCase()}`} // type will be either Experience, Education or Project passed as prop to this component
              className="h-32"
              {...register("description")}
              error={errors.description}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <Button // Button to improve the description using AI
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleImproveDescription} // This will call the improveWithAI function to improve the description
            disabled={isImproving || !watch("description")} // Disable button if improving i.e if fetch is in progress or if description is empty
            className="text-cyan-400 hover:text-white"
          >
            {isImproving ? ( // Show loading spinner and text if improving is in progress
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Improving...
              </>
            ) : ( // Show sparkles icon and text if not improving
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Improve with AI
              </>
            )}
          </Button>

          <div className="flex justify-end space-x-2">
            <Button // Cancel Button to reset the form and hide the add entry form
              type="button"
              variant="outline"
              className="border border-cyan-500/20 text-cyan-400 hover:text-white hover:bg-[#13203b]"
              onClick={() => {
                reset(); // Reset the form to default values
                setIsAdding(false); // Hide the add entry form
              }}
            >
              Cancel
            </Button>
            <Button type="button" // Button to add the entry
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400"
              onClick={handleAdd}> 
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry 
            </Button>
          </div>
        </div>
      )}

      {/* Add Button */}
      {!isAdding && ( // If not adding an entry, show the Add Entry button on the bottom
        // This button will toggle the isAdding state to true and show the form to add a new entry
        <Button
          className="w-full border border-cyan-500/20 bg-[#0f172a] text-cyan-300 hover:text-white hover:bg-[#0f1f2e]"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}
