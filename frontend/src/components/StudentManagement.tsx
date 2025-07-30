import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Student {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalQuizzes: number;
  averageScore: number;
  lastActive: string;
}

const StudentManagement: React.FC = () => {
  // Mock student data
  const students: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      joinDate: '2024-01-15',
      totalQuizzes: 8,
      averageScore: 85,
      lastActive: '2024-01-20',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      joinDate: '2024-01-10',
      totalQuizzes: 12,
      averageScore: 92,
      lastActive: '2024-01-21',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      joinDate: '2024-01-18',
      totalQuizzes: 5,
      averageScore: 78,
      lastActive: '2024-01-19',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Student Management</h3>
        <div className="text-sm text-white/60">
          Total Students: {students.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="bg-[#181f36] border-white/10 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription className="text-white/60">
                    {student.email}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getScoreColor(student.averageScore)}`}>
                    {student.averageScore}%
                  </div>
                  <div className="text-xs text-white/60">Avg Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Joined:</span>
                    <p className="font-medium">{new Date(student.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Quizzes Taken:</span>
                    <p className="font-medium">{student.totalQuizzes}</p>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Last Active:</span>
                    <span className="font-medium">{new Date(student.lastActive).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-3 rounded text-sm">
                    View Details
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-3 rounded text-sm">
                    Message
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-[#181f36] border-white/10">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription className="text-white/60">
            Latest student activities and quiz attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm"><strong>John Doe</strong> completed <strong>Mathematics Quiz</strong></p>
                <p className="text-xs text-white/60">Score: 85% • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm"><strong>Jane Smith</strong> started <strong>Science Quiz</strong></p>
                <p className="text-xs text-white/60">In progress • 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm"><strong>Mike Johnson</strong> joined the platform</p>
                <p className="text-xs text-white/60">New student • 1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentManagement; 