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
import { ArrowUpDown, Filter } from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('year');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Mock data
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Insights and trends from audit data
          </p>
        </div>
        <div className="flex space-x-4">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Security">Security</option>
            <option value="Compliance">Compliance</option>
            <option value="Data Management">Data Management</option>
            <option value="Business Continuity">Business Continuity</option>
          </select>
        </div>
      </div>

      {/* Compliance by Category */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Compliance by Category</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Breakdown of compliance status across different audit categories
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
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
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Compliance Score Trend</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Overall compliance score trend over time
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Issues by Category</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Distribution of non-compliant findings
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Recommendations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Top Recommendations</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Most frequent improvement recommendations
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {topRecommendations.map((recommendation) => (
                <li key={recommendation.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                          <span className="text-sm font-medium leading-none text-indigo-800">
                            {recommendation.id}
                          </span>
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{recommendation.recommendation}</div>
                        <div className="text-sm text-gray-500">{recommendation.category}</div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">AI-Generated Insights</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Intelligent analysis of audit data patterns
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {aiInsights.map((insight) => (
              <li key={insight.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">{insight.insight}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;