import React from 'react';
import { useForm } from 'react-hook-form';

interface CompanyFormData {
  name: string;
  industry: string;
  size: string;
  location: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  initialData?: CompanyFormData;
  isEdit?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, onCancel, initialData, isEdit = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Название компании
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Название компании обязательно' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Отрасль
            </label>
            <input
              type="text"
              id="industry"
              {...register('industry', { required: 'Отрасль обязательна' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>}
          </div>

          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Размер компании
            </label>
            <select
              id="size"
              {...register('size', { required: 'Размер компании обязателен' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">Выберите размер</option>
              <option value="Small">Маленькая (1-50 сотрудников)</option>
              <option value="Medium">Средняя (51-250 сотрудников)</option>
              <option value="Large">Крупная (251-1000 сотрудников)</option>
              <option value="Enterprise">Крупнейшая (1000+ сотрудников)</option>
            </select>
            {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Локация
            </label>
            <input
              type="text"
              id="location"
              {...register('location', { required: 'Локация обязательна' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
          </div>

          <div>
            <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Контактное лицо
            </label>
            <input
              type="text"
              id="contact_person"
              {...register('contact_person', { required: 'Контактное лицо обязательно' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.contact_person && <p className="mt-1 text-sm text-red-600">{errors.contact_person.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email обязателен',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некорректный email'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone', { required: 'Телефон обязателен' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Адрес
            </label>
            <input
              type="text"
              id="address"
              {...register('address', { required: 'Адрес обязателен' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Описание
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Описание обязательно' })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
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
          {isEdit ? 'Обновить компанию' : 'Добавить компанию'}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
