
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full text-center space-y-4 sm:space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-sm sm:text-base text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-4">
          <Link to="/" className="text-sm sm:text-base">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
