import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useDropzone } from 'react-dropzone';
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
  History,
  FileSpreadsheet,
  MessageSquare,
  Paperclip
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
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'history' | 'results'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedback, setFeedback] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [questionnaireFile, setQuestionnaireFile] = useState<File | null>(null);
  const [expertComment, setExpertComment] = useState('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  
  const [progressIndicators, setProgressIndicators] = useState({
    compliance: 75,
    security: 85,
    efficiency: 70,
    documentation: 80
  });

  const latestInteraction = {
    expert: {
      comment: "Please review section 3.2 and provide additional documentation for security controls",
      files: [
        { name: "security_requirements.pdf", size: "2.5MB" },
        { name: "compliance_checklist.xlsx", size: "1.1MB" }
      ],
      date: "2025-02-20"
    },
    participant: {
      comment: "Updated security controls documentation attached",
      files: [
        { name: "security_controls_updated.pdf", size: "3.2MB" },
        { name: "evidence_logs.zip", size: "5.5MB" }
      ],
      date: "2025-02-21"
    }
  };

  const { getRootProps: getResponseProps, getInputProps: getResponseInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setQuestionnaireFile(acceptedFiles[0]);
      }
    }
  });

  const { getRootProps: getSupportingProps, getInputProps: getSupportingInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    }
  });

  const { getRootProps: getReportProps, getInputProps: getReportInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setReportFile(acceptedFiles[0]);
      }
    }
  });

  const handleSubmitResponse = () => {
    console.log('Submitting response:', {
      comment: feedback,
      questionnaireFile,
      supportingFiles: selectedFiles
    });
  };

  const handleSubmitExpertFeedback = () => {
    console.log('Submitting expert feedback:', {
      comment: feedback,
      supportingFiles: selectedFiles
    });
  };

  const handleSaveResults = () => {
    console.log('Saving results:', {
      comment: expertComment,
      reportFile,
      progressIndicators
    });
  };

  const audit = {
    id: '1',
    name: 'Annual IT Infrastructure Audit',
    company: 'Acme Inc.',
    companyId: '1',
    date: '2025-02-15',
    dueDate: '2025-03-15',
    status: 'Planned',
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

  const filteredQuestions = selectedCategory === 'all' 
    ? audit.questions 
    : audit.questions.filter(q => q.category === selectedCategory);

  const stats = {
    total: audit.questions.length,
    answered: audit.questions.filter(q => q.status !== 'not-answered').length,
    compliant: audit.questions.filter(q => q.status === 'compliant').length,
    nonCompliant: audit.questions.filter(q => q.status === 'non-compliant').length,
    partial: audit.questions.filter(q => q.status === 'partial').length,
  };

  const handleStartAudit = () => {
    console.log('Starting audit:', id);
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
    console.log('Submitting for review:', {
      questionnaireFile,
      selectedFiles
    });
  };

  const handleSendFeedback = () => {
    console.log('Sending feedback:', feedback);
    setFeedback('');
  };

  const handleCompleteAudit = () => {
    console.log('Completing audit:', id);
    navigate('/audits');
  };

  const handleResponseChange = (questionId: string, value: string) => {
    console.log('Response updated for question', questionId, value);
  };

  const handleStatusChange = (questionId: string, status: AuditQuestion['status']) => {
    console.log('Status updated for question', questionId, status);
  };

  const handleEvidenceUpload = (questionId: string) => {
    console.log('Evidence upload for question', questionId);
  };

  const handleRecommendationChange = (questionId: string, value: string) => {
    console.log('Recommendation updated for question', questionId, value);
  };

  const handleDownloadFile = (file: { url: string; name: string }) => {
    console.log('Downloading file:', file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/audits" className="mr-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{audit.name}</h1>
        </div>
        <div className="flex space-x-3">
          {audit.status === 'Planned' && user?.role === 'expert' && (
            <button
              onClick={handleStartAudit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Start Audit
            </button>
          )}
          
          {audit.status === 'In Progress' && user?.role === 'participant' && (
            <button
              onClick={handleSubmitForReview}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit for Review
            </button>
          )}

          {audit.status === 'In Progress' && user?.role === 'expert' && (
            <>
              <button
                onClick={handleCompleteAudit}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Audit
              </button>
              <button
                onClick={handleSendFeedback}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </button>
            </>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${
              activeTab === 'responses'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('responses')}
          >
            Responses
          </button>
          <button
            className={`${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`${
              activeTab === 'results'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('results')}
          >
            Results & Recommendations
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Audit Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Details about this audit.</p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Audit name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{audit.name}</dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                    <Link to={`/companies/${audit.companyId}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                      {audit.company}
                    </Link>
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Start date</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                    {audit.date}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Due date</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                    {audit.dueDate}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      audit.status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                      audit.status === 'In Progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {audit.status}
                    </span>
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
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
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Expert</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                    <User className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                    {audit.expert}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Framework</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{audit.framework}</dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{audit.description}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Audit Questionnaire</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Download the questionnaire template for this audit
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="h-8 w-8 text-green-500 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">audit_questionnaire.xlsx</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Added by {audit.expert} on {audit.date}</p>
                </div>
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => console.log('Downloading questionnaire')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'responses' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Latest Interaction</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Most recent communication and files
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6 space-y-6">
                {user?.role === 'participant' ? (
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Expert Feedback</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{latestInteraction.expert.comment}</p>
                        <div className="mt-3 space-y-2">
                          {latestInteraction.expert.files.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Paperclip className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-gray-900 dark:text-white">{file.name}</span>
                              <span className="text-gray-500 dark:text-gray-400">({file.size})</span>
                              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Participant Response</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{latestInteraction.participant.comment}</p>
                        <div className="mt-3 space-y-2">
                          {latestInteraction.participant.files.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Paperclip className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-gray-900 dark:text-white">{file.name}</span>
                              <span className="text-gray-500 dark:text-gray-400">({file.size})</span>
                              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {user?.role === 'participant' ? 'Submit Response' : 'Provide Feedback'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                {user?.role === 'participant' 
                  ? 'Upload your completed questionnaire and supporting documents'
                  : 'Provide feedback on the participant\'s submission'}
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.role === 'participant' ? 'Additional Comments' : 'Feedback'}
                  </label>
                  <textarea
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    placeholder={user?.role === 'participant' 
                      ? 'Add any comments or notes about your submission...'
                      : 'Provide feedback on the submission...'}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                {user?.role === 'participant' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Completed Questionnaire
                    </label>
                    <div
                      {...getResponseProps()}
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
                    >
                      <div className="space-y-1 text-center">
                        <input {...getResponseInputProps()} />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload completed questionnaire</span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">XLSX file only</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Supporting Documents
                  </label>
                  <div
                    {...getSupportingProps()}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
                  >
                    <div className="space-y-1 text-center">
                      <input {...getSupportingInputProps()} />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload supporting documents</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, XLSX, ZIP files accepted</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={user?.role === 'participant' ? handleSubmitResponse : handleSubmitExpertFeedback}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {user?.role === 'participant' ? 'Submit Response' : 'Send Feedback'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Audit History</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Timeline of audit activities and submissions
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {audit.history.map((item) => (
                <li key={item.id} className="px-4 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <History className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.content}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                      {item.files && item.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {item.files.map((file, index) => (
                            <button
                              key={index}
                              onClick={() => handleDownloadFile(file)}
                              className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
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
          {user?.role === 'expert' ? (
            <>
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Audit Evaluation</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Provide final evaluation and recommendations
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-5 sm:p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Evaluation Comments
                      </label>
                      <textarea
                        rows={4}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        placeholder="Provide your overall evaluation and recommendations..."
                        value={expertComment}
                        onChange={(e) => setExpertComment(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Audit Report
                      </label>
                      <div
                        {...getReportProps()}
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
                      >
                        <div className="space-y-1 text-center">
                          <input {...getReportInputProps()} />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>Upload audit report</span>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PDF or DOCX file</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Performance Indicators
                      </label>
                      
                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Overall Compliance</label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{progressIndicators.compliance}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progressIndicators.compliance}
                          onChange={(e) => setProgressIndicators(prev => ({
                            ...prev,
                            compliance: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Security Measures</label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{progressIndicators.security}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progressIndicators.security}
                          onChange={(e) => setProgressIndicators(prev => ({
                            ...prev,
                            security: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Operational Efficiency</label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{progressIndicators.efficiency}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progressIndicators.efficiency}
                          onChange={(e) => setProgressIndicators(prev => ({
                            ...prev,
                            efficiency: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Documentation Quality</label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{progressIndicators.documentation}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progressIndicators.documentation}
                          onChange={(e) => setProgressIndicators(prev => ({
                            ...prev,
                            documentation: parseInt(e.target.value)
                          }))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveResults}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Results
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Audit Results</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Expert evaluation and recommendations
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-5 sm:p-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Expert Evaluation</h4>
                      <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{expertComment || 'No evaluation provided yet.'}</p>
                      </div>
                    </div>

                    {reportFile && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audit Report</h4>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{reportFile.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {(reportFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance Indicators</h4>
                      
                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Overall Compliance</label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{progressIndicators.compliance}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <div 
                            className="h-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg"
                            style={{ width: `${progressIndicators.compliance}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Security Measures</label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{progressIndicators.security}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <div 
                            className="h-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg"
                            style={{ width: `${progressIndicators.security}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Operational Efficiency</label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{progressIndicators.efficiency}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <div 
                            className="h-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg"
                            style={{ width: `${progressIndicators.efficiency}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Documentation Quality</label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{progressIndicators.documentation}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                          <div 
                            className="h-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg"
                            style={{ width: `${progressIndicators.documentation}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditDetails;