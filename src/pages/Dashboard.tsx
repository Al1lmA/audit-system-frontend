import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { ClipboardCheck, Building2, FileText, BarChart4, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchDashboardStats, fetchRecentAudits } from '../apiService';

const Dashboard: React.FC = () => {
  const { user } = useUser();

  const [stats, setStats] = useState([
    { name: 'Total Companies', value: '-', icon: Building2, color: 'bg-blue-500 dark:bg-blue-600', link: '/companies' },
    { name: 'Active Audits', value: '-', icon: ClipboardCheck, color: 'bg-green-500 dark:bg-green-600', link: '/audits' },
    { name: 'Completed Audits', value: '-', icon: FileText, color: 'bg-purple-500 dark:bg-purple-600', link: '/reports' },
    { name: 'Improvement Areas', value: '-', icon: BarChart4, color: 'bg-yellow-500 dark:bg-yellow-600', link: '/analytics' },
  ]);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Загрузка статистики
    fetchDashboardStats()
      .then(data => {
        setStats([
          { name: 'Всего компаний', value: data.total_companies, icon: Building2, color: 'bg-blue-500 dark:bg-blue-600', link: '/companies' },
          { name: 'Активные аудиты', value: data.active_audits, icon: ClipboardCheck, color: 'bg-green-500 dark:bg-green-600', link: '/audits' },
          { name: 'Завершённые аудиты', value: data.completed_audits, icon: FileText, color: 'bg-purple-500 dark:bg-purple-600', link: '/reports' },
          { name: 'Зоны для улучшения', value: data.improvement_areas, icon: BarChart4, color: 'bg-yellow-500 dark:bg-yellow-600', link: '/analytics' },
        ]);
      })
      .catch(() => setStats(stats));

    // Загрузка последних аудитов
    const params: any = user?.role === 'participant'
      ? { participant: user.id }
      : { recent: 'true' };
    fetchRecentAudits(params)
      .then(data => setRecentAudits(data))
      .catch(() => setRecentAudits([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Дашборд</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Добро пожаловать, {user?.username}!
          {user?.role === 'participant' && user?.organization && (
            <span className="ml-1">({user.organization})</span>
          )}
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats
          .filter(stat => user?.role === 'participant' ? stat.name !== 'Total Companies' : true)
          .map((stat) => (
            <Link
              key={stat.name}
              to={stat.link}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Последние аудиты */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Последние аудиты</h2>
          <Link to="/audits" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            Смотреть все
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Компания</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Завершение</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentAudits.map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{audit.company_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      audit.status === 'Completed' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {audit.status === 'Completed' ? 'Завершён' : 'В процессе'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {audit.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          audit.status === 'Completed' 
                            ? 'bg-green-500 dark:bg-green-600' 
                            : 'bg-yellow-500 dark:bg-yellow-600'
                        }`} 
                        style={{ width: `${audit.completion || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{audit.completion || 0}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentAudits.length === 0 && !loading && (
          <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            Последние аудиты не найдены.
          </div>
        )}
      </div>

      {/* Quick Actions ... (оставьте как есть) */}
    </div>
  );
};

export default Dashboard;
