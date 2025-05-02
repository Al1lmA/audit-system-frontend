import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useDropzone } from 'react-dropzone';
import { Calendar, Building2, User, Upload, FileSpreadsheet } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  organization: string;
}

const CreateAudit: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchCompany, setSearchCompany] = useState('');
  const [searchParticipant, setSearchParticipant] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  
  // Refs for dropdowns to handle outside clicks
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const participantDropdownRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    framework: '',
    objective: '',
    company: null as Company | null,
    participant: null as Participant | null,
    questionnaire: null as File | null
  });

  // Mock data
  const companies: Company[] = [
    { id: '1', name: 'Acme Inc.' },
    { id: '2', name: 'TechCorp' },
    { id: '3', name: 'Global Systems' },
  ];

  const participants: Participant[] = [
    { id: '1', name: 'John Participant', email: 'john@acme.com', organization: 'Acme Inc.' },
    { id: '2', name: 'Jane Participant', email: 'jane@techcorp.com', organization: 'TechCorp' },
    { id: '3', name: 'Mike Participant', email: 'mike@globalsys.com', organization: 'Global Systems' },
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchCompany.toLowerCase())
  );

  const filteredParticipants = participants.filter(participant =>
    formData.company 
      ? participant.organization === formData.company.name &&
        participant.name.toLowerCase().includes(searchParticipant.toLowerCase())
      : participant.name.toLowerCase().includes(searchParticipant.toLowerCase())
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData(prev => ({ ...prev, questionnaire: acceptedFiles[0] }));
      }
    }
  });
  
  // В начале компонента, после импортов
  useEffect(() => {
    // При монтировании компонента
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    // При размонтировании компонента возвращаем прокрутку
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
      if (participantDropdownRef.current && !participantDropdownRef.current.contains(event.target as Node)) {
        setShowParticipantDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clear participant when company changes
  useEffect(() => {
    if (formData.company && formData.participant && formData.participant.organization !== formData.company.name) {
      setFormData(prev => ({ ...prev, participant: null }));
      setSearchParticipant('');
    }
  }, [formData.company, formData.participant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log('Form data:', formData);
    navigate('/audits');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Audit</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fill in the audit details and upload the questionnaire
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Audit Name/Title
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="startDate"
                    className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expected End Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="endDate"
                    className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="framework" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Framework/Standard (Optional)
              </label>
              <input
                type="text"
                id="framework"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={formData.framework}
                onChange={(e) => setFormData(prev => ({ ...prev, framework: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="objective" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Audit Objective
              </label>
              <textarea
                id="objective"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={formData.objective}
                onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        {/* Participants Information */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Participants Information</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expert (Auditor)
                </label>
                <div className="mt-1 flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-900 dark:text-white">{user?.name}</span>
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </div>
              </div>
            </div>

            <div ref={companyDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company
              </label>
              <div className="mt-1 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-10 rounded-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Search company..."
                    value={searchCompany}
                    onChange={(e) => {
                      setSearchCompany(e.target.value);
                      setShowCompanyDropdown(true);
                    }}
                    onFocus={() => setShowCompanyDropdown(true)}
                  />
                </div>
                {showCompanyDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1">
                    {filteredCompanies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, company }));
                          setSearchCompany(company.name);
                          setShowCompanyDropdown(false);
                        }}
                      >
                        {company.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div ref={participantDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Representative
              </label>
              <div className="mt-1 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-10 rounded-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Search representative..."
                    value={searchParticipant}
                    onChange={(e) => {
                      setSearchParticipant(e.target.value);
                      setShowParticipantDropdown(true);
                    }}
                    onFocus={() => setShowParticipantDropdown(true)}
                    disabled={!formData.company}
                  />
                </div>
                {showParticipantDropdown && formData.company && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md py-1">
                    {filteredParticipants.map((participant) => (
                      <button
                        key={participant.id}
                        type="button"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, participant }));
                          setSearchParticipant(participant.name);
                          setShowParticipantDropdown(false);
                        }}
                      >
                        <div>{participant.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{participant.email}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {formData.participant && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {formData.participant.email}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Questionnaire Upload */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Upload Questionnaire</h2>
          <div
            {...getRootProps()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="space-y-1 text-center">
              <input {...getInputProps()} />
              <div className="flex justify-center">
                {formData.questionnaire ? (
                  <FileSpreadsheet className="h-12 w-12 text-green-500" />
                ) : (
                  <Upload className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none">
                  {formData.questionnaire ? (
                    <span>{formData.questionnaire.name}</span>
                  ) : (
                    <span>
                      {isDragActive
                        ? 'Drop the file here'
                        : 'Upload a questionnaire file'}
                    </span>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                XLSX file format only
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/audits')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Create Audit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAudit;