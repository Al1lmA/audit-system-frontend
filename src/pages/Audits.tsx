import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ClipboardCheck, Plus, Search, Eye, ArrowUpDown, Calendar } from 'lucide-react';
import { fetchAudits, fetchCompanies } from '../apiService';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'in progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершён' },
  { value: 'planned', label: 'Запланирован' },
];

const Audits = () => {
  const [searchParams] = useSearchParams();
  const companyIdFilter = searchParams.get('companyId');
  const { user } = useUser();
  const canCreateAudit = user?.role === 'expert' || user?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [audits, setAudits] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {};
    if (companyIdFilter) params.company = companyIdFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (dateRange.from) params.date_from = dateRange.from;
    if (dateRange.to) params.date_to = dateRange.to;
    if (searchTerm) params.search = searchTerm;

    fetchAudits(params)
      .then(data => setAudits(data))
      .catch(err => setError(err.message || 'Ошибка загрузки аудитов'))
      .finally(() => setLoading(false));
  }, [companyIdFilter, statusFilter, dateRange.from, dateRange.to, searchTerm]);

  useEffect(() => {
    fetchCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]));
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  let filteredAudits = audits
    .filter(audit => {
      const companyName =
        audit.company && typeof audit.company === 'object'
          ? audit.company.name
          : companies.find(c => String(c.id) === String(audit.company))?.name || '';

      const matchesSearch =
        audit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companyName.toLowerCase().includes(searchTerm.toLowerCase());

      // Исправленная фильтрация по статусу (всё в нижнем регистре)
      const matchesStatus =
        statusFilter === 'all' ||
        (audit.status && audit.status.toLowerCase() === statusFilter);

      const matchesDate =
        (!dateRange.from || audit.date >= dateRange.from) &&
        (!dateRange.to || audit.date <= dateRange.to);

      const matchesCompany = companyIdFilter
        ? String(
            audit.company && typeof audit.company === 'object'
              ? audit.company.id
              : audit.company
          ) === String(companyIdFilter)
        : true;

      if (user?.role === 'participant') {
        const userOrg = user.organization;
        return (
          matchesSearch &&
          matchesStatus &&
          matchesDate &&
          companyName === userOrg &&
          (audit.status === 'in progress' || audit.status === 'completed')
        );
      }

      return matchesSearch && matchesStatus && matchesDate && matchesCompany;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Аудиты</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {companyIdFilter
              ? 'Аудиты выбранной компании'
              : user?.role === 'participant'
              ? `Аудиты для ${user.organization}`
              : 'Управляйте аудитами и просматривайте информацию'}
          </p>
        </div>
        {canCreateAudit && (
          <Link
            to="/audits/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Новый аудит
          </Link>
        )}
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Поиск аудитов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.filter(
                opt => user?.role !== 'participant' || opt.value !== 'planned'
              ).map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            />
            <span className="text-gray-500 dark:text-gray-400">до</span>
            <input
              type="date"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Список аудитов */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        {loading && (
          <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            Загрузка...
          </div>
        )}
        {error && (
          <div className="px-6 py-4 text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('name')}
                  >
                    <span>Название аудита</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'name' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('company')}
                  >
                    <span>Компания</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'company' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('date')}
                  >
                    <span>Дата</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'date' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('status')}
                  >
                    <span>Статус</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'status' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Завершено
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleSort('expert')}
                  >
                    <span>Эксперт</span>
                    <ArrowUpDown className={`h-4 w-4 ${sortField === 'expert' ? 'text-indigo-500' : ''}`} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAudits.map((audit) => {
                const company =
                  audit.company && typeof audit.company === 'object'
                    ? audit.company
                    : companies.find(c => String(c.id) === String(audit.company));
                const expertName =
                  audit.expert && typeof audit.expert === 'object'
                    ? audit.expert.username
                    : audit.expert;
                return (
                  <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <ClipboardCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            <Link to={`/audits/${audit.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                              {audit.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {company ? (
                          <Link to={`/companies/${company.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                            {company.name}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {audit.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        audit.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                        audit.status === 'in progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      }`}>
                        {audit.status === 'completed'
                          ? 'Завершён'
                          : audit.status === 'in progress'
                          ? 'В процессе'
                          : 'Запланирован'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            audit.status === 'completed' ? 'bg-green-500 dark:bg-green-600' : 
                            audit.status === 'in progress' ? 'bg-yellow-500 dark:bg-yellow-600' :
                            'bg-blue-500 dark:bg-blue-600'
                          }`} 
                          style={{ width: `${audit.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{audit.completion}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {expertName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link to={`/audits/${audit.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                          <Eye className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredAudits.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
            Аудиты по заданным критериям не найдены.
          </div>
        )}
      </div>
    </div>
  );
};

export default Audits;
