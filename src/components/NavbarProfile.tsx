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

import {
  Mail,
  LayoutDashboard,
  CircleUser,
  Rss,
  LogOut,
  Bug,
} from "lucide-react";
import HubPage from "@/pages/Hub";
import { Link } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
              alt={user.displayName || "profile"}
              referrerPolicy="no-referrer" // <-- prevents Google blocking image
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                // fallback if photoURL is broken
                e.currentTarget.style.display = "none";
                e.currentTarget.insertAdjacentHTML(
                  "afterend",
                  `<span class='w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold'>
            ${user.displayName?.charAt(0).toUpperCase() || "?"}
          </span>`
                );
              }}
            />
          ) : (
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
              {user.displayName?.charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="glass-dark border-l border-white/20 flex flex-col h-screen"
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

            <Link to="/" className=" text-gray-700 text-left flex items-center">
              <CircleUser className="w-4 mr-2" />
              My Account
            </Link>

            <Link
              to="/"
              className="text-gray-700  text-left  flex items-center"
            >
              <Rss className="w-4 mr-2" />
              My Posts
            </Link>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSc0QkRlyZ9hDSFvW5MTUxU7R8vqjPgCqdCghx5SpIOxhPAlHQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-left  flex items-center hover:text-primary"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </a>

            <hr className="border-white/20" />
          </div>

          {/* ✅ Logout with confirmation */}
          <div className="mt-4 mb-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-left flex items-center text-red-500">
                  <LogOut className="w-4 mr-2" />
                  Logout
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out of your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Yes, Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="relative mt-auto mb-12 rounded-md border-2 border-red-400/20">
            <a
              href="https://forms.gle/egTkBLKhYgWdsrFz5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 rounded-md font-semibold text-white relative z-10"
            >
              <Bug className="w-4 h-4 mr-2 fill-red-900" />
              Report a Bug !
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
