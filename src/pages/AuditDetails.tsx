import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAudit } from '../apiService';
import { fetchAuditHistory } from '../apiService';
import { fetchAuditInteractions, postInteraction, fetchCSRFToken } from '../apiService';
import { useUser } from '../contexts/UserContext';
import { useDropzone } from 'react-dropzone';
import { getCSRFToken } from '../apiService'; 
import {
  Building2,
  Calendar,
  User,
  ArrowLeft,
  FileSpreadsheet,
  Download,
  History as HistoryIcon,
  Send,
  MessageSquare,
  Paperclip,
} from 'lucide-react';

const AuditDetails: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'history'>('overview');

  // --- Только для overview ---
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Только для history ---
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // --- Только для responses ---
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [errorResponses, setErrorResponses] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);




  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      // Извлекаем имя файла из URL (например: "interactions/Жданова_ИУ5-74Б_ЛР-8.docx")
      const filePath = fileUrl.split('/media/')[1]; 
      const encodedFilePath = encodeURIComponent(filePath);
  
      // Формируем запрос к Django
      const response = await fetch(
        `/api/download/${encodedFilePath}/`, 
        {
          credentials: 'include',
          method: 'GET'
        }
      );
  
      if (!response.ok) throw new Error('Ошибка загрузки');
      
      // Скачиваем файл
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Ошибка скачивания:', err);
      alert('Не удалось скачать файл');
    }
  };

 
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
  
  
  // Функция загрузки взаимодействий
  const loadInteractions = async () => {
    setLoadingResponses(true);
    try {
      const response = await fetch(`/api/audits/${id}/timeline/`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Ошибка загрузки взаимодействий');
      const data = await response.json();
      setInteractions(data);
    } catch (err) {
      setErrorResponses(err.message);
    } finally {
      setLoadingResponses(false);
    }
  };


  // Функция отправки ответа участника
  const handleSubmitResponse = async () => {
    setIsSubmitting(true);
    try {
      // Сначала получите CSRF-токен
      await fetchCSRFToken();
      const csrftoken = getCSRFToken();
      
      if (!csrftoken) {
        throw new Error('CSRF токен не найден. Пожалуйста, перезагрузите страницу');
      }

      const formData = new FormData();
      formData.append('audit', id);
      formData.append('participant_comment', feedback);
      
      if (questionnaireFile) {
        formData.append('questionnaire_file', questionnaireFile);
      }
      
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);  // Имя поля должно совпадать с сериализатором
      });

      const response = await fetch('/api/interactions/add_comment/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrftoken  // Правильно передаем токен
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка отправки');
      }

      await loadInteractions();
      setFeedback('');
      setSelectedFiles([]);
      setQuestionnaireFile(null);
    } catch (err) {
      console.error('Ошибка отправки:', err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция отправки фидбека эксперта
  const handleSubmitExpertFeedback = async () => {
    setIsSubmitting(true);
    try {
      // 1. Гарантируем, что CSRF-токен установлен в cookies
      await fetchCSRFToken(); // этот вызов установит куку csrftoken, если её нет
  
      const csrftoken = getCSRFToken();
      if (!csrftoken) {
        alert('CSRF-токен не найден. Обновите страницу или выполните GET-запрос к API!');
        setIsSubmitting(false);
        return;
      }
  
      const formData = new FormData();
      formData.append('audit', id);
      formData.append('expert_comment', feedback);
  
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);  // Имя поля должно совпадать с сериализатором
      });
  
      const response = await fetch('/api/interactions/add_comment/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrftoken
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка отправки фидбека');
      }
  
      await loadInteractions();
      setFeedback('');
      setSelectedFiles([]);
    } catch (err) {
      console.error('Ошибка отправки фидбека:', err);
      alert(err.message || 'Не удалось отправить фидбек');
    } finally {
      setIsSubmitting(false);
    }
  };



  // Обновите кнопку отправки:
  <button
    type="button"
    onClick={user?.role === 'participant' ? handleSubmitResponse : handleSubmitExpertFeedback}
    disabled={isSubmitting}
    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
  >
    <Send className="h-4 w-4 mr-2" />
    {isSubmitting ? 'Отправка...' : user?.role === 'participant' ? 'Отправить ответ' : 'Отправить фидбек'}
  </button>

  // Функция скачивания файла
  // const handleDownloadFile = async (fileUrl: string) => {
  //   try {
  //     const filePath = fileUrl.split('/media/')[1];
  //     const encodedFilePath = encodeURIComponent(filePath);
      
  //     const response = await fetch(
  //       `/api/download/${encodedFilePath}/`, 
  //       { credentials: 'include' }
  //     );

  //     if (!response.ok) throw new Error('Ошибка загрузки файла');
      
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = filePath.split('/').pop() || 'file';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error('Download failed:', err);
  //     alert('Не удалось скачать файл');
  //   }
  // };

  // Эффект для загрузки данных при открытии вкладки
  useEffect(() => {
    fetchCSRFToken().catch(console.error);
    if (activeTab === 'responses') {
      loadInteractions();
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    fetchAudit(id)
      .then(setAudit)
      .catch((err) => setError(err.message || 'Ошибка загрузки аудита'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (activeTab === 'history' && id) {
      setHistoryLoading(true);
      fetchAuditHistory(id)
        .then(data => {
          setHistory(data);
          setHistoryLoading(false);
        })
        .catch(err => {
          setHistoryError(err.message);
          setHistoryLoading(false);
        });
    }
  }, [activeTab, id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!audit) return <div>Аудит не найден</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/audits" className="mr-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{audit.name}</h1>
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
          {/* <button
            className={`${
              activeTab === 'results'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('results')}
          >
            Results & Recommendations
          </button> */}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Информация об аудите</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Детали аудита</p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <dl>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Название аудита</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{audit.name}</dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Компания</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                    {typeof audit.company === 'object' ? audit.company.name : audit.company}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Дата</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                    {audit.date}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Статус</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      audit.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 
                      audit.status === 'in_progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}>
                      {audit.status}
                    </span>
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Эксперт</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex items-center">
                    <User className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                    {audit.expert && typeof audit.expert === 'object' ? audit.expert.username : audit.expert}
                  </dd>
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Оценка (score)</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {audit.score !== null && audit.score !== undefined ? `${audit.score}%` : '-'}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Описание</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                    {audit.description || '-'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {audit.questionnaire_file && (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Файл анкеты</h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-500 dark:text-green-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {typeof audit.questionnaire_file === 'string'
                        ? audit.questionnaire_file.split('/').pop()
                        : 'Скачать анкету'}
                    </p>
                  </div>
                  <a
                    href={typeof audit.questionnaire_file === 'string'
                      ? audit.questionnaire_file
                      : audit.questionnaire_file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Скачать
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* {activeTab === 'results' && (
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
      )} */}

      {activeTab === 'responses' && (
        <div className="space-y-6">
          {/* Секция последнего взаимодействия */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Последнее взаимодействие</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Хронология комментариев и файлов
              </p>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700">
              {interactions.slice(-1).map(interaction => (
                <div key={interaction.id} className="px-4 py-5 sm:p-6 space-y-6">
                  {/* Блок эксперта */}
                  {interaction.expert_comment && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Комментарий эксперта</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{interaction.expert_comment}</p>
                          {interaction.files && (
                            <div className="mt-3 space-y-2">
                              {interaction.files && (
                                <div className="mt-3 space-y-2">
                                  {/* Преобразуем files в массив и фильтруем null/undefined */}
                                  {(Array.isArray(interaction.files) 
                                    ? interaction.files 
                                    : [interaction.files].filter(Boolean)
                                  ).map((file, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                      <Paperclip className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                      <button
                                        onClick={() => handleDownloadFile(file.url, file.name)}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                      >
                                        {file.name}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Блок участника */}
                  {interaction.participant_comment && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Комментарий участника</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{interaction.participant_comment}</p>
                          {interaction.files && (
                            <div className="mt-3 space-y-2">
                              {interaction.files && (
                                <div className="mt-3 space-y-2">
                                  {/* Преобразуем files в массив и фильтруем null/undefined */}
                                  {(Array.isArray(interaction.files) 
                                    ? interaction.files 
                                    : [interaction.files].filter(Boolean)
                                  ).map((file, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                      <Paperclip className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                      <button
                                        onClick={() => handleDownloadFile(file.url, file.name)}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                      >
                                        {file.name}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Форма отправки ответа/фидбека */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {user?.role === 'participant' ? 'Отправить ответ' : 'Оставить фидбек'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                {user?.role === 'participant' 
                  ? 'Загрузите заполненную анкету и документы'
                  : 'Оставьте комментарий и прикрепите файлы'}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6 space-y-6">
                {/* Поле для комментария */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.role === 'participant' ? 'Комментарий' : 'Фидбек'}
                  </label>
                  <textarea
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder={user?.role === 'participant' 
                      ? 'Добавьте комментарий к вашей отправке...'
                      : 'Оставьте фидбек по отправке участника...'}
                  />
                </div>

                {/* Загрузка файлов */}
                {user?.role === 'participant' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Заполненная анкета
                    </label>
                    <div
                      {...getResponseProps()}
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
                    >
                      <div className="space-y-1 text-center">
                        <input {...getResponseInputProps()} />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Загрузить анкету</span>
                          </label>
                        </div>
                        {questionnaireFile && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            {questionnaireFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Поддерживающие документы */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Поддерживающие документы
                  </label>
                  <div
                    {...getSupportingProps()}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
                  >
                    <div className="space-y-1 text-center">
                      <input {...getSupportingInputProps()} />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Загрузить документы</span>
                        </label>
                      </div>
                      {selectedFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {selectedFiles.map((file, index) => (
                            <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
                              {file.name}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Кнопка отправки */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={user?.role === 'participant' ? handleSubmitResponse : handleSubmitExpertFeedback}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Отправка...' : 
                      user?.role === 'participant' ? 'Отправить ответ' : 'Отправить фидбек'}
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
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">История аудита</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Хронология действий эксперта и участника
            </p>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.length === 0 ? (
                <li className="p-4 text-gray-500">Нет истории для этого аудита</li>
              ) : (
                history.map((item) => {
                  // files может быть строкой (один файл), массивом или null
                  let files: { name: string; url: string }[] = [];
                  if (typeof item.files === 'string') {
                    files = [{
                      name: decodeURIComponent(item.files.split('/').pop() || 'file'),
                      url: item.files
                    }];
                  } else if (Array.isArray(item.files)) {
                    files = item.files;
                  }

                  return (
                    <li key={item.id} className="px-4 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <HistoryIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="flex-1">
                          {item.expert_comment && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Комментарий эксперта:</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.expert_comment}</p>
                            </div>
                          )}
                          {item.participant_comment && (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Комментарий участника:</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.participant_comment}</p>
                            </div>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(item.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {files.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {files.map((file, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleDownloadFile(file.url, file.name)}
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
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditDetails;