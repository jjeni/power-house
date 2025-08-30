import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Music", path: "/music" },
    { label: "Code", path: "/code" },
    { label: "Text", path: "/text" },
    { label: "Video", path: "/video" },
    { label: "Image", path: "/image" },
    { label: "AI Hub", path: "/hub" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              AI HUB 
            </span>
            <span className="font-normal text-sm bg-gradient-secondary mt-1 bg-clip-text text-transparent">Connecting Ideas with Artificial Intelligence</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "gradient" : "ghost"}
                  size="sm"
                  className="text-foreground transition-all duration-300"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;