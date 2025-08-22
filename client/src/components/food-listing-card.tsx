import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { FoodListing } from "@shared/schema";

interface FoodListingCardProps {
  listing: FoodListing;
  onReserve?: (listingId: string) => void;
  isLoading?: boolean;
}

export function FoodListingCard({ listing, onReserve, isLoading }: FoodListingCardProps) {
  const getFreshnessColor = (level: string) => {
    switch (level) {
      case "fresh": return "bg-green-500";
      case "good": return "bg-yellow-500";
      case "consume_soon": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getFreshnessText = (level: string) => {
    switch (level) {
      case "fresh": return "Fresh";
      case "good": return "Good";
      case "consume_soon": return "Consume Soon";
      default: return "Unknown";
    }
  };

  return (
    <Card className="bg-grey-800/20 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-500 hover:shadow-lg hover:shadow-primary/10">
     {listing.imageUrl && (
  <img 
    src={listing.imageUrl} 
    alt={listing.title}
    className="w-full h-48 object-cover"
  />
)}      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-green">{listing.title}</h3>
          <Badge className={`${getFreshnessColor(listing.freshnessLevel)} text-white text-xs px-2 py-1 rounded-full border-0`}>
            {getFreshnessText(listing.freshnessLevel)}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-4">{listing.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">📍 {listing.location}</span>
          <span className="text-primary font-medium">{listing.portions} portions</span>
        </div>
      </CardContent>
      {onReserve && (
        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={() => onReserve(listing.id)}
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? "Reserving..." : "Reserve"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
