'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MonitorPlay,
  Sparkles,
  User,
  Settings2,
  Compass,
  Image as ImageIcon,
  Star,
  GraduationCap,
  Tags,
  BarChart3,
  Globe2,
  HelpCircle,
  Mail,
  Phone,
  Inbox,
  FolderOpen,
  Settings,
  Search,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const SIDEBAR_LINKS = [
  { group: 'Content', items: [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/hero', label: 'Hero', icon: MonitorPlay },
    { href: '/admin/welcome', label: 'Welcome', icon: Sparkles },
    { href: '/admin/about', label: 'About', icon: User },
    { href: '/admin/services', label: 'Services', icon: Settings2 },
    { href: '/admin/process', label: 'Process', icon: Compass },
    { href: '/admin/work', label: 'Work', icon: ImageIcon },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { href: '/admin/training', label: 'Training', icon: GraduationCap },
    { href: '/admin/brands', label: 'Brands', icon: Tags },
    { href: '/admin/stats', label: 'Stats', icon: BarChart3 },
    { href: '/admin/countries', label: 'Countries', icon: Globe2 },
    { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  ]},
  { group: 'System', items: [
    { href: '/admin/mail', label: 'Mail', icon: Mail },
    { href: '/admin/contact', label: 'Contact Info', icon: Phone },
    { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
    { href: '/admin/media', label: 'Media', icon: FolderOpen },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/seo', label: 'SEO', icon: Search },
  ]},
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-3 bg-[#111] rounded-xl border border-white/10 text-white shadow-2xl shadow-black/30"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-[45] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={clsx(
        "admin-sidebar fixed inset-y-0 end-0 z-50 flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
      <div className="admin-sidebar-brand flex items-center">
        <Link href="/admin" className="flex items-center gap-3 no-underline transition-opacity hover:opacity-80">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20">
            KA
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[14px] font-semibold text-white leading-tight">Karim Abdelaziz</span>
            <span className="text-[12px] text-neutral-500 font-medium">Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white/10
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-white/20">

        {SIDEBAR_LINKS.map((group) => (
          <div key={group.group}>
            <div className="text-[11px] font-semibold text-neutral-500 mb-3 px-2 uppercase tracking-widest">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                // Exact match for overview, prefix match for others
                const isActive = item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "admin-sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] no-underline transition-all duration-200 group",
                      isActive
                        ? "admin-sidebar-link-active font-medium shadow-sm"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className={clsx(
                      "w-[18px] h-[18px] transition-colors",
                      isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                    )} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* View site link */}
      <div className="p-4 border-t border-white/5 bg-[#050505]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-3 rounded-lg text-[14px] text-neutral-400 font-medium no-underline hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/5"
        >
          <span>View Site</span>
          <ExternalLink className="w-[18px] h-[18px] text-neutral-500" />
        </Link>
      </div>
    </aside>
    </>
  );
}
