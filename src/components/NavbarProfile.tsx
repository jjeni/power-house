import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "@/lib/firebase";

import { X } from "lucide-react";

type NavbarProfileProps = {
  user: any;
  onLogin: () => void;
};

export default function NavbarProfile({ user, onLogin }: NavbarProfileProps) {
  if (!user) {
    return (
      <Button
        onClick={onLogin}
        className="px-4 py-2 text-white shadow-lg hover:scale-105 transition glass-dark"
      >
        Sign In
      </Button>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      // You can also refresh state or call a prop function to update the UI
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sheet>
      
      <SheetTrigger asChild>
        <button className="w-9 h-9 rounded-full glass-dark flex items-center justify-center text-white border border-white/20 hover:scale-105 transition">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            user.displayName?.charAt(0) || "U"
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="glass-dark border-l border-white/20 w-64">
        <SheetHeader >
          <SheetTitle className="text-white pt-10">
            {user.displayName || "User"}
          </SheetTitle>
          
          <p className="text-xs text-gray-300">{user.email}</p>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-3 text-white">
          <button className="text-left hover:text-primary">My Account</button>
          <button className="text-left hover:text-primary">My Posts</button>
          <hr className="border-white/20" />
          <button className="text-left hover:text-red-400" onClick={handleLogout} >Logout</button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
