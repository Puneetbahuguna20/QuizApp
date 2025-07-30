import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthConnectionTest = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerResult, setRegisterResult] = useState<any>(null);
  const [loginResult, setLoginResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test registration endpoint
  const testRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = { name, email, password, role: 'student' };
      console.log('Sending registration data to backend:', userData);
      
      const response = await axios.post('http://localhost:3001/auth/register', userData);
      console.log('Registration test response:', response.data);
      setRegisterResult(response.data);
    } catch (err: any) {
      console.error('Registration test failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Check console for details.');
      setRegisterResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Test login endpoint
  const testLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = { email, password };
      console.log('Sending login data to backend:', userData);
      
      const response = await axios.post('http://localhost:3001/auth/login', userData);
      console.log('Login test response:', response.data);
      setLoginResult(response.data);
    } catch (err: any) {
      console.error('Login test failed:', err);
      setError(err.response?.data?.message || 'Login failed. Check console for details.');
      setLoginResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#0c0c0c] text-white border border-white/10">
      <CardHeader>
        <CardTitle>Auth API Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div className="flex space-x-4 pt-2">
          <Button 
            onClick={testRegister} 
            disabled={loading || !name || !email || !password}
            className="bg-[#0d1c44] text-white hover:bg-[#0a1736]"
          >
            {loading ? 'Testing...' : 'Test Register'}
          </Button>
          
          <Button 
            onClick={testLogin} 
            disabled={loading || !email || !password}
            className="bg-[#0d1c44] text-white hover:bg-[#0a1736]"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </Button>
        </div>

        {error && (
          <div className="text-red-400 mt-2">
            {error}
          </div>
        )}

        {registerResult && (
          <div className="mt-4 p-4 bg-[#1a1a1a] rounded-md">
            <h3 className="font-semibold mb-2">Register Response:</h3>
            <pre className="text-xs overflow-auto p-2 bg-black/30 rounded">
              {JSON.stringify(registerResult, null, 2)}
            </pre>
          </div>
        )}

        {loginResult && (
          <div className="mt-4 p-4 bg-[#1a1a1a] rounded-md">
            <h3 className="font-semibold mb-2">Login Response:</h3>
            <pre className="text-xs overflow-auto p-2 bg-black/30 rounded">
              {JSON.stringify(loginResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthConnectionTest;