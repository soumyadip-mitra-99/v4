import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const { user, isAuthenticated, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="relative z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
              <span className="text-xl font-bold">EcoShare</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && (
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
            <button 
              onClick={() => {
                document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => {
                document.querySelector('#impact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Impact
            </button>
            <button 
              onClick={() => {
                document.querySelector('#algorithm-details')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Algorithm
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {!isAuthenticated ? (
              <Button onClick={loginWithGoogle} className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 animate-pulse-glow">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M12 0C5.27 0 0 5.27 0 12s5.27 12 12 12c6.73 0 12-5.27 12-12S18.73 0 12 0z"/>
                </svg>
                <span>Sign In with Google</span>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePicture || undefined} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-strong border-border" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <span className="w-full cursor-pointer text-foreground hover:bg-surface">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-foreground hover:bg-surface">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      {/* RGB Light Bar - Google AI Style */}
      <div className="rgb-light-bar"></div>
    </nav>
  );
}
