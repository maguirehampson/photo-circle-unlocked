
import { Link } from "react-router-dom";
import { Bell, User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBadge from "./NotificationBadge";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl text-primary">PhotoShare</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/upload">
            <Button variant="ghost" size="icon">
              <Upload className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <NotificationBadge count={3} />
          </Button>
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
