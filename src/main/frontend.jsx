import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { motion } from 'framer-motion';

export default function SupervisorApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [users, setUsers] = useState([]);

  const handleLogin = () => {
    // Placeholder login logic
    if (userId && password) {
      setLoggedIn(true);
    }
  };

  const handleTestChange = (value) => {
    setSelectedTest(value);
    // Fetch users for the selected test (mock data here)
    // Replace with actual API call
    setUsers([
      { userId: 'user1', riskScore: 0.7 },
      { userId: 'user2', riskScore: 0.3 },
      { userId: 'user3', riskScore: 0.9 }
    ]);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 w-96 space-y-4">
          <h2 className="text-xl font-bold">Supervisor Login</h2>
          <Input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleLogin}>Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supervisor Dashboard</h1>
        <Select onValueChange={handleTestChange}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a Test" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test1">Test 1</SelectItem>
            <SelectItem value="test2">Test 2</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <motion.div key={user.userId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }}>
            <Card className="p-4 rounded-2xl shadow bg-white">
              <h3 className="text-lg font-semibold">User ID: {user.userId}</h3>
              <p className="text-sm">Risk Score: <span className={user.riskScore > 0.7 ? 'text-red-500' : user.riskScore > 0.4 ? 'text-yellow-500' : 'text-green-500'}>{user.riskScore}</span></p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}