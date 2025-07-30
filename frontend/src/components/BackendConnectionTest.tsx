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

const BackendConnectionTest = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test basic backend connection
  const testBackendConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/test');
      console.log('Backend connection test response:', response.data);
      setTestResult(response.data);
    } catch (err) {
      console.error('Backend connection test failed:', err);
      setError('Connection failed. Check console for details.');
      setTestResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#0c0c0c] text-white border border-white/10">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testBackendConnection} 
          disabled={loading}
          className="bg-[#0d1c44] text-white hover:bg-[#0a1736]"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </Button>

        {error && (
          <div className="text-red-400 mt-2">
            {error}
          </div>
        )}

        {testResult && (
          <div className="mt-4 p-4 bg-[#1a1a1a] rounded-md">
            <h3 className="font-semibold mb-2">Connection Status: 
              <span className="text-green-400 ml-2">{testResult.status}</span>
            </h3>
            <p className="text-white/70">Message: {testResult.message}</p>
            <p className="text-white/70">Timestamp: {testResult.timestamp}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendConnectionTest;