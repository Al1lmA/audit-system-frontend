import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  ClipboardCheck, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Send,
  History
} from 'lucide-react';

interface AuditHistory {
  id: string;
  date: string;
  type: 'submission' | 'feedback' | 'status_change';
  content: string;
  files?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface AuditQuestion {
  id: string;
  category: string;
  question: string;
  response?: string | null;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-answered';
  evidence?: string | null;
  recommendation?: string | null;
}

const AuditDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'history'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedback, setFeedback] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [questionnaireFile, setQuestionnaireFile] = useState<File | null>(null);
  
  // Mock data - in a real app, this would be fetched from an API
  const audit = {
    id: '1',
    name: 'Annual IT Infrastructure Audit',
    company: 'Acme Inc.',
    companyId: '1',
    date: '2025-02-15',
    dueDate: '2025-03-15',
    status: 'Planned', // Changed to 'Planned' for demonstration
    completion: 0,
    expert: 'John Expert',
    participant: {
      name: 'Jane Participant',
      email: 'jane@acme.com'
    },
    description: 'This audit evaluates the IT infrastructure, security controls, and compliance with industry standards.',
    framework: 'ITIL v4',
    categories: ['Infrastructure', 'Security', 'Compliance', 'Data Management', 'Business Continuity'],
    questions: [
      {
        id: '1',
        category: 'Infrastructure',
        question: 'Is there a documented inventory of all IT assets?',
        response: 'Yes, we maintain a complete inventory in our CMDB system.',
        status: 'compliant',
        evidence: 'CMDB_Export_2025.xlsx',
        recommendation: null
      },
      {
        id: '2',
        category: 'Infrastructure',
        question: 'Are hardware and software assets regularly reviewed for end-of-life and support status?',
        response: 'We have a quarterly review process, but it\'s not consistently followed.',
        status: 'partial',
        evidence: 'EOL_Review_Process.pdf',
        recommendation: 'Implement automated alerts for approaching EOL dates.'
      },
      {
        id: '3',
        category: 'Security',
        question: 'Is multi-factor authentication enabled for all administrative accounts?',
        response: 'Yes, MFA is required for all admin accounts across all systems.',
        status: 'compliant',
        evidence: 'MFA_Policy.pdf',
        recommendation: null
      },
      {
        id: '4',
        category: 'Security',
        question: 'Are regular vulnerability scans performed on all systems?',
        response: 'We perform monthly scans but don\'t always remediate all findings.',
        status: 'partial',
        evidence: 'Vulnerability_Scan_Feb2025.pdf',
        recommendation: 'Implement a formal vulnerability management program with SLAs for remediation.'
      },
      {
        id: '5',
        category: 'Compliance',
        question: 'Is there a documented data retention policy?',
        response: 'No, we don\'t have a formal data retention policy.',
        status: 'non-compliant',
        evidence: null,
        recommendation: 'Develop and implement a data retention policy that complies with relevant regulations.'
      },
      {
        id: '6',
        category: 'Data Management',
        question: 'Are backup procedures tested regularly?',
        response: null,
        status: 'not-answered',
        evidence: null,
        recommendation: null
      },
      {
        id: '7',
        category: 'Business Continuity',
        question: 'Is there a documented and tested disaster recovery plan?',
        response: null,
        status: 'not-answered',
        evidence: null,
        recommendation: null
      }
    ] as AuditQuestion[],
    history: [
      {
        id: '1',
        date: '2025-02-15',
        type: 'status_change',
        content: 'Audit created and planned'
      },
      {
        id: '2',
        date: '2025-02-16',
        type: 'status_change',
        content: 'Audit started by John Expert',
        files: [
          {
            name: 'audit_questionnaire.xlsx',
            url: '/files/audit_questionnaire.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        ]
      },
      {
        id: '3',
        date: '2025-02-18',
        type: 'submission',
        content: 'Initial submission by Jane Participant',
        files: [
          {
            name: 'completed_questionnaire.xlsx',
            url: '/files/completed_questionnaire.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          },
          {
            name: 'evidence1.pdf',
            url: '/files/evidence1.pdf',
            type: 'application/pdf'
          }
        ]
      },
      {
        id: '4',
        date: '2025-02-19',
        type: 'feedback',
        content: 'Please provide additional evidence for security controls implementation'
      },
      {
        id: '5',
        date: '2025-02-20',
        type: 'submission',
        content: 'Updated submission with additional evidence',
        files: [
          {
            name: 'security_controls.pdf',
            url: '/files/security_controls.pdf',
            type: 'application/pdf'
          }
        ]
      }
    ] as AuditHistory[]
  };

  // Filter questions by category
  const filteredQuestions = selectedCategory === 'all' 
    ? audit.questions 
    : audit.questions.filter(q => q.category === selectedCategory);

  // Calculate statistics
  const stats = {
    total: audit.questions.length,
    answered: audit.questions.filter(q => q.status !== 'not-answered').length,
    compliant: audit.questions.filter(q => q.status === 'compliant').length,
    nonCompliant: audit.questions.filter(q => q.status === 'non-compliant').length,
    partial: audit.questions.filter(q => q.status === 'partial').length,
  };

  const handleStartAudit = () => {
    // In a real app, this would be an API call to update the audit status
    console.log('Starting audit:', id);
    // Update audit status to "In Progress"
    navigate('/audits');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleQuestionnaireUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setQuestionnaireFile(event.target.files[0]);
    }
  };

  const handleSubmitForReview = () => {
    // In a real app, this would be an API call to submit files and questionnaire
    console.log('Submitting for review:', {
      questionnaireFile,
      selectedFiles
    });
  };

  const handleSendFeedback = () => {
    // In a real app, this would be an API call to send feedback
    console.log('Sending feedback:', feedback);
    setFeedback('');
  };

  const handleCompleteAudit = () => {
    // In a real app, this would be an API call to complete the audit
    console.log('Completing audit:', id);
    navigate('/audits');
  };

  const handleResponseChange = (questionId: string, value: string) => {
    // In a real app, this would update the state and send to the backend
    console.log('Response updated for question', questionId, value);
  };

  const handleStatusChange = (questionId: string, status: AuditQuestion['status']) => {
    // In a real app, this would update the state and send to the backend
    console.log('Status updated for question', questionId, status);
  };

  const handleEvidenceUpload = (questionId: string) => {
    // In a real app, this would trigger a file upload
    console.log('Evidence upload for question', questionId);
  };

  const handleRecommendationChange = (questionId: string, value: string) => {
    // In a real app, this would update the state and send to the backend
    console.log('Recommendation updated for question', questionId, value);
  };

  const handleDownloadFile = (file: { url: string; name: string }) => {
    // In a real app, this would trigger a file download
    console.log('Downloading file:', file);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/audits" className="mr-4 text-indigo-600 hover:text-indigo-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{audit.name}</h1>
        </div>
        <div className="flex space-x-3">
          {audit.status === 'Planned' && user?.role === 'expert' && (
            <button
              onClick={handleStartAudit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Start Audit
            </button>
          )}
          
          {audit.status === 'In Progress' && user?.role === 'participant' && (
            <button
              onClick={handleSubmitForReview}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit for Review
            </button>
          )}

          {audit.status === 'In Progress' && user?.role === 'expert' && (
            <>
              <button
                onClick={handleCompleteAudit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Audit
              </button>
              <button
                onClick={handleSendFeedback}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`${
              activeTab === 'results'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('results')}
          >
            Results & Recommendations
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about this audit.</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Audit name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{audit.name}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                    <Link to={`/companies/${audit.companyId}`} className="text-indigo-600 hover:text-indigo-900">
                      {audit.company}
                    </Link>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Start date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {audit.date}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Due date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    {audit.dueDate}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      audit.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      audit.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {audit.status}
                    </span>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Completion</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          audit.status === 'Completed' ? 'bg-green-500' : 
                          audit.status === 'In Progress' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} 
                        style={{ width: `${audit.completion}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{audit.completion}%</span>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Expert</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    {audit.expert}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Framework</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{audit.framework}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{audit.description}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Progress Summary</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Current status of the audit questions.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <ClipboardCheck className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Questions</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Compliant</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.compliant}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                        <XCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Non-Compliant</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.nonCompliant}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Partial Compliance</dt>
                          <dd className="text-lg font-medium text-gray-900">{stats.partial}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">Completion Progress</h4>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="flex h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${(stats.compliant / stats.total) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500" 
                        style={{ width: `${(stats.partial / stats.total) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${(stats.nonCompliant / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Compliant ({Math.round((stats.compliant / stats.total) * 100)}%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                      <span>Partial ({Math.round((stats.partial / stats.total) * 100)}%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                      <span>Non-Compliant ({Math.round((stats.nonCompliant / stats.total) * 100)}%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
                      <span>Not Answered ({Math.round(((stats.total - stats.answered) / stats.total) * 100)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File upload sections for participant */}
          {user?.role === 'participant' && audit.status === 'In Progress' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Submit Audit Materials</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Upload your completed questionnaire and supporting documents
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  {/* Questionnaire upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Completed Questionnaire
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload completed questionnaire</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".xlsx"
                              onChange={handleQuestionnaireUpload}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">XLSX file only</p>
                      </div>
                    </div>
                  </div>

                  {/* Supporting documents upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Supporting Documents
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload supporting documents</span>
                            <input
                              type="file"
                              className="sr-only"
                              multiple
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">Any file type accepted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback section for expert */}
          {user?.role === 'expert' && audit.status === 'In Progress' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Feedback</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Provide feedback or request improvements
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <textarea
                  rows={4}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500  block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your feedback here..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Audit History</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Timeline of audit activities and submissions
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {audit.history.map((item) => (
                <li key={item.id} className="px-4 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <History className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.content}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                      {item.files && item.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {item.files.map((file, index) => (
                            <button
                              key={index}
                              onClick={() => handleDownloadFile(file)}
                              className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {file.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Results</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Summary of findings and recommendations.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900">Compliance Summary</h4>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Compliant Areas</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.compliant}</dd>
                            <dd className="text-sm text-gray-500">
                              {Math.round((stats.compliant / stats.total) * 100)}% of total
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                          <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Non-Compliant Areas</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.nonCompliant}</dd>
                            <dd className="text-sm text-gray-500">
                              {Math.round((stats.nonCompliant / stats.total) * 100)}% of total
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                          <AlertCircle className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Partial Compliance</dt>
                            <dd className="text-lg font-medium text-gray-900">{stats.partial}</dd>
                            <dd className="text-sm text-gray-500">
                              {Math.round((stats.partial / stats.total) * 100)}% of total
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900">Findings by Category</h4>
                <div className="mt-4">
                  {audit.categories.map((category) => {
                    const categoryQuestions = audit.questions.filter(q => q.category === category);
                    const compliant = categoryQuestions.filter(q => q.status === 'compliant').length;
                    const nonCompliant = categoryQuestions.filter(q => q.status === 'non-compliant').length;
                    const partial = categoryQuestions.filter(q => q.status === 'partial').length;
                    const notAnswered = categoryQuestions.filter(q => q.status === 'not-answered').length;
                    const total = categoryQuestions.length;
                    
                    return (
                      <div key={category} className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700">{category}</h5>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="flex h-2.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-green-500" 
                                style={{ width: `${(compliant / total) * 100}%` }}
                              ></div>
                              <div 
                                className="bg-yellow-500" 
                                style={{ width: `${(partial / total) * 100}%` }}
                              ></div>
                              <div 
                                className="bg-red-500" 
                                style={{ width: `${(nonCompliant / total) * 100}%` }}
                              ></div>
                              <div 
                                className="bg-gray-300" 
                                style={{ width: `${(notAnswered / total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>{compliant} Compliant</span>
                            <span>{partial} Partial</span>
                            <span>{nonCompliant} Non-Compliant</span>
                            <span>{notAnswered} Not Answered</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium text-gray-900">Key Recommendations</h4>
                <div className="mt-4 space-y-4">
                  {audit.questions
                    .filter(q => q.recommendation)
                    .map((question) => (
                      <div key={question.id} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {question.status === 'non-compliant' && (
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                  <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                              )}
                              {question.status === 'partial' && (
                                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <h5 className="text-sm font-medium text-gray-900">{question.question}</h5>
                              <p className="mt-1 text-sm text-gray-500">{question.category}</p>
                              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-700">{question.recommendation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {audit.questions.filter(q => q.recommendation).length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No recommendations have been provided yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditDetails;