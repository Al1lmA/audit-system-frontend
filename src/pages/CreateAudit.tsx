import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useDropzone } from 'react-dropzone';
import { 
  fetchCompanies,
  fetchParticipantsByCompany,
  createAudit,
  fetchCSRFToken
} from '../apiService';
import { toast } from 'react-toastify';
import { Calendar, Building2, User, Upload, FileSpreadsheet } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  company: string;
}

const CreateAudit: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    framework: '',
    objective: '',
    company_id: '',
    participant_id: '',
    questionnaire: null as File | null
  });

  // Загрузка компаний
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        toast.error('Ошибка загрузки компаний');
      }
    };
    loadCompanies();
  }, []);

  // Загрузка участников при выборе компании
  useEffect(() => {
    if (!formData.company_id) {
      setParticipants([]);
      return;
    }
    fetchParticipantsByCompany(formData.company_id)
      .then(data => {
        // Фильтруем по роли, если API не умеет
        setParticipants(Array.isArray(data) ? data.filter(u => u.role === 'participant') : []);
      })
      .catch(err => {
        toast.error('Не удалось загрузить список участников');
        setParticipants([]);
      });
  }, [formData.company_id]);
  

  // Обработка загрузки файла
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

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetchCSRFToken();
      
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('start_date', new Date(formData.start_date).toISOString());
      formPayload.append('end_date', new Date(formData.end_date).toISOString());
      formPayload.append('framework', formData.framework);
      formPayload.append('objective', formData.objective);
      formPayload.append('company', formData.company_id);
      formPayload.append('participant', formData.participant_id);
      if (formData.questionnaire) {
        formPayload.append('questionnaire', formData.questionnaire);
      }

      await createAudit(formPayload);
      toast.success('Аудит успешно создан!');
      navigate('/audits');
    } catch (error) {
      toast.error(error.message || 'Ошибка при создании аудита');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Создание нового аудита</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Заполните основные данные аудита и загрузите документы
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основные данные */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Основные данные</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Название аудита
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Дата начала
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Планируемая дата завершения
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 rounded-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Стандарт аудита (опционально)
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={formData.framework}
                onChange={(e) => setFormData(prev => ({ ...prev, framework: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Цели аудита
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={formData.objective}
                onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        {/* Участники аудита */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Участники аудита</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Организация
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={formData.company_id}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  company_id: e.target.value,
                  participant_id: ''
                }))}
                required
              >
                <option value="">Выберите организацию</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Представитель организации
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                value={formData.participant_id}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  participant_id: e.target.value
                }))}
                disabled={!formData.company_id}
                required
              >
                <option value="">Выберите представителя</option>
                {participants.map(participant => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name} ({participant.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Загрузка документов */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Документы аудита</h2>
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
                        ? 'Отпустите для загрузки'
                        : 'Перетащите или выберите файл анкеты'}
                    </span>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Поддерживаемые форматы: .xlsx
              </p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/audits')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать аудит'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAudit;
