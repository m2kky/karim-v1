'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { href: 'home', label: 'Home', labelAr: 'الرئيسية' },
  { href: 'about', label: 'About', labelAr: 'عني' },
  { href: 'services', label: 'Services', labelAr: 'خدماتي' },
  { href: 'training', label: 'Training', labelAr: 'التدريب' },
  { href: 'contact', label: 'Contact', labelAr: 'تواصل' },
];

export function SpaNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuTitleRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.set(overlayRef.current, {
            clipPath: 'inset(0% 0% 100% 0%)',
            visibility: 'hidden'
        });

        gsap.set(menuTitleRef.current, { yPercent: 120, skewY: 5, opacity: 0 });
        gsap.set(linksRef.current, { yPercent: 120, skewY: 5, opacity: 0 });

        timeline.current = gsap.timeline({ paused: true })
            .to(overlayRef.current, {
                clipPath: 'inset(0% 0% 0% 0%)',
                visibility: 'visible',
                duration: 1.2,
                ease: 'expo.inOut',
            })
            .to(menuTitleRef.current, {
                yPercent: 0,
                skewY: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power4.out',
            }, "-=0.6")
            .to(linksRef.current, {
                yPercent: 0,
                skewY: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power4.out',
                stagger: 0.1,
            }, "-=0.7");
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
        timeline.current?.play();
    } else {
        timeline.current?.reverse();
    }
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileOpen(false);

    if(typeof window !== 'undefined' && (window as any).spaGo){
      (window as any).spaGo(href, false);
    }
  };

  return (
    <>
      <nav id="nav" className="flex items-center gap-2 p-2 justify-between">
        {/* Logo */}
        <a
          href="#"
          className="nav-logo"
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <img src="/images/karim.jpg" alt="Karim" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
        </a>

        <div className="nav-links nav-links-desktop">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              data-spa={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              data-en={item.label}
              data-ar={item.labelAr}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="nav-actions">
          <button className="nav-lang" id="portfolioLangBtn">العربية</button>
          <a href="#" onClick={(e) => { e.preventDefault(); if(typeof window !== "undefined" && (window as any).qbOpen) { (window as any).qbOpen(); } }} className="nav-cta">
            <span data-en="Start Project" data-ar="ابدأ مشروع">Start Project</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* Hamburger - Mobile only */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="nav-hamburger"
          aria-label="Menu"
        >
          <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: mobileOpen ? 0 : 1 }}></span>
          <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }}></span>
        </button>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <div
        ref={overlayRef}
        className={`menu-overlay ${mobileOpen ? 'is-open' : ''}`}
      >
        <div className="menu-overlay-content">
          <div>
            <div className="menu-link-wrapper">
              <h2 ref={menuTitleRef} className="menu-title" data-en="MENU" data-ar="القائمة">MENU</h2>
            </div>
          </div>

          <div className="menu-links">
            <div className="nav-links-list">
              {NAV_LINKS.map((item, index) => (
                <div key={item.label} className="menu-link-wrapper">
                  <a
                    href="#"
                    className="huge-link"
                    onClick={(e) => handleNavClick(e, item.href)}
                    ref={(el) => {
                      linksRef.current[index] = el;
                    }}
                    data-en={item.label}
                    data-ar={item.labelAr}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
