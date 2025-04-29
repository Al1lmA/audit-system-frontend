import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Upload
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'results'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock data - in a real app, this would be fetched from an API
  const audit = {
    id: '1',
    name: 'Annual IT Infrastructure Audit',
    company: 'Acme Inc.',
    companyId: '1',
    date: '2025-02-15',
    dueDate: '2025-03-15',
    status: 'In Progress',
    completion: 65,
    expert: 'John Expert',
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
    ] as AuditQuestion[]
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/audits" className="mr-4 text-indigo-600 hover:text-indigo-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">{audit.name}</h1>
        </div>
        <div className="flex space-x-3">
          {audit.status === 'In Progress' && (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => console.log('Complete audit')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Audit
            </button>
          )}
          {audit.status === 'Completed' && (
            <Link
              to={`/reports/${id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Link>
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
              activeTab === 'questions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('questions')}
          >
            Audit Questions
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

      {/* Overview Tab */}
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
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Audit Questions</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {selectedCategory === 'all' 
                    ? 'All audit questions' 
                    : `Questions for ${selectedCategory} category`}
                </p>
              </div>
              <div>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {audit.categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {filteredQuestions.map((question) => (
                  <li key={question.id} className="px-4 py-5 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {question.status === 'compliant' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {question.status === 'non-compliant' && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {question.status === 'partial' && (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        {question.status === 'not-answered' && (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{question.question}</p>
                          <p className="text-sm text-gray-500">{question.category}</p>
                        </div>
                        
                        {/* Response field */}
                        <div className="mt-3">
                          <label htmlFor={`response-${question.id}`} className="block text-sm font-medium text-gray-700">
                            Response
                          </label>
                          <div className="mt-1">
                            <textarea
                              id={`response-${question.id}`}
                              name={`response-${question.id}`}
                              rows={3}
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Enter response..."
                              value={question.response || ''}
                              onChange={(e) => handleResponseChange(question.id, e.target.value)}
                              disabled={user?.role !== 'participant'}
                            ></textarea>
                          </div>
                        </div>
                        
                        {/* Status and evidence */}
                        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor={`status-${question.id}`} className="block text-sm font-medium text-gray-700">
                              Compliance Status
                            </label>
                            <select
                              id={`status-${question.id}`}
                              name={`status-${question.id}`}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              value={question.status}
                              onChange={(e) => handleStatusChange(question.id, e.target.value as AuditQuestion['status'])}
                              disabled={user?.role !== 'expert'}
                            >
                              <option value="not-answered">Not Answered</option>
                              <option value="compliant">Compliant</option>
                              <option value="non-compliant">Non-Compliant</option>
                              <option value="partial">Partial Compliance</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Evidence
                            </label>
                            <div className="mt-1 flex items-center">
                              {question.evidence ? (
                                <div className="flex items-center">
                                  <a 
                                    href="#" 
                                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      console.log('Download evidence:', question.evidence);
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    {question.evidence}
                                  </a>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  onClick={() => handleEvidenceUpload(question.id)}
                                  disabled={user?.role !== 'participant'}
                                >
                                  <Upload className="h-4 w-4 mr-1" />
                                  Upload Evidence
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Recommendation field */}
                        {(user?.role === 'expert' || question.recommendation) && (
                          <div className="mt-3">
                            <label htmlFor={`recommendation-${question.id}`} className="block text-sm font-medium text-gray-700">
                              Recommendation
                            </label>
                            <div className="mt-1">
                              <textarea
                                id={`recommendation-${question.id}`}
                                name={`recommendation-${question.id}`}
                                rows={2}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Enter recommendation..."
                                value={question.recommendation || ''}
                                onChange={(e) => handleRecommendationChange(question.id, e.target.value)}
                                disabled={user?.role !== 'expert'}
                              ></textarea>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {filteredQuestions.length === 0 && (
                <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                  No questions found for the selected category.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Tab */}
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