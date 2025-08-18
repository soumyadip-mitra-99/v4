import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";

export function AuthHero() {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      {/* Parallax Background */}
      <div className="parallax-bg fixed inset-0 z-0" />
      
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* Floating Food Elements */}
          <div className="absolute -top-10 -left-10 food-emoji animate-float" style={{animationDelay: '0s'}}>🥗</div>
          <div className="absolute -top-5 -right-15 food-emoji animate-float" style={{animationDelay: '1s'}}>🍎</div>
          <div className="absolute -bottom-10 left-20 food-emoji animate-float" style={{animationDelay: '2s'}}>📦</div>
          <div className="absolute -bottom-5 right-10 food-emoji animate-float" style={{animationDelay: '3s'}}>📊</div>
          
          <div className="animate-on-scroll">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Save Planet.
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              AI-powered campus food sharing platform that connects communities, 
              reduces waste, and feeds everyone. Join the sustainability revolution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={loginWithGoogle}
                className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 min-w-[200px]"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                </svg>
                <span>Continue with Google</span>
              </Button>
            </div>
            
            {/* Key Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-20">
              <div className="glass p-8 rounded-2xl hover:bg-surface-light transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary">AI-Powered</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Smart categorization and freshness assessment</p>
              </div>
              
              <div className="glass p-8 rounded-2xl hover:bg-surface-light transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">Community Driven</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Connect campus food providers and recipients</p>
              </div>
              
              <div className="glass p-8 rounded-2xl hover:bg-surface-light transition-all transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-400">Impact Tracking</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Monitor your environmental contribution</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
