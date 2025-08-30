import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Compass } from "lucide-react";

const FlippingButton = () => {
  const [showCreate, setShowCreate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCreate((prev) => !prev);
    }, 2000); // flip every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block w-28">
      {showCreate ? (
        <Button className="h-6  px-4 py-4 text-white transition-all duration-500">
          <Plus className="mr-1 h-4 w-4" /> Create
        </Button>
      ) : (
        <Button className="h-6  px-4 py-4 text-white transition-all duration-500">
          <Compass className="mr-1 h-4 w-4" /> Explore
        </Button>
      )}
    </span>
  );
};

export default FlippingButton;
