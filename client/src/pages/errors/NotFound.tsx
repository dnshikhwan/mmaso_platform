import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-9xl font-extrabold text-gray-900 dark:text-gray-100">
                    404
                </h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    Oops!
                </p>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    It looks like you've taken a wrong turn. Let's get you back
                    home.
                </p>
                <div className="mt-6">
                    <Link to="#">
                        <Button
                            onClick={() => {
                                navigate(-1);
                            }}
                            className="bg-black hover:bg-gray-800 w-full"
                        >
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
