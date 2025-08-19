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

        {/* Algorithm & Technical Details Section */}
        <section id="algorithm-details" className="relative py-20 px-6">
          <ParallaxElement speed={0.1}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-on-scroll">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  <span className="gemini-badge">AI Algorithm</span> Details
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Discover how our advanced AI technology powers intelligent food sharing through sophisticated algorithms
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Left Column - Algorithm Steps */}
                <div className="space-y-8">
                  <ParallaxElement speed={0.08} className="glass-strong p-8 rounded-2xl animate-on-scroll hover:scale-105 transition-transform duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                        <span className="text-2xl">📸</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-foreground">Image Processing</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Google Gemini AI analyzes food images using advanced computer vision to identify food types, assess freshness levels, and estimate portion sizes with 95%+ accuracy.
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-medium">Real-time Processing</span>
                        </div>
                      </div>
                    </div>
                  </ParallaxElement>

                  <ParallaxElement speed={0.06} className="glass-strong p-8 rounded-2xl animate-on-scroll hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.1s'}}>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 animate-gradient-x">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-foreground">Smart Categorization</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Machine learning algorithms automatically classify food items into categories (meals, snacks, beverages, produce) and subcategories for efficient browsing.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Meals</span>
                          <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">Snacks</span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Beverages</span>
                        </div>
                      </div>
                    </div>
                  </ParallaxElement>

                  <ParallaxElement speed={0.04} className="glass-strong p-8 rounded-2xl animate-on-scroll hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 animate-float">
                        <span className="text-2xl">🌡️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-foreground">Freshness Assessment</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Multi-factor analysis including visual indicators, time stamps, and environmental conditions to provide safety recommendations.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Fresh (0-2 days)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Good (2-4 days)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Consume Soon (4+ days)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ParallaxElement>
                </div>

                {/* Right Column - Technical Flow */}
                <div className="space-y-8">
                  <ParallaxElement speed={0.05} className="glass-strong p-8 rounded-2xl animate-on-scroll hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.3s'}}>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 animate-parallax-float">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-foreground">Impact Calculation</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          Real-time carbon footprint reduction calculations based on food waste prevented, using EPA environmental impact data and lifecycle assessment methodologies.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center p-3 bg-green-500/10 rounded-lg">
                            <div className="text-lg font-bold text-green-400">2.3kg</div>
                            <div className="text-xs text-muted-foreground">CO₂ per kg food</div>
                          </div>
                          <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                            <div className="text-lg font-bold text-blue-400">95%</div>
                            <div className="text-xs text-muted-foreground">Accuracy rate</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ParallaxElement>

                  <ParallaxElement speed={0.07} className="glass-strong p-8 rounded-2xl animate-on-scroll hover:scale-105 transition-transform duration-300" style={{animationDelay: '0.4s'}}>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                        <span className="text-2xl">🔒</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-foreground">Privacy & Security</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          All data processing follows Google Cloud security standards with end-to-end encryption, ensuring user privacy while enabling community food sharing.
                        </p>
                        <div className="flex items-center space-x-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400">Encrypted</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-400">GDPR Compliant</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ParallaxElement>

                  {/* Algorithm Flow Visualization */}
                  <ParallaxElement speed={0.03} className="glass-strong p-8 rounded-2xl animate-on-scroll" style={{animationDelay: '0.5s'}}>
                    <h3 className="text-xl font-bold mb-6 text-center text-foreground">Processing Flow</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-white">1</div>
                        <div className="flex-1 h-2 bg-gradient-to-r from-primary to-blue-500 rounded-full animate-gradient-x"></div>
                        <span className="text-sm text-muted-foreground">Image Upload</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">2</div>
                        <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-gradient-x" style={{animationDelay: '0.5s'}}></div>
                        <span className="text-sm text-muted-foreground">AI Analysis</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">3</div>
                        <div className="flex-1 h-2 bg-gradient-to-r from-purple-500 to-green-500 rounded-full animate-gradient-x" style={{animationDelay: '1s'}}></div>
                        <span className="text-sm text-muted-foreground">Categorization</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold text-white">4</div>
                        <div className="flex-1 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-gradient-x" style={{animationDelay: '1.5s'}}></div>
                        <span className="text-sm text-muted-foreground">Results</span>
                      </div>
                    </div>
                  </ParallaxElement>
                </div>
              </div>

              {/* Bottom CTA Section */}
              <ParallaxElement speed={0.02} className="text-center animate-on-scroll" style={{animationDelay: '0.6s'}}>
                <div className="glass-strong p-12 rounded-3xl">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <span className="text-lg text-muted-foreground">Powered by</span>
                    <span className="gemini-badge text-2xl">Google Gemini AI</span>
                  </div>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Experience the future of sustainable food sharing with cutting-edge AI technology that makes every meal count towards a greener planet.
                  </p>
                </div>
              </ParallaxElement>
            </div>
          </ParallaxElement>
        </section>
      </div>
    </div>
  );
}