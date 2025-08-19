import { Navigation } from "@/components/navigation";
import { AuthHero } from "@/components/auth-hero";
import { PlatformStatsSection } from "@/components/platform-stats";
import { ParallaxContainer, ParallaxElement } from "@/components/parallax-container";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="relative z-10">
        <Navigation />
        <ParallaxContainer speed={0.2}>
          <AuthHero />
        </ParallaxContainer>
        
        <ParallaxElement speed={0.1}>
          <PlatformStatsSection />
        </ParallaxElement>
        
        {/* AI Features Showcase */}
        <section id="features" className="relative py-20 px-6 bg-gradient-to-b from-transparent to-surface/20">
          <div className="max-w-6xl mx-auto">
            <ParallaxElement speed={0.15} className="text-center mb-16 animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                <span className="gemini-badge">Powered by Google Gemini AI</span>
              </h2>
              <p className="text-xl text-muted-foreground">Advanced AI capabilities that make food sharing smarter, safer, and more sustainable</p>
            </ParallaxElement>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-on-scroll">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Smart Food Categorization</h3>
                    <p className="text-muted-foreground leading-relaxed">AI automatically categorizes food items into meals, snacks, beverages, and more for better organization.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <span className="text-xl">🌡️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Freshness Assessment</h3>
                    <p className="text-muted-foreground leading-relaxed">Real-time freshness evaluation with safety recommendations and optimal consumption timeframes.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 animate-gradient-x">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Instant Processing</h3>
                    <p className="text-muted-foreground leading-relaxed">Lightning-fast analysis of food images with immediate categorization and safety insights.</p>
                  </div>
                </div>
              </div>
              
              {/* AI Analysis Preview Card */}
              <ParallaxElement speed={0.08} className="glass-strong rounded-2xl p-6 animate-on-scroll">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">AI Analysis Preview</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">Live Processing</span>
                  </div>
                </div>
                
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Homemade vegetable lasagna" 
                  className="w-full h-48 object-cover rounded-xl mb-4" 
                />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium">Homemade Vegetable Lasagna</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Fresh</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="mb-2"><strong>Category:</strong> Main Course • Italian</div>
                    <div className="mb-2"><strong>Portions:</strong> 6-8 servings</div>
                    <div className="mb-2"><strong>Best By:</strong> Within 2 days (refrigerated)</div>
                    <div><strong>Safety:</strong> ✅ Safe for consumption</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">Analyzed by Gemini AI</div>
                    <div className="text-xs text-primary font-medium">95% Confidence</div>
                  </div>
                </div>
              </ParallaxElement>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-20 px-6">
          <ParallaxElement speed={0.1}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-on-scroll">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">How EcoShare Works</h2>
                <p className="text-xl text-muted-foreground">Simple, secure, and sustainable food sharing in just three steps</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center animate-on-scroll">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary to-green-400 rounded-2xl flex items-center justify-center mx-auto animate-float">
                      <span className="text-3xl">📱</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-accent-foreground">1</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">List Surplus Food</h3>
                  <p className="text-muted-foreground leading-relaxed">Snap a photo of your surplus food. Our AI automatically categorizes and assesses freshness for safe sharing.</p>
                </div>
                
                <div className="text-center animate-on-scroll" style={{animationDelay: '0.2s'}}>
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto animate-float" style={{animationDelay: '1s'}}>
                      <span className="text-3xl">🔍</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-accent-foreground">2</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Browse & Reserve</h3>
                  <p className="text-muted-foreground leading-relaxed">Discover available food near you. Filter by category, location, and freshness. Reserve items with one tap.</p>
                </div>
                
                <div className="text-center animate-on-scroll" style={{animationDelay: '0.4s'}}>
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto animate-float" style={{animationDelay: '2s'}}>
                      <span className="text-3xl">🤝</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-accent-foreground">3</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Pickup & Impact</h3>
                  <p className="text-muted-foreground leading-relaxed">Coordinate pickup with providers. Track your environmental impact and contribution to campus sustainability.</p>
                </div>
              </div>
            </div>
          </ParallaxElement>
        </section>

        {/* Footer */}
        <footer className="relative py-16 px-6 bg-surface/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="animate-on-scroll">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center">
                    <span className="text-xl">🌱</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">EcoShare</span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Connecting campus communities through sustainable food sharing powered by AI.
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-muted-foreground">Powered by</span>
                  <div className="flex items-center space-x-2">
                    <span className="gemini-badge text-sm">Google Gemini AI</span>
                  </div>
                </div>
              </div>
              
              <div className="animate-on-scroll">
                <h3 className="text-lg font-semibold text-foreground mb-4">Platform</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Safety Guidelines</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Community Rules</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Impact Reports</a></li>
                </ul>
              </div>
              
              <div className="animate-on-scroll">
                <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Report Issue</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Feedback</a></li>
                </ul>
              </div>
              
              <div className="animate-on-scroll">
                <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Accessibility</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border pt-8 animate-on-scroll">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  © 2024 EcoShare. All rights reserved.
                </p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <span className="text-xs text-muted-foreground">Made with ❤️ for sustainable communities</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}