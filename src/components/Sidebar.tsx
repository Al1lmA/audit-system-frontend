import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck, 
  BarChart4, 
  FileText,
  Users,
  ShieldCheck
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useUser();
  
  const navigation = [
    { name: 'Главная', href: '/dashboard', icon: LayoutDashboard, roles: ['expert', 'participant', 'admin'] },
    { name: 'Компании', href: '/companies', icon: Building2, roles: ['expert', 'admin'] },
    { name: 'Пользователи', href: '/users', icon: Users, roles: ['admin'] },
    { name: 'Аудиты', href: '/audits', icon: ClipboardCheck, roles: ['expert', 'participant', 'admin'] },
    { name: 'Аналитика', href: '/analytics', icon: BarChart4, roles: ['expert', 'admin'] },
    { name: 'Отчёты', href: '/reports', icon: FileText, roles: ['expert', 'participant', 'admin'] },
];

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-indigo-700 dark:bg-indigo-900">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <ShieldCheck className="h-8 w-8 text-white mr-2" />
              <span className="text-white text-xl font-bold">Audit System</span>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-indigo-800 dark:bg-indigo-950 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 dark:hover:bg-indigo-800'
                    }`
                  }
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;