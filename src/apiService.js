import { API_URL } from './api';
import { getCookie } from './utils/csrf';

const csrfToken = getCookie('csrftoken');

// // Получить всех пользователей
// export async function getUsers() {
//   const res = await fetch(`${API_URL}users/`, { credentials: 'include' });
//   if (!res.ok) throw new Error('Ошибка загрузки пользователей');
//   return await res.json();
// }

// // Создать пользователя
// export async function createUser(user) {
//   const body = {
//     ...user,
//     // Если пароль пустой, не отправляем его (например, при редактировании)
//     ...(user.password ? { password: user.password } : {}),
//   };
//   const res = await fetch(`${API_URL}users/`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) throw new Error('Ошибка создания пользователя');
//   return await res.json();
// }

// // Обновить пользователя
// export async function updateUser(userId, user) {
//   const body = {
//     ...user,
//     ...(user.password ? { password: user.password } : {}),
//   };
//   const res = await fetch(`${API_URL}users/${userId}/`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify(body),
//   });
//   if (!res.ok) throw new Error('Ошибка обновления пользователя');
//   return await res.json();
// }

// // Удалить пользователя
// export async function deleteUser(userId) {
//   const res = await fetch(`${API_URL}users/${userId}/`, {
//     method: 'DELETE',
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Ошибка удаления пользователя');
//   return true;
// }

// // Получить список компаний для выбора организации
// export async function getCompanies() {
//   const res = await fetch(`${API_URL}companies/`, { credentials: 'include' });
//   if (!res.ok) throw new Error('Ошибка загрузки компаний');
//   return await res.json();
// }

// // Логин пользователя (Django стандартный endpoint)
// export async function loginUser({ email, password }) {
//     // Если у тебя username = email, то всё ок. Если нет - нужно поле username.
//     const res = await fetch(`${API_URL}users/login/`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ email, password }),
//     });
//     if (res.ok) {
//       return await res.json();
//     } else {
//       const data = await res.json().catch(() => ({}));
//       throw new Error(data.detail || data.non_field_errors?.[0] || 'Ошибка входа');
//     }
//   }

// export async function getCSRFToken() {
//     const res = await fetch(`${API_URL}csrf/`, {
//       credentials: 'include',
//     });
//     const data = await res.json();
//     return data.csrfToken;
//   }

// src/apiService.js

// Правильное получение CSRF-токена из cookie
export function getCSRFToken() {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Ищем cookie с нужным именем
      if (cookie.substring(0, 10) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
}

// Асинхронное получение CSRF-токена с сервера
export async function fetchCSRFToken() {
  const response = await fetch('http://localhost:8000/api/csrf/', {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Не удалось получить CSRF-токен');
  }
  
  await response.json(); // Это запустит установку cookie
  return getCSRFToken();
}

  
  // function getCookie(name) {
  //   let cookieValue = null;
  //   if (document.cookie && document.cookie !== '') {
  //     const cookies = document.cookie.split(';');
  //     for (let i = 0; i < cookies.length; i++) {
  //       const cookie = cookies[i].trim();
  //       if (cookie.substring(0, name.length + 1) === (name + '=')) {
  //         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
  //         break;
  //       }
  //     }
  //   }
  //   return cookieValue;
  // }
  
  export async function registerUser(data) {
    const res = await fetch(`${API_URL}users/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed');
    }
    return await res.json();
  }

  export async function loginUser({ email, password }) {
    let csrfToken = getCookie('csrftoken');
    if (!csrfToken) {
      csrfToken = await getCSRFToken();
    }
  
    const res = await fetch(`${API_URL}users/login/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (res.ok) {
      return await res.json();
    } else {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Ошибка авторизации');
    }
  }

  export async function getUsers() {
    const res = await fetch(`${API_URL}users/`, { credentials: 'include' });
    if (!res.ok) throw new Error('Ошибка загрузки пользователей');
    return await res.json();
  }
  
  export async function createUser(user) {
    const csrfToken = getCookie('csrftoken');
    const res = await fetch(`${API_URL}users/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, 
      },
      credentials: 'include',
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Ошибка создания пользователя');
    }
    return await res.json();
  }
  
  export async function updateUser(userId, user) {
    const csrfToken = getCookie('csrftoken');
    const res = await fetch(`${API_URL}users/${userId}/`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, 
      },
      credentials: 'include',
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Ошибка обновления пользователя');
    }
    return await res.json();
  }

  export async function changeUserPassword(userId, data) {
    const csrfToken = getCookie('csrftoken');
    const res = await fetch(`${API_URL}users/${userId}/change_password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Ошибка смены пароля');
    }
    return await res.json();
  }
  
  export async function deleteUser(userId) {
    const csrfToken = getCookie('csrftoken');
    const res = await fetch(`${API_URL}users/${userId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Ошибка удаления пользователя');
    }
    return true;
  }

  export async function fetchUser(id) {
    const res = await fetch(`${API_URL}users/${id}/`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Ошибка загрузки пользователя');
    return await res.json();
  }
  
  export async function fetchCompanies() {
    const res = await fetch(`${API_URL}companies/`, { credentials: 'include' });
    if (!res.ok) throw new Error('Ошибка загрузки компаний');
    return await res.json();
  }

  export async function createCompany(data) {

    const csrfToken = getCSRFToken();

    const res = await fetch(`${API_URL}companies/`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, 
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Ошибка создания компании');
    return await res.json();
  }
  
  export async function updateCompany(id, data) {

    const csrfToken = getCSRFToken();

    const res = await fetch(`${API_URL}companies/${id}/`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, 
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Ошибка обновления компании');
    return await res.json();
  }
  
  export async function deleteCompany(id) {
    const res = await fetch(`${API_URL}companies/${id}/`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken, 
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Ошибка удаления компании');
  }

  export async function fetchCompany(id) {
    const res = await fetch(`${API_URL}companies/${id}/`, { credentials: 'include' });
    if (!res.ok) throw new Error('Ошибка загрузки компании');
    return await res.json();
  }

  export async function fetchAudits(params) {
    const url = new URL(`${API_URL}audits/`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, value);
        }
      });
    }
    
    const res = await fetch(url.toString(), { 
      credentials: 'include' 
    });
    
    if (!res.ok) {
      throw new Error('Ошибка загрузки аудитов');
    }
    
    return await res.json();
  }

  export async function fetchAudit(id) {
    const res = await fetch(`${API_URL}audits/${id}/`, { credentials: 'include' });
    if (!res.ok) throw new Error('Ошибка загрузки аудита');
    return await res.json();
  }

  export async function fetchAuditHistory(id) {
    try {
      const res = await fetch(`/api/audits/${id}/timeline/`, { credentials: 'include' });
      if (!res.ok) throw new Error('Ошибка загрузки истории');
      return await res.json();
    } catch (error) {
      console.error("Ошибка при загрузке истории:", error);
      // Вернуть пустой массив, чтобы приложение не ломалось
      return [];
    }
  }

  // Получение списка взаимодействий (responses)
  export async function fetchAuditInteractions(id) {
    const res = await fetch(`/api/audits/${id}/timeline/`, { credentials: 'include' });
    if (!res.ok) throw new Error('Ошибка загрузки взаимодействий');
    return await res.json();
  }

    // Отправка ответа участника или эксперта (универсальная функция)
  export async function postInteraction(formData) {
    const csrftoken = getCSRFToken();
    const res = await fetch('/api/interactions/add_comment/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrftoken
      },
      body: formData
    });
    if (!res.ok) {
      let errorText = 'Ошибка отправки';
      try {
        const data = await res.json();
        errorText = data.detail || errorText;
      } catch {}
      throw new Error(errorText);
    }
    return await res.json();
  }

  // Добавляем новые функции для работы с аудитами
  export async function createAudit(auditData) {
    // const csrfToken = getCSRFToken();
    const formData = new FormData();
    const csrfToken = getCookie('csrftoken');

    
    
    // Добавляем поля в FormData
    Object.entries(auditData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'questionnaire' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
    });

    const res = await fetch(`${API_URL}audits/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || errorData.message || 'Ошибка создания аудита');
    }
    return await res.json();
  }

  export async function fetchParticipantsByCompany(companyId) {
    // Пример: /api/users/?company=<id>&role=participant
    const res = await fetch(`/api/users/?company=${companyId}&role=participant`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Ошибка загрузки участников');
    return await res.json();
  }
  
  // Получить статистику для Dashboard
export async function fetchDashboardStats() {
  const res = await fetch('/api/dashboard/summary/', { credentials: 'include' });
  if (!res.ok) throw new Error('Ошибка загрузки статистики');
  return await res.json();
}

// Получить недавние аудиты (или все, если нужно)
export async function fetchRecentAudits(params = {}) {
  const url = new URL('/api/audits/', window.location.origin);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error('Ошибка загрузки аудитов');
  return await res.json();
}
