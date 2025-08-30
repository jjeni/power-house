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

import { X, LayoutDashboard, CircleUser, Rss, LogOut } from "lucide-react";
import HubPage from "@/pages/Hub";
import { Link } from "react-router-dom";

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

      <SheetContent
        side="right"
        className="glass-dark border-l border-white/20 w-64 flex flex-col h-screen"
      >
        <SheetHeader>
          <div className="text-white pt-10 m-full ">
            <img
              src={user.photoURL}
              alt="profile"
              className="mb-5 w-9 h-9 rounded-full object-cover align-center inline-block "
            />
            <div className="inline-block ">
              <p className="text-left ml-2">{user.displayName || "User"}</p>
              <p className="text-xs text-gray-300 ml-2">{user.email}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-col text-white h-screen">
          {/* Navigation Links */}
          <div className="flex flex-col gap-5">
            <Link
              to="/"
              className="text-left  hover:text-primary flex items-center"
            >
              <LayoutDashboard className="w-4 mr-2" />
              Dashboard
            </Link>

            <Link
              to="/"
              className=" text-gray-700 text-left hover:text-primary flex items-center"
            >
              <CircleUser className="w-4 mr-2" />
              My Account
            </Link>

            <Link
              to="/"
              className="text-gray-700  text-left hover:text-primary flex items-center"
            >
              <Rss className="w-4 mr-2" />
              My Posts
            </Link>

            <hr className="border-white/20" />
          </div>

          {/* Logout at bottom */}
          <div className="mt-4 mb-4 ">
            <button
              className="text-left flex items-center hover:text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
