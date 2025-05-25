import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ClipboardCheck, Search } from 'lucide-react';
import { fetchCompanies, registerUser } from '../apiService';
import { getCookie } from '../utils/csrf';


// Кастомный хук для закрытия дропдауна
const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'expert' | 'participant';
  organization?: string;
}

interface Company {
  id: string;
  name: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormData>();
  const password = watch('password');
  const role = watch('role');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/csrf/', {
      credentials: 'include'
    });
  }, []);

  useClickOutside(dropdownRef, () => setShowCompanyDropdown(false));

  // Загрузка компаний с бэка
  useEffect(() => {
    const loadCompanies = async () => {
      setLoadingCompanies(true);
      setCompaniesError(null);
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (err: any) {
        setCompaniesError(err.message || 'Ошибка загрузки компаний');
      } finally {
        setLoadingCompanies(false);
      }
    };
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
  
    if (data.role === 'participant' && !data.organization) {
      setError('Organization is required for participants');
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    
    const csrfToken = getCookie('csrftoken');

    try {
      const response = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',  'X-CSRFToken': csrfToken,},
        body: JSON.stringify({
          username: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          organization: data.role === 'participant' ? data.organization : null,
        }),
        credentials: 'include',
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Registration failed');
      }
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <ClipboardCheck className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Создайте новый аккаунт
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Или{' '}
            <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
              войдите в существующий аккаунт
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="name" className="sr-only">
                Полное имя
              </label>
              <input
                id="name"
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 sm:text-sm"
                placeholder="Полное имя"
                {...register('name', { required: 'Имя обязательно' })}
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Электронная почта
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 sm:text-sm"
                placeholder="Электронная почта"
                {...register('email', {
                  required: 'Электронная почта обязательна',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Некорректный адрес электронной почты'
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 sm:text-sm"
                placeholder="Пароль"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Пароль должен содержать не менее 6 символов'
                  }
                })}
              />
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="sr-only">
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 sm:text-sm"
                placeholder="Подтвердите пароль"
                {...register('confirmPassword', {
                  required: 'Пожалуйста, подтвердите пароль',
                  validate: value => value === password || 'Пароли не совпадают'
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Роль
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="expert"
                    type="radio"
                    value="expert"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
                    {...register('role', { required: 'Пожалуйста, выберите роль' })}
                  />
                  <label htmlFor="expert" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Эксперт
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="participant"
                    type="radio"
                    value="participant"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
                    {...register('role', { required: 'Пожалуйста, выберите роль' })}
                  />
                  <label htmlFor="participant" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Участник
                  </label>
                </div>
              </div>
              {errors.role && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.role.message}</p>
              )}
            </div>
            {role === 'participant' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Организация
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Поиск организации..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowCompanyDropdown(true);
                    }}
                    onFocus={() => setShowCompanyDropdown(true)}
                  />
                  {showCompanyDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                    >
                      {loadingCompanies ? (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          Загрузка организаций...
                        </div>
                      ) : companiesError ? (
                        <div className="px-4 py-2 text-sm text-red-600 dark:text-red-400">
                          {companiesError}
                        </div>
                      ) : (
                        <>
                          {filteredCompanies.map((company) => (
                            <button
                              key={company.id}
                              type="button"
                              className="w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => {
                                setValue('organization', company.id);
                                setSearchTerm(company.name);
                                setShowCompanyDropdown(false);
                              }}
                            >
                              {company.name}
                            </button>
                          ))}
                          {filteredCompanies.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                              Организации не найдены
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                {errors.organization && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.organization.message}</p>
                )}
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm text-center">{error}</div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
