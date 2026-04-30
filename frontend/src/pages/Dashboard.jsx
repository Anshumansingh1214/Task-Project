import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, ListTodo } from 'lucide-react';
import api from '../api/axios';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats.totalTasks} 
          icon={ListTodo} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Completed" 
          value={stats.completedTasks} 
          icon={CheckCircle} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Overdue" 
          value={stats.overdueTasks} 
          icon={Clock} 
          color="bg-red-500" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
