import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Search, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import CompanyForm from '../components/CompanyForm';

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  contactPerson: string;
  email: string;
  lastAudit: string | null;
  phone: string;
  address: string;
  description: string;
}

const Companies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Company>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { user } = useUser();
  const isAdmin = user?.role === 'admin';
  
  // Mock data
  const mockCompanies: Company[] = [
    {
      id: '1',
      name: 'Acme Inc.',
      industry: 'Manufacturing',
      size: 'Large',
      location: 'New York, USA',
      contactPerson: 'John Smith',
      email: 'john@acme.com',
      lastAudit: '2025-01-15',
      phone: '+1 234 567 8900',
      address: '123 Main St, New York, NY 10001',
      description: 'Leading manufacturer of industrial equipment'
    },
    {
      id: '2',
      name: 'TechCorp',
      industry: 'Technology',
      size: 'Medium',
      location: 'San Francisco, USA',
      contactPerson: 'Jane Doe',
      email: 'jane@techcorp.com',
      lastAudit: '2025-02-20',
      phone: '+1 234 567 8901',
      address: '456 Tech Ave, San Francisco, CA 94105',
      description: 'Innovative software solutions provider'
    },
    {
      id: '3',
      name: 'Global Systems',
      industry: 'IT Services',
      size: 'Large',
      location: 'London, UK',
      contactPerson: 'Mike Johnson',
      email: 'mike@globalsys.com',
      lastAudit: '2025-03-10',
      phone: '+44 20 7123 4567',
      address: '789 Tech Lane, London, UK EC1A 1BB',
      description: 'Global IT services and consulting'
    }
  ];

  const handleSort = (field: keyof Company) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setShowModal(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setShowModal(true);
  };

  const handleSubmit = (data: Omit<Company, 'id' | 'lastAudit'>) => {
    if (editingCompany) {
      // Update existing company
      console.log('Updating company:', { ...editingCompany, ...data });
    } else {
      // Add new company
      console.log('Adding new company:', data);
    }
    setShowModal(false);
    setEditingCompany(null);
  };

  const sortedAndFilteredCompanies = mockCompanies
    .filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Companies</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage companies for IT audits
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleAddCompany}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </button>
        )}
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Companies list */}
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
                    <span>Company</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'name' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('industry')}
                  >
                    <span>Industry</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'industry' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('size')}
                  >
                    <span>Size</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'size' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('location')}
                  >
                    <span>Location</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'location' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('lastAudit')}
                  >
                    <span>Last Audit</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'lastAudit' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                {isAdmin && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedAndFilteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          <Link to={`/companies/${company.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            {company.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {company.contactPerson} • {company.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {company.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {company.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {company.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {company.lastAudit ? company.lastAudit : 'No audits yet'}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this company?')) {
                              // Delete company logic would go here
                              console.log('Delete company:', company.id);
                            }
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedAndFilteredCompanies.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            No companies found matching your search criteria.
          </div>
        )}
      </div>

      {/* Add the modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingCompany ? 'Edit Company' : 'Add New Company'}
            </h2>
            <CompanyForm
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowModal(false);
                setEditingCompany(null);
              }}
              initialData={editingCompany || undefined}
              isEdit={!!editingCompany}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;