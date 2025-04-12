
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationLinks = (
    <>
      <Link to="/" className={isActive("/") ? "active" : ""}>
        Home
      </Link>
      <Link to="/upload" className={isActive("/upload") ? "active" : ""}>
        Upload
      </Link>
      <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
        Profile
      </Link>
    </>
  );

  const navLinks = [
    { path: "/", label: "Home", active: isActive("/") },
    { path: "/upload", label: "Upload", active: isActive("/upload") },
    { path: "/profile", label: "Profile", active: isActive("/profile") },
    { path: "/face-test", label: "Face Testing", active: isActive("/face-test") },
  ];

  return (
    <nav className="bg-secondary border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          PhotoCircle
        </Link>

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-64">
              <SheetHeader>
                <SheetTitle>PhotoCircle</SheetTitle>
                <SheetDescription>
                  Navigate through the app.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`block py-2 px-4 rounded-md hover:bg-accent ${link.active ? 'font-semibold' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`py-2 px-3 rounded-md hover:bg-accent ${link.active ? 'font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
