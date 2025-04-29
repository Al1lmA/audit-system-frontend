import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Search, Edit, Trash2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  contactPerson: string;
  email: string;
  lastAudit: string | null;
}

const Companies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
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
      lastAudit: '2025-01-15'
    },
    {
      id: '2',
      name: 'TechCorp',
      industry: 'Technology',
      size: 'Medium',
      location: 'San Francisco, USA',
      contactPerson: 'Jane Doe',
      email: 'jane@techcorp.com',
      lastAudit: '2025-02-10'
    },
    {
      id: '3',
      name: 'Global Systems',
      industry: 'IT Services',
      size: 'Large',
      location: 'London, UK',
      contactPerson: 'Robert Johnson',
      email: 'robert@globalsystems.com',
      lastAudit: '2025-01-28'
    },
    {
      id: '4',
      name: 'Innovate Solutions',
      industry: 'Software',
      size: 'Small',
      location: 'Berlin, Germany',
      contactPerson: 'Anna Schmidt',
      email: 'anna@innovate.com',
      lastAudit: '2025-01-05'
    },
    {
      id: '5',
      name: 'DataTech',
      industry: 'Data Analytics',
      size: 'Medium',
      location: 'Toronto, Canada',
      contactPerson: 'Michael Brown',
      email: 'michael@datatech.com',
      lastAudit: null
    }
  ];

  const filteredCompanies = mockCompanies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage companies for IT audits
          </p>
        </div>
        <Link
          to="/companies/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Companies list */}
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Audit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/companies/${company.id}`} className="hover:text-indigo-600">
                            {company.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          {company.contactPerson} • {company.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.lastAudit ? company.lastAudit : 'No audits yet'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/companies/${company.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCompanies.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No companies found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;