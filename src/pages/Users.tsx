import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users as UsersIcon, Plus, Search, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import UserForm from '../components/UserForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'expert' | 'participant' | 'admin';
  organization?: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Expert',
      email: 'john@example.com',
      role: 'expert',
      status: 'active',
      lastLogin: '2025-02-20'
    },
    {
      id: '2',
      name: 'Jane Participant',
      email: 'jane@example.com',
      role: 'participant',
      organization: 'Acme Inc.',
      status: 'active',
      lastLogin: '2025-02-19'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-02-21'
    }
  ];

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = mockUsers
    .filter(user =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === 'all' || user.role === roleFilter)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === null) return sortDirection === 'asc' ? -1 : 1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Delete user logic would go here
      console.log('Delete user:', userId);
    }
  };

  const handleSubmit = (data: Omit<User, 'id' | 'status' | 'lastLogin'>) => {
    if (editingUser) {
      // Update existing user
      console.log('Updating user:', { ...editingUser, ...data });
    } else {
      // Add new user
      console.log('Adding new user:', data);
    }
    setShowModal(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage system users and their roles
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="expert">Experts</option>
              <option value="participant">Participants</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users list */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('name')}
                  >
                    <span>User</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'name' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('role')}
                  >
                    <span>Role</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'role' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Organization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('status')}
                  >
                    <span>Status</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'status' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <span>Last Login</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'lastLogin' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          <Link to={`/users/${user.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            {user.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.organization || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No users found matching your search criteria.
          </div>
        )}
      </div>

      {/* Add the modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <UserForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowModal(false);
                setEditingUser(null);
              }}
              initialData={editingUser || undefined}
              isEdit={!!editingUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;