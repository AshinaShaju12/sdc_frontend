import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', path: '/' },
  { label: 'Account Intelligence', path: '/account-intelligence' },
  { label: 'Opportunities', path: '/opportunities' },
  { label: 'Sales Coaching', path: '/sales-coaching' }
];

function Sidebar() {
  return (
    <aside className="w-72 rounded-3xl bg-slate-900/80 p-5 shadow-inner shadow-slate-950/40">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-brand-800 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
