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

const createListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["meal", "snack", "beverage", "dessert", "produce", "baked_goods"]),
  portions: z.number().min(1, "At least 1 portion required"),
  location: z.string().min(1, "Location is required"),
  availableUntil: z.string().min(1, "Availability time is required"),
  freshnessLevel: z.enum(["fresh", "good", "consume_soon"]),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

export function CreateListingDialog() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const createListingMutation = useMutation({
    mutationFn: async (data: CreateListingForm) => {
      const formData = new FormData();
      
      // Convert availableUntil to proper ISO string
      const availableUntil = new Date(data.availableUntil).toISOString();
      
      formData.append("data", JSON.stringify({
        ...data,
        availableUntil,
      }));
      
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await fetch("/api/food-listings", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
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
      setSelectedFile(null);
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
    createListingMutation.mutate(data);
  };

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
                      className="bg-surface border-border text-white"
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
                      className="bg-surface border-border text-white"
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
                        className="bg-surface border-border text-white"
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
                        className="bg-surface border-border text-white"
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

            <div>
              <FormLabel className="text-white">Photo (Optional)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="mt-2 bg-surface border-border text-white file:bg-surface file:text-white file:border-0"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 border-border text-white hover:bg-surface"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createListingMutation.isPending}
                className="flex-1 btn-primary"
              >
                {createListingMutation.isPending ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
