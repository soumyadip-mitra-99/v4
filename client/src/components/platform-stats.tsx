import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { PlatformStats } from "@shared/schema";

export function PlatformStatsSection() {
  const { data: stats, isLoading } = useQuery<PlatformStats>({
    queryKey: ["/api/stats/platform"],
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.current) {
          entry.target.classList.add('visible');
          
          // Trigger counter animation for stat numbers
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach((element: any) => {
            animateCounter(element);
          });
          
          hasAnimated.current = true;
        }
      });
    }, observerOptions);

    const section = document.querySelector('.stats-section');
    if (section) {
      observerRef.current.observe(section);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const animateCounter = (element: HTMLElement) => {
    const target = parseInt(element.getAttribute('data-target') || '0');
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime: number) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(target * easeOutCubic);
      
      element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  };

  if (isLoading) {
    return (
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="skeleton h-12 w-96 mx-auto mb-4 rounded-lg" />
            <div className="skeleton h-6 w-64 mx-auto rounded-lg" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-strong p-8 rounded-2xl">
                <div className="skeleton h-12 w-20 mx-auto mb-4 rounded-lg" />
                <div className="skeleton h-4 w-32 mx-auto mb-2 rounded-lg" />
                <div className="skeleton h-3 w-24 mx-auto rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const foodSaved = parseFloat(stats?.totalFoodSaved || "0");
  const carbonSaved = parseFloat(stats?.totalCarbonSaved || "0");

  return (
    <section id="impact" className="relative py-20 px-6 stats-section animate-on-scroll">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Platform Impact</h2>
          <p className="text-xl text-muted-foreground">Real-time environmental impact powered by our AI analytics</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="glass-strong p-8 rounded-2xl text-center hover:bg-surface-light transition-all">
            <div className="text-4xl font-bold text-primary mb-2 stat-number" data-target={Math.floor(foodSaved)}>0</div>
            <div className="text-sm text-muted-foreground mb-1">kg Food Saved</div>
            <div className="flex items-center justify-center text-xs text-green-400">
              <span className="mr-1">↗</span>
              <span>Growing daily</span>
            </div>
          </div>
          
          <div className="glass-strong p-8 rounded-2xl text-center hover:bg-surface-light transition-all">
            <div className="text-4xl font-bold text-blue-400 mb-2 stat-number" data-target={Math.floor(carbonSaved)}>0</div>
            <div className="text-sm text-muted-foreground mb-1">kg CO₂ Prevented</div>
            <div className="flex items-center justify-center text-xs text-green-400">
              <span className="mr-1">↗</span>
              <span>Carbon impact</span>
            </div>
          </div>
          
          <div className="glass-strong p-8 rounded-2xl text-center hover:bg-surface-light transition-all">
            <div className="text-4xl font-bold text-accent mb-2 stat-number" data-target={stats?.totalPeopleServed || 0}>0</div>
            <div className="text-sm text-gray-400 mb-1">People Served</div>
            <div className="flex items-center justify-center text-xs text-green-400">
              <span className="mr-1">↗</span>
              <span>Community fed</span>
            </div>
          </div>
          
          <div className="glass-strong p-8 rounded-2xl text-center hover:bg-surface-light transition-all">
            <div className="text-4xl font-bold text-purple-400 mb-2 stat-number" data-target={stats?.activeListings || 0}>0</div>
            <div className="text-sm text-gray-400 mb-1">Active Listings</div>
            <div className="flex items-center justify-center text-xs text-green-400">
              <span className="mr-1">↗</span>
              <span>Available now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
