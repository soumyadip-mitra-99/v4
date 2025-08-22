import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Brain } from "lucide-react";
const createListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["meal", "snack", "beverage", "dessert", "produce", "baked_goods"]),
  portions: z.coerce.number().min(1, "At least 1 portion required"), // Coerce to number
  location: z.string().min(1, "Location is required"),
  availableUntil: z.string().min(1, "Availability time is required"), // Keep as string for form input
  freshnessLevel: z.enum(["fresh", "good", "consume_soon"]),
  image: z.instanceof(FileList).optional(),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

export function CreateListingDialog() {
  const [open, setOpen] = useState(false);
//  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "meal",
      portions: 1,
      location: "",
      availableUntil: "",
      freshnessLevel: "fresh",
    },
  });

  /*
   * Parses a custom "DD.M.YYYY HH:mm" string into a valid Date object.
   * @param dateTimeString The string to parse, e.g., "22.8.2025 18:30"
   * @returns A Date object, or null if the format is invalid.
   */
  const parseCustomDateTime = (dateTimeString: string): Date | null => {
    try {
    const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } catch (error) {
      console.error("Failed to parse custom date string:", error);
      return null;
    }
  };
   // ✅ 1. Add a new mutation specifically for AI analysis
   // Add this new mutation inside your CreateListingDialog component
const analyzeImageMutation = useMutation({
  mutationFn: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/analyze-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Analysis failed");
    }
    return response.json();
  },
  onSuccess: (data) => {
    // This auto-fills the form with the AI's response
    form.reset({
      title: data.title,
      description: data.description,
      category: data.category,
      portions: data.portions,
      freshnessLevel: data.freshnessLevel,
      // Keep the user's previously entered data for other fields
      location: form.getValues("location"), 
      availableUntil: form.getValues("availableUntil"),
    });
    toast({ title: "Success", description: "Form auto-filled with AI analysis." });
  },
  onError: () => {
    toast({ title: "Error", description: "AI analysis failed.", variant: "destructive" });
  }
});

// Also add a state to hold the selected file
const [selectedFile, setSelectedFile] = useState<File | null>(null);



  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingForm) => {
      // 1. Use the robust parsing function on the form's string data

      const availableUntilDate = parseCustomDateTime(data.availableUntil);

      // 2. Handle invalid date formats gracefully
      if (!availableUntilDate) {
        throw new Error("Invalid date format. Please use DD.MM.YYYY HH:mm.");
      }

      const formData = new FormData();
      
      // 3. Convert the valid Date object to a universal ISO string for the backend
      const availableUntilISOString = availableUntilDate.toISOString();
      
      formData.append("data", JSON.stringify({
        ...data,
        availableUntil: availableUntilISOString, // Send the standardized string
      }));



      // Get the file from the 'data' object passed into the function
const imageFile = data.image? data.image[0] : null;

// If a file was selected, add it to the form data
if (imageFile) {
  formData.append("image", imageFile);
}
      
      
      const response = await fetch("/api/food-listings", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Food listing created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/food-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-listings"] });
      setOpen(false);
      form.reset();
      
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create listing: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateListingForm) => {
    const formattedData = {
    ...data,
      availableUntil: new Date(data.availableUntil).toISOString(),
  };

    createListingMutation.mutate(data);
  };

  // ... The JSX for the component would start here ...


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-primary px-6 py-2 rounded-lg font-medium">
          + Add Listing
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-strong border-border max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Create Food Listing</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-surface border-border text-black"
                      placeholder="e.g., Fresh Garden Salad"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-surface border-border text-black"
                      placeholder="Describe your food..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-surface border-border text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-strong border-border">
                        <SelectItem value="meal">Meal</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                        <SelectItem value="beverage">Beverage</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="produce">Produce</SelectItem>
                        <SelectItem value="baked_goods">Baked Goods</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Portions</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        min="1"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="bg-surface border-border text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Location</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-surface border-border text-white"
                      placeholder="e.g., Student Center, Room 201"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="availableUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Available Until</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="datetime-local"
                        className="bg-surface border-border text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="freshnessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Freshness</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-surface border-border text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-strong border-border">
                        <SelectItem value="fresh">Fresh</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="consume_soon">Consume Soon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Input */}
            <div>
              <FormLabel className="text-white">Photo (Optional)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                {...form.register("image")}
                onChange={(e) => {
                  form.register("image").onChange(e);
                  setSelectedFile(e.target.files?.[0] || null);
                }}
                className="mt-2 bg-surface border-border text-white"
              />
            </div>

            {/* AI Button */}
            {selectedFile && (
              <Button
                type="button"
                onClick={() => analyzeImageMutation.mutate(selectedFile)}
                disabled={analyzeImageMutation.isPending}
                className="w-full flex items-center gap-2"
              >
                {analyzeImageMutation.isPending ? "Analyzing..." : (
                  <>
                    <Brain className="w-4 h-4" />
                    Auto-fill with AI
                  </>
                )}
              </Button>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={createListingMutation.isPending} className="flex-1">
                {createListingMutation.isPending ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}











