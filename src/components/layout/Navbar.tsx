
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, User, Users } from 'lucide-react';
import Search from '../Search';


export default function Navbar() {
  const navItems = [
    { to: '/trade', icon: LayoutDashboard, label: 'Trade' },
    { to: '/deposit', icon: Wallet, label: 'Deposit' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: 'https://partner.bivaax.com', icon: Users, label: 'Affiliate', external: true },
  ];

  return (
    <nav className="bg-[#1a1b1f] border-b border-[#2c2d32] h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="text-[#ffe24c] font-black text-xl italic">Bivaax</div>
        <Search />
      </div>
      <div className="flex gap-6 items-center">
        {navItems.map((item) => {
          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.to}
                className="flex items-center gap-2 text-sm font-semibold transition-colors text-gray-500 hover:text-gray-300"
              >
                <item.icon size={18} />
                {item.label}
              </a>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-semibold transition-colors ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
