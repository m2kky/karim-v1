'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function AdminLayoutClient({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // If it's the login page, hide the sidebar and don't add the left margin
  if (isLoginPage) {
    return <div className="admin-login-shell">{children}</div>;
  }

  return (
    <div className="admin-shell dark" data-theme="dark">
      {sidebar}
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
