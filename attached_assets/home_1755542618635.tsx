import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { FoodListingsGrid } from "@/components/food-listings-grid";
import { CreateListingModal } from "@/components/create-listing-modal";
import { UserDashboard } from "@/components/user-dashboard";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!isAuthenticated) {
    return null; // Will be redirected by App component
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onCreateListing={() => setIsCreateModalOpen(true)} />
      <HeroSection />
      <FoodListingsGrid />
      <UserDashboard />
      <Footer />
      
      <CreateListingModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
