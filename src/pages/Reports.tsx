import React, { useState } from 'react';
import { FileText, Building2, ClipboardCheck, Search } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface ReportTarget {
  type: 'company' | 'audit';
  id: string;
  name: string;
}

const Reports: React.FC = () => {
  const { user } = useUser();
  const [showSelector, setShowSelector] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<ReportTarget | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const companies = [
    { id: '1', name: 'Acme Inc.' },
    { id: '2', name: 'TechCorp' },
    { id: '3', name: 'Global Systems' },
  ];

  const audits = [
    { id: '1', name: 'Annual IT Infrastructure Audit - Acme Inc.', companyId: '1' },
    { id: '2', name: 'Security Compliance Audit - TechCorp', companyId: '2' },
    { id: '3', name: 'Data Protection Assessment - Global Systems', companyId: '3' },
  ];

  const filteredCompanies = companies.filter(company =>
    user?.role === 'participant'
      ? company.name === user.organization
      : company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAudits = audits.filter(audit =>
    user?.role === 'participant'
      ? audit.companyId === companies.find(c => c.name === user.organization)?.id
      : audit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = () => {
    setShowSelector(true);
    setSearchTerm('');
  };

  const handleTargetSelect = (target: ReportTarget) => {
    setSelectedTarget(target);
    // Here you would generate the report for the selected target
    console.log('Generating report for:', target);
    setShowSelector(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports</h1>
        </div>
        {user?.role !== 'participant' && (
          <button
            onClick={handleGenerateReport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate New Report
          </button>
        )}
      </div>
      
      {showSelector && (
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Report Target</h2>
            
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search companies or audits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Companies</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filteredCompanies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleTargetSelect({ type: 'company', ...company })}
                      className="w-full flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-left text-gray-900 dark:text-white"
                    >
                      <Building2 className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
                      {company.name}
                    </button>
                  ))}
                  {filteredCompanies.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 p-2">No companies found</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specific Audits</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filteredAudits.map((audit) => (
                    <button
                      key={audit.id}
                      onClick={() => handleTargetSelect({ type: 'audit', ...audit })}
                      className="w-full flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-left text-gray-900 dark:text-white"
                    >
                      <ClipboardCheck className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2" />
                      {audit.name}
                    </button>
                  ))}
                  {filteredAudits.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 p-2">No audits found</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowSelector(false);
                  setSearchTerm('');
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Reports</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Previously generated reports
          </p>
        </div>
        
        <div className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            No reports generated yet. {user?.role !== 'participant' && 'Generate your first report to get started.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;