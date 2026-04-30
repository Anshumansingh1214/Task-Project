import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, UserPlus, X } from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetchProject();
    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [id, user]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data.filter(u => u.role === 'Member'));
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.post(`/projects/${id}/members`, { memberId: selectedUser });
      fetchProject();
      setShowMemberModal(false);
      setSelectedUser('');
    } catch (error) {
      console.error('Failed to add member', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.delete(`/projects/${id}/members`, { data: { memberId } });
      fetchProject();
    } catch (error) {
      console.error('Failed to remove member', error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        navigate('/projects');
      } catch (error) {
        console.error('Failed to delete project', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          {user?.role === 'Admin' && (
            <button
              onClick={handleDeleteProject}
              className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          {user?.role === 'Admin' && (
            <button
              onClick={() => setShowMemberModal(true)}
              className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {project.members?.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                  {member.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{member.username}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              {user?.role === 'Admin' && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {(!project.members || project.members.length === 0) && (
            <p className="text-gray-500 text-sm">No members added yet.</p>
          )}
        </div>
      </div>

      {showMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Member</label>
                <select
                  required
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="">Select a user...</option>
                  {users
                    .filter(u => !project.members.some(m => m._id === u._id))
                    .map(u => (
                      <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
                    ))
                  }
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
