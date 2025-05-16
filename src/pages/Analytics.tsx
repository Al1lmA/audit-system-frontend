import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Upload, FileSpreadsheet, X, Download } from 'lucide-react';

const Analytics: React.FC = () => {

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Mock data for charts
  const complianceByCategory = [
    { name: 'Infrastructure', compliant: 65, nonCompliant: 20, partial: 15 },
    { name: 'Security', compliant: 45, nonCompliant: 35, partial: 20 },
    { name: 'Compliance', compliant: 70, nonCompliant: 10, partial: 20 },
    { name: 'Data Management', compliant: 55, nonCompliant: 25, partial: 20 },
    { name: 'Business Continuity', compliant: 40, nonCompliant: 40, partial: 20 },
  ];

  const complianceTrend = [
    { month: 'Jan', score: 68 },
    { month: 'Feb', score: 70 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 73 },
    { month: 'Jun', score: 78 },
    { month: 'Jul', score: 80 },
    { month: 'Aug', score: 82 },
    { month: 'Sep', score: 85 },
    { month: 'Oct', score: 87 },
    { month: 'Nov', score: 88 },
    { month: 'Dec', score: 90 },
  ];

  const issuesByCategory = [
    { name: 'Infrastructure', value: 15 },
    { name: 'Security', value: 35 },
    { name: 'Compliance', value: 10 },
    { name: 'Data Management', value: 25 },
    { name: 'Business Continuity', value: 15 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const topRecommendations = [
    { id: 1, category: 'Security', recommendation: 'Implement multi-factor authentication for all administrative accounts', frequency: 12 },
    { id: 2, category: 'Data Management', recommendation: 'Establish a formal data retention policy', frequency: 10 },
    { id: 3, category: 'Infrastructure', recommendation: 'Implement automated asset inventory system', frequency: 8 },
    { id: 4, category: 'Business Continuity', recommendation: 'Test disaster recovery plan quarterly', frequency: 7 },
    { id: 5, category: 'Compliance', recommendation: 'Document all data processing activities', frequency: 6 },
  ];

  const aiInsights = [
    { id: 1, insight: 'Security vulnerabilities have increased by 15% in the last quarter, primarily in cloud infrastructure.' },
    { id: 2, insight: 'Companies with regular security awareness training show 30% fewer security incidents.' },
    { id: 3, insight: 'Data management maturity correlates strongly with overall IT governance scores.' },
    { id: 4, insight: 'Organizations implementing the top 3 recommendations see an average 25% improvement in compliance scores within 6 months.' },
  ];

  // Add file upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
      // Here you would process the file
      console.log('File uploaded:', event.target.files[0]);
    }
  };

  const handleGenerateReport = () => {
    // In a real application, this would generate a PDF report with the analytics data
    console.log('Generating report based on uploaded data');
    
    // Mock PDF generation and download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Analytics Report'));
    element.setAttribute('download', 'analytics_report.pdf');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload data for analysis and view insights
          </p>
        </div>
        <div className="flex space-x-4">
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload XLSX
            <input
              type="file"
              className="hidden"
              accept=".xlsx"
              onChange={handleFileUpload}
            />
          </label>
          {uploadedFile && (
            <>
              <button
                onClick={handleGenerateReport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </button>
            </>
          )}
        </div>
      </div>

      {/* Show uploaded file info if present */}
      {uploadedFile && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-900 dark:text-white">{uploadedFile.name}</span>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {!uploadedFile ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Upload Data for Analysis</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Upload an XLSX file to view detailed analytics and insights.
          </p>
          <label className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Select File
            <input
              type="file"
              className="hidden"
              accept=".xlsx"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      ) : (
        <>
          {/* Compliance by Category */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Compliance by Category</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Breakdown of compliance status across different audit categories
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={complianceByCategory}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.375rem',
                        color: '#F3F4F6'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="compliant" stackId="a" fill="#4ade80" name="Compliant" />
                    <Bar dataKey="partial" stackId="a" fill="#facc15" name="Partial" />
                    <Bar dataKey="nonCompliant" stackId="a" fill="#f87171" name="Non-Compliant" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Compliance Trend */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Compliance Score Trend</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Overall compliance score trend over time
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={complianceTrend}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.375rem',
                        color: '#F3F4F6'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} name="Compliance Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Two-column layout for smaller charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Issues by Category */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Issues by Category</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Distribution of non-compliant findings
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={issuesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {issuesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '0.375rem',
                          color: '#F3F4F6'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Recommendations */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Top Recommendations</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Most frequent improvement recommendations
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {topRecommendations.map((recommendation) => (
                    <li key={recommendation.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900">
                              <span className="text-sm font-medium leading-none text-indigo-800 dark:text-indigo-200">
                                {recommendation.id}
                              </span>
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{recommendation.recommendation}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{recommendation.category}</div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            {recommendation.frequency} occurrences
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">AI-Generated Insights</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Intelligent analysis of audit data patterns
              </p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {aiInsights.map((insight) => (
                  <li key={insight.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <svg className="h-5 w-5 text-purple-600 dark:text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-900 dark:text-white">{insight.insight}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;