import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ContributorAvatars } from "./ContributorAvatars";

interface ProjectCardProps {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  contributors: string[];
}

export const ProjectCard = ({ title, description, path, icon, contributors }: ProjectCardProps) => {
  return (
    <div className="group relative glass-dark rounded-xl p-4  hover:shadow-glow transition-all duration-1050 hover:scale-105 animate-float border border-white/20">
      
      <div className="relative z-10">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-lg mb-4 animate-glow">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{description}</p>
        
        <ContributorAvatars contributors={contributors} />
        
        <Link to={path} className="block mt-4 ">
          <Button variant="gradient" className="w-full">
            View
          </Button>
        </Link>
      </div>
    </div>
  );
};