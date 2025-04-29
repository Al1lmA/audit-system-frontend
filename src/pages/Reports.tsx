import React from 'react';
import { FileText } from 'lucide-react';

const Reports = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid gap-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Recent Reports</h2>
            <p className="text-gray-600">No reports generated yet. Create your first report to get started.</p>
          </div>
          
          <div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Generate New Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;