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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Отчёты</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Последние отчёты</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ранее сгенерированные отчёты
          </p>
        </div>
        
        <div className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Отчёты ещё не были сгенерированы. Сгенерируйте отчёты на странице аналитики.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;