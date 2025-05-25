import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '../contexts/UserContext';
import { User, Mail, Building2, Phone, Edit, Save, X, Key } from 'lucide-react';
import { updateUser, fetchCompanies, changeUserPassword } from '../apiService';

interface Company {
  id: string;
  name: string;
}

const Profile: React.FC = () => {
  const { user, updateUser: updateContextUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  const role = user?.role;

  useEffect(() => {
    // Подтянуть компании для отображения названия организации
    if (role === 'participant') {
      fetchCompanies()
        .then(setCompanies)
        .catch(() => setCompanies([]));
    }
    // При входе в режим редактирования обновляем значения формы
    if (isEditing && user) {
      reset({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [isEditing, user, role, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await updateUser(user!.id, {
        username: data.username,
        email: data.email,
        phone: data.phone,
        role: user!.role,
        organization: user!.organization,
      });
      updateContextUser(updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  // --- Смена пароля ---
  const { register: registerPw, handleSubmit: handleSubmitPw, reset: resetPw, formState: { errors: pwErrors } } = useForm();
  const onChangePassword = async (data: any) => {
    setPasswordError(null);
    setPasswordSuccess(null);
    if (data.new_password !== data.confirm_password) {
      setPasswordError('Новые пароли не совпадают');
      return;
    }
    try {
      await changeUserPassword(user!.id, {
        old_password: data.old_password,
        new_password: data.new_password,
      });
      setPasswordSuccess('Пароль успешно изменён');
      resetPw();
    } catch (err: any) {
      setPasswordError(err.message || 'Ошибка смены пароля');
    }
  };

  // Получить название организации по id
  const getOrganizationName = () => {
    if (!user?.organization) return 'Not specified';
    const org = companies.find(c => c.id === user.organization);
    return org ? org.name : user.organization;
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Профиль</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать профиль
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              <X className="h-4 w-4 mr-2" />
              Отмена
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Информация об аккаунте
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {isEditing ? 'Редактируйте личные данные' : 'Личные данные'}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {/* Username */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Имя пользователя</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input
                      {...register('username', { required: 'Имя пользователя обязательно' })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  ) : (
                    user?.username
                  )}
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                  )}
                </dd>
              </div>
              {/* Email */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Электронная почта</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  {isEditing ? (
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Электронная почта обязательна',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Некорректный адрес электронной почты'
                        }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  ) : (
                    <>
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {user?.email}
                    </>
                  )}
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </dd>
              </div>
              {/* Phone */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Телефон</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  {isEditing ? (
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Введите номер телефона"
                    />
                  ) : (
                    <>
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {user?.phone || 'Не указано'}
                    </>
                  )}
                </dd>
              </div>
              {/* Role */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Роль</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    {user?.role}
                  </div>
                </dd>
              </div>
              {/* Organization (только для чтения всегда) */}
              {role === 'participant' && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Организация</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                    {getOrganizationName()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </form>
      {/* --- Смена пароля --- */}
      {isEditing && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Key className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">Смена пароля</h3>
          </div>
          <form onSubmit={handleSubmitPw(onChangePassword)}>
            <div className="border-t border-gray-200 px-4 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Текущий пароль</label>
                <input
                  type="password"
                  {...registerPw('old_password', { required: 'Текущий пароль обязателен' })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {pwErrors.old_password && (
                  <p className="text-red-500 text-sm mt-1">{pwErrors.old_password.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Новый пароль</label>
                <input
                  type="password"
                  {...registerPw('new_password', { required: 'Новый пароль обязателен', minLength: { value: 6, message: 'Не менее 6 символов' } })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {pwErrors.new_password && (
                  <p className="text-red-500 text-sm mt-1">{pwErrors.new_password.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Подтвердите новый пароль</label>
                <input
                  type="password"
                  {...registerPw('confirm_password', { required: 'Пожалуйста, подтвердите новый пароль' })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {pwErrors.confirm_password && (
                  <p className="text-red-500 text-sm mt-1">{pwErrors.confirm_password.message}</p>
                )}
              </div>
              {passwordError && <div className="text-red-600">{passwordError}</div>}
              {passwordSuccess && <div className="text-green-600">{passwordSuccess}</div>}
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Сменить пароль
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default Profile;
