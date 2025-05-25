import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchCompanies } from '../apiService'; // Импортируй свою функцию

interface UserFormData {
  username: string;
  email: string;
  role: 'expert' | 'participant' | 'admin';
  organization?: string;
  password?: string;
  confirmPassword?: string;
}

interface Company {
  id: string;
  name: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  initialData?: Omit<UserFormData, 'password' | 'confirmPassword'>;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<UserFormData>({
    defaultValues: initialData,
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  const password = watch('password');
  const role = watch('role');

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Полное имя
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              {...register('username', { required: 'Полное имя обязательно' })}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              {...register('email', {
                required: 'Email обязателен',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некорректный email',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Роль
            </label>
            <select
              id="role"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              {...register('role', { required: 'Роль обязательна' })}
            >
              <option value="">Выберите роль</option>
              <option value="expert">Эксперт</option>
              <option value="participant">Участник</option>
              <option value="admin">Администратор</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {role === 'participant' && (
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Организация
              </label>
              {loadingCompanies ? (
                <div className="text-sm text-gray-500">Загрузка компаний...</div>
              ) : companiesError ? (
                <div className="text-sm text-red-600">{companiesError}</div>
              ) : (
                <select
                  id="organization"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  {...register('organization', {
                    required: role === 'participant' ? 'Для участников обязательна организация' : false,
                  })}
                >
                  <option value="">Выберите организацию</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.organization && (
                <p className="mt-1 text-sm text-red-600">{errors.organization.message}</p>
              )}
            </div>
          )}

          {!isEdit && (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  {...register('password', {
                    required: !isEdit ? 'Пароль обязателен' : false,
                    minLength: {
                      value: 6,
                      message: 'Пароль должен быть не менее 6 символов',
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Подтвердите пароль
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  {...register('confirmPassword', {
                    required: !isEdit ? 'Пожалуйста, подтвердите пароль' : false,
                    validate: (value) =>
                      !value || !password || value === password || 'Пароли не совпадают',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {isEdit ? 'Обновить пользователя' : 'Добавить пользователя'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
