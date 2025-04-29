import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Users, ClipboardCheck, Edit, ArrowLeft } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  lastAudit: string | null;
}

interface Audit {
  id: string;
  name: string;
  date: string;
  status: string;
  score: number;
}

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data - in a real app, this would be fetched from an API
  const company: Company = {
    id: '1',
    name: 'Acme Inc.',
    industry: 'Manufacturing',
    size: 'Large (1000+ employees)',
    location: 'New York, USA',
    contactPerson: 'John Smith',
    email: 'john@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001, USA',
    description: 'Acme Inc. is a leading manufacturing company specializing in industrial equipment and solutions. Founded in 1985, the company has grown to become a key player in the industry with operations across North America and Europe.',
    lastAudit: '2025-01-15'
  };

  // Mock audit history
  const auditHistory: Audit[] = [
    { id: '101', name: 'Annual IT Infrastructure Audit', date: '2025-01-15', status: 'Completed', score: 85 },
    { id: '92', name: 'Security Compliance Audit', date: '2024-07-22', status: 'Completed', score: 78 },
    { id: '83', name: 'Data Protection Assessment', date: '2024-01-10', status: 'Completed', score: 92 },
    { id: '71', name: 'Network Security Audit', date: '2023-06-05', status: 'Completed', score: 75 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/companies" className="mr-4 text-indigo-600 hover:text-indigo-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{company.name}</h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/companies/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Company
          </Link>
          <Link
            to={`/audits/new?companyId=${id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Start New Audit
          </Link>
        </div>
      </div>

      {/* Company details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Company Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and contact information.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Company name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{company.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Industry</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{company.industry}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Company size</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{company.size}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Contact person</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{company.contactPerson}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`mailto:${company.email}`} className="text-indigo-600 hover:text-indigo-900">
                  {company.email}
                </a>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <a href={`tel:${company.phone}`} className="text-indigo-600 hover:text-indigo-900">
                  {company.phone}
                </a>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                {company.address}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">About</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {company.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Audit history */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Audit History</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Previous audits conducted for this company.</p>
          </div>
          <Link
            to={`/audits?companyId=${id}`}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audit Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditHistory.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <ClipboardCheck className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/audits/${audit.id}`} className="hover:text-indigo-600">
                              {audit.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        audit.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          audit.score >= 90 ? 'text-green-600' : 
                          audit.score >= 70 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {audit.score}%
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              audit.score >= 90 ? 'bg-green-500' : 
                              audit.score >= 70 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${audit.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/audits/${audit.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {auditHistory.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No audits have been conducted for this company yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;