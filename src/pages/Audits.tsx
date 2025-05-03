import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ClipboardCheck, Plus, Search, FileText, Eye, ArrowUpDown, Calendar } from 'lucide-react';

interface Audit {
  id: string;
  name: string;
  company: string;
  companyId: string;
  date: string;
  status: 'In Progress' | 'Completed' | 'Planned';
  completion: number;
  expert: string;
}

const Audits: React.FC = () => {
  const [searchParams] = useSearchParams();
  const companyIdFilter = searchParams.get('companyId');
  const { user } = useUser();
  const canCreateAudit = user?.role === 'expert' || user?.role === 'admin';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: '',
    to: ''
  });
  const [sortField, setSortField] = useState<keyof Audit>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Mock data
  const mockAudits: Audit[] = [
    {
      id: '1',
      name: 'Annual IT Infrastructure Audit',
      company: 'Acme Inc.',
      companyId: '1',
      date: '2025-02-15',
      status: 'In Progress',
      completion: 65,
      expert: 'John Expert'
    },
    {
      id: '2',
      name: 'Security Compliance Audit',
      company: 'TechCorp',
      companyId: '2',
      date: '2025-02-10',
      status: 'In Progress',
      completion: 30,
      expert: 'John Expert'
    },
    {
      id: '3',
      name: 'Data Protection Assessment',
      company: 'Global Systems',
      companyId: '3',
      date: '2025-01-28',
      status: 'Completed',
      completion: 100,
      expert: 'Sarah Expert'
    },
    {
      id: '4',
      name: 'Network Security Audit',
      company: 'Innovate Solutions',
      companyId: '4',
      date: '2025-01-15',
      status: 'Completed',
      completion: 100,
      expert: 'John Expert'
    },
    {
      id: '5',
      name: 'Cloud Infrastructure Review',
      company: 'DataTech',
      companyId: '5',
      date: '2025-03-10',
      status: 'Planned',
      completion: 0,
      expert: 'Sarah Expert'
    }
  ];

  const handleSort = (field: keyof Audit) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAudits = mockAudits
    .filter(audit => 
      (companyIdFilter ? audit.companyId === companyIdFilter : true) &&
      (user?.role === 'participant' ? audit.company === user.organization : true) &&
      (audit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       audit.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || audit.status === statusFilter) &&
      (!dateRange.from || audit.date >= dateRange.from) &&
      (!dateRange.to || audit.date <= dateRange.to)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Audits</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {companyIdFilter 
              ? 'Audits for the selected company' 
              : user?.role === 'participant'
              ? `Audits for ${user.organization}`
              : 'Manage and view all IT audits'}
          </p>
        </div>
        {canCreateAudit && (
          <Link
            to="/audits/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Audit
          </Link>
        )}
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
              placeholder="Search audits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input
              type="date"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Audits list */}
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
                    <span>Audit Name</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'name' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('company')}
                  >
                    <span>Company</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'company' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('date')}
                  >
                    <span>Date</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'date' ? 'text-indigo-500' : ''}`} />
                  </button>
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
                  Completion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('expert')}
                  >
                    <span>Expert</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'expert' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAudits.map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <ClipboardCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          <Link to={`/audits/${audit.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            {audit.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <Link to={`/companies/${audit.companyId}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                        {audit.company}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {audit.date}
                  </td>
                  <td className="px-6 py-4  whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      audit.status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                      audit.status === 'In Progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          audit.status === 'Completed' ? 'bg-green-500 dark:bg-green-600' : 
                          audit.status === 'In Progress' ? 'bg-yellow-500 dark:bg-yellow-600' :
                          'bg-blue-500 dark:bg-blue-600'
                        }`} 
                        style={{ width: `${audit.completion}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{audit.completion}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {audit.expert}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link to={`/audits/${audit.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                        <Eye className="h-5 w-5" />
                      </Link>
                      {audit.status === 'Completed' && (
                        <Link to={`/reports/${audit.id}`} className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                          <FileText className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAudits.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No audits found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Audits;