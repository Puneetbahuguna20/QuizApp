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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema, type RegisterFormData } from "@/lib/validation";
import { Home, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function Register() {
    const [status, setStatus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register: authRegister } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const registerSubmit = async (data: RegisterFormData) => {
        try {
            console.log('🎯 Registration form submitted with data:', data);
            console.log('✅ Zod validation passed for registration form');
            
            // Always register as student
            await authRegister(data.name, data.email, data.password, 'student');
            
            // Verify the data was stored correctly
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const lastUser = registeredUsers[registeredUsers.length - 1];
            console.log('🔍 Last registered user:', lastUser);
            console.log('🔍 Stored role:', lastUser?.role);
            
            // Show success message and redirect to login
            setStatus(true);
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 2000);
            
        } catch (error: any) {
            console.error("❌ Registration error:", error);
            setStatus(false);
        }
    };

    const alertJSX = (
        <div className="bg-green-500 text-white p-3 rounded-md mb-4">
            Registration successful! Redirecting to login page...
        </div>
    );

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
                    <CardTitle className="space-y-1 text-center">
                        Register Here
                    </CardTitle>
                    <CardDescription className="text-center">Quiz App Registration</CardDescription>
                </CardHeader>
                <CardContent>
                    {status && alertJSX}
                    
                    <form onSubmit={handleSubmit(registerSubmit)} className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label htmlFor="name" className="text-white">Name</Label>
                            <Input 
                                {...register('name')} 
                                type="text" 
                                id="name" 
                                placeholder="Name" 
                                autoComplete="name"
                                className="bg-white/10 border-white/20 text-white"
                            />
                            <span className="text-red-500">{errors.name && errors.name.message}</span>
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input 
                                {...register('email')} 
                                type="email" 
                                id="email" 
                                placeholder="Email" 
                                autoComplete="email"
                                className="bg-white/10 border-white/20 text-white"
                            />
                            <span className="text-red-500">{errors.email && errors.email.message}</span>
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label htmlFor="password" className="text-white">Password</Label>
                            <div className="relative">
                                <Input 
                                    {...register('password')} 
                                    type={showPassword ? "text" : "password"}
                                    id="password" 
                                    placeholder="Password" 
                                    autoComplete="new-password"
                                    className="bg-white/10 border-white/20 text-white pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <span className="text-red-500">{errors.password && errors.password.message}</span>
                        </div>

                        {/* Role selection removed - all users register as students */}
                        <input type="hidden" {...register('role')} value="student" />
                        
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Button className="w-full bg-[#0d1c44] text-white hover:bg-[#0a1736]">
                                Register
                            </Button>
                        </div>
                        
                        <div className="text-center text-white/50 text-sm">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-blue-400 hover:text-blue-300 underline"
                            >
                                Login here
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Register;
