import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { ViewportBorder } from "@/components/ui/viewport-border";
import { FoodListingCard } from "@/components/food-listing-card";
import { CreateListingDialog } from "@/components/create-listing-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { FoodListing, UserStats, Pickup } from "@shared/schema";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated]);

  const { data: foodListings = [], isLoading: listingsLoading } = useQuery<FoodListing[]>({
    queryKey: ["/api/food-listings"],
    enabled: isAuthenticated,
  });

  const { data: myListings = [] } = useQuery<FoodListing[]>({
    queryKey: ["/api/my-listings"],
    enabled: isAuthenticated,
  });

  const { data: myPickups = [] } = useQuery<Pickup[]>({
    queryKey: ["/api/my-pickups"], 
    enabled: isAuthenticated,
  });

  const { data: userStats } = useQuery<UserStats>({
    queryKey: ["/api/stats/user"],
    enabled: isAuthenticated,
  });

  const reserveFoodMutation = useMutation({
    mutationFn: (listingId: string) => 
      apiRequest("POST", "/api/pickups", { listingId }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Food reserved successfully! Check your pickups tab.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-pickups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/food-listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to reserve food: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleReserveFood = (listingId: string) => {
    reserveFoodMutation.mutate(listingId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ViewportBorder />
      <div className="relative z-10">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-300">
              Track your impact, share food, and connect with your community.
            </p>
          </div>

          {/* Stats Cards */}
          {userStats && (
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-strong border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Food Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {parseFloat(userStats.totalFoodSaved || "0").toFixed(1)}kg
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-strong border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">CO₂ Prevented</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {parseFloat(userStats.totalCarbonSaved || "0").toFixed(1)}kg
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-strong border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {userStats.totalListings}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-strong border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Pickups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {userStats.totalPickups}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="browse" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="glass border-border">
                <TabsTrigger value="browse" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Browse Food
                </TabsTrigger>
                <TabsTrigger value="my-listings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  My Listings ({myListings.length})
                </TabsTrigger>
                <TabsTrigger value="pickups" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  My Pickups ({myPickups.length})
                </TabsTrigger>
              </TabsList>
              
              <CreateListingDialog />
            </div>

            <TabsContent value="browse" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Available Food</h2>
                <p className="text-gray-300">{foodListings.length} items available</p>
              </div>
              
              {listingsLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-strong rounded-2xl p-6">
                      <div className="skeleton h-48 w-full mb-4 rounded-xl" />
                      <div className="skeleton h-6 w-3/4 mb-2 rounded" />
                      <div className="skeleton h-4 w-full mb-4 rounded" />
                      <div className="flex justify-between">
                        <div className="skeleton h-4 w-24 rounded" />
                        <div className="skeleton h-4 w-16 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foodListings.map((listing) => (
                    <FoodListingCard
                      key={listing.id}
                      listing={listing}
                      onReserve={handleReserveFood}
                      isLoading={reserveFoodMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

           <TabsContent value="my-listings" className="space-y-6">
  <h2 className="text-2xl font-bold text-white">My Food Listings</h2>
  
  {/* ✅ This is the corrected logic */}
  {myListings.length > 0 ? (
    // If there ARE listings, map over them and display them in a grid
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myListings.map((listing) => (
        <FoodListingCard
          key={listing.id}
          listing={listing}
        />
      ))}
    </div>
  ) : (
    // Otherwise (if there are NO listings), display the empty message
    <div className="col-span-full text-center py-12">
      <p className="text-gray-300 mb-4">You haven't created any listings yet.</p>
      <CreateListingDialog />
    </div>
  )}
</TabsContent>

            <TabsContent value="pickups" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">My Pickups</h2>
              
              <div className="space-y-4">
                {myPickups.map((pickup) => (
                  <Card key={pickup.id} className="glass-strong border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">Pickup #{pickup.id.slice(0, 8)}</h3>
                          <p className="text-sm text-gray-300">Reserved on {new Date(pickup.createdAt!).toLocaleDateString()}</p>
                        </div>
                        <Badge 
                          variant={pickup.status === "completed" ? "default" : "secondary"}
                          className={pickup.status === "completed" ? "bg-green-500" : "bg-yellow-500"}
                        >
                          {pickup.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {myPickups.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-300">No pickups yet. Start browsing available food!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
