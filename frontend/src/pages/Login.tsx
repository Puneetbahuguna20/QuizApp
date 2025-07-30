import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginFormData } from "@/lib/validation";
import { Eye, EyeOff, Home } from "lucide-react";
import { useState } from "react";

function Login() {
  const [status, setStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('🎯 Login form submitted with data:', data);
    console.log('✅ Zod validation passed for login form');
    setStatus(true); // Set loading state
    
    try {
      // Login user (AuthContext will handle role-based authentication)
      await login(data.email, data.password);
      
      // Get the current user from auth context
// Remove unused authToken assignment
      const userStr = localStorage.getItem('user');
      let currentUser;
      
      try {
        if (userStr) {
          currentUser = JSON.parse(userStr);
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
      
      // If no user in localStorage, check registered users
      if (!currentUser) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        currentUser = registeredUsers.find((user: any) => user.email === data.email);
      }
      
      console.log('🔍 Current user:', currentUser);
      console.log('🔍 User role:', currentUser?.role);
      
      // Navigate based on user role
      if (data.email.includes('teacher') || currentUser?.role === 'teacher') {
        // Teacher user
        console.log('🚀 Navigating to Teacher Dashboard');
        navigate('/TeacherDashboard', { replace: true });
      } else {
        // Student or default
        console.log('🚀 Navigating to Student Dashboard');
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      // Handle API errors
      if (error.response?.data?.message) {
        setError("root", {
          type: "manual",
          message: error.response.data.message,
        });
      } else if (error.message === "User not found. Please register first.") {
        // Handle specific error for user not found
        setError("root", {
          type: "manual",
          message: "User not found. Please register first or use a valid teacher account.",
        });
      } else if (error.message === "User does not exist") {
        // Handle specific error from backend
        setError("root", {
          type: "manual",
          message: "User does not exist. Please register first.",
        });
      } else if (error.message === "Invalid password") {
        // Handle specific error from backend
        setError("root", {
          type: "manual",
          message: "Invalid password. Please check your credentials.",
        });
      } else {
        setError("root", {
          type: "manual",
          message: error.message || "Login failed. Please check your credentials and try again.",
        });
      }
    } finally {
      setStatus(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] px-4 relative">
      <Button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        <Home className="h-4 w-4 mr-1" />
        Home
      </Button>
      <Card className="w-full max-w-md bg-[#0c0c0c] text-white border border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login Here</CardTitle>
          <CardDescription className="text-center text-white/50">
            Quiz App
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`bg-white/10 border-white/20 text-white ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className={`bg-white/10 border-white/20 text-white pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="text-red-400 text-sm text-center">
                {errors.root.message}
              </div>
            )}

            <div className="pt-4">
              <Button
                className="w-full bg-[#0d1c44] text-white hover:bg-[#0a1736] disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting || status}
              >
                {isSubmitting || status ? "Logging in..." : "Login"}
              </Button>
            </div>

            <div className="text-center text-white/50 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Register here
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
