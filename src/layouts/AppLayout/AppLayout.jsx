import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  CalendarDays,
  Watch,
  User,
  Search,
  Bell,
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Settings,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import './AppLayout.css';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/meals', label: 'Meal Tracker', icon: UtensilsCrossed, badge: 'AI' },
    { to: '/recipes', label: 'Recipes', icon: ChefHat },
    { to: '/plans', label: 'Meal Plans', icon: CalendarDays },
    { to: '/community', label: 'Community', icon: Users, badge: 'Hot' },
    { to: '/wearables', label: 'Wearables', icon: Watch },
    { to: '/profile', label: 'Profile & Goals', icon: User },
  ];


  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-logo-link">
            <div className="sidebar-logo-icon">52</div>
            {!collapsed && <span className="sidebar-logo-text">Recip52</span>}
          </NavLink>
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="sidebar-nav-icon" />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/profile" className="sidebar-user-card">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
              alt={user?.firstName || 'User'}
              className="sidebar-avatar"
            />
            {!collapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                </div>
                <div className="sidebar-user-email">{user?.email || 'user@recip52.com'}</div>
              </div>
            )}
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        {/* Top Navigation */}
        <header className="app-topnav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              aria-label="Toggle navigation drawer"
            >
              {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="topnav-search">
              <Search size={18} color="#8C867E" />
              <input type="text" placeholder="Search foods, recipes, macros..." />
            </div>
          </div>

          <div className="topnav-actions">
            <NavLink to="/meals?action=add" className="btn-log-meal-quick">
              <PlusCircle size={18} />
              <span>Log Meal</span>
            </NavLink>

            <button className="topnav-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            <div className="user-menu-container" ref={userMenuRef}>
              <button
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
              >
                <img
                  src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'}
                  alt={user?.firstName || 'User'}
                  className="sidebar-avatar"
                  style={{ width: '36px', height: '36px' }}
                />
              </button>

              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8C867E' }}>{user?.email}</div>
                  </div>
                  <NavLink to="/profile" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                    <User size={16} />
                    <span>My Profile</span>
                  </NavLink>
                  <NavLink to="/profile?tab=preferences" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                    <Settings size={16} />
                    <span>Dietary Preferences</span>
                  </NavLink>
                  <button className="user-menu-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Slide-over Drawer */}
        {mobileDrawerOpen && (
          <div
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(20, 18, 16, 0.95)',
              backdropFilter: 'blur(20px)',
              zIndex: 99,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={22} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                className="user-menu-item logout"
                onClick={handleLogout}
                style={{ padding: '14px 16px', fontSize: '1rem' }}
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Child Route Outlet */}
        <main className="app-content-body">
          <Outlet />
        </main>

        {/* In-App Footer */}
        <footer className="app-inapp-footer">
          <div>© 2026 Recip52. Smart Nutrition &amp; AI Meal Engine.</div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <NavLink to="/profile" style={{ color: '#8C867E' }}>Settings</NavLink>
            <a href="/api/docs" target="_blank" rel="noreferrer" style={{ color: '#F4C430', fontWeight: 600 }}>API Docs ↗</a>
            <a href="/" style={{ color: '#8C867E' }}>Landing Home</a>
            <a href="https://recip52.com/privacy" target="_blank" rel="noreferrer" style={{ color: '#8C867E' }}>Privacy</a>
          </div>
        </footer>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `mobile-bottom-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
