"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const mapCountriesData = [
  {name:'USA',           name_ar:'أمريكا',   flag:'🇺🇸', lat: 37.1, lng: -95.7},
  {name:'Canada',        name_ar:'كندا',     flag:'🇨🇦', lat: 56.1, lng:-106.3},
  {name:'United Kingdom',name_ar:'بريطانيا', flag:'🇬🇧', lat: 55.4, lng:  -3.4},
  {name:'Norway',        name_ar:'النرويج',  flag:'🇳🇴', lat: 60.5, lng:   8.5},
  {name:'Turkey',        name_ar:'تركيا',    flag:'🇹🇷', lat: 38.9, lng:  35.2},
  {name:'Syria',         name_ar:'سوريا',    flag:'🇸🇾', lat: 34.8, lng:  38.9},
  {name:'Lebanon',       name_ar:'لبنان',    flag:'🇱🇧', lat: 33.9, lng:  35.5},
  {name:'Iraq',          name_ar:'العراق',   flag:'🇮🇶', lat: 33.2, lng:  43.7},
  {name:'Jordan',        name_ar:'الأردن',   flag:'🇯🇴', lat: 30.6, lng:  36.2},
  {name:'Egypt',         name_ar:'مصر',      flag:'🇪🇬', lat: 26.8, lng:  30.8, home: true},
  {name:'Kuwait',        name_ar:'الكويت',   flag:'🇰🇼', lat: 29.3, lng:  47.5},
  {name:'Saudi Arabia',  name_ar:'السعودية', flag:'🇸🇦', lat: 24.0, lng:  45.0},
  {name:'UAE',           name_ar:'الإمارات', flag:'🇦🇪', lat: 23.4, lng:  53.8},
  {name:'Australia',     name_ar:'أستراليا',flag:'🇦🇺', lat:-25.3, lng: 133.7}
];

const getCurrentLang = () => (typeof document !== 'undefined' && document.documentElement.lang === 'ar' ? 'ar' : 'en');

export default function WorldMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const svg = svgRef.current;
    if (!svg) return;

    async function buildWorldMap() {
      if (!svg) return;
      // In Strict Mode, we want to allow rebuilding if isMounted is true
      // So we don't rely heavily on dataset.built here, or we clear it on unmount

      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        if (!response.ok) throw new Error('World atlas request failed');
        const world = await response.json();
        if (!isMounted) return;
        
        const land = topojson.feature(world, world.objects.countries as any);

        const projection = d3.geoEquirectangular()
          .scale(159)
          .translate([500, 250]);

        const pathGen = d3.geoPath().projection(projection);

        const continentsGroup = svg.querySelector('#continents-paths');
        if (continentsGroup) continentsGroup.innerHTML = '';

        (land as any).features.forEach((country: any) => {
          const d = pathGen(country);
          if (!d) return;
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', d);
          path.setAttribute('fill', 'rgba(58,127,199,0.06)');
          path.setAttribute('stroke', 'rgba(127,196,255,0.55)');
          path.setAttribute('stroke-width', '0.5');
          path.setAttribute('filter', 'url(#continentGlow)');
          continentsGroup?.appendChild(path);
        });

        const positions: any = {};
        mapCountriesData.forEach(c => {
          const [x, y] = projection([c.lng, c.lat]) || [0, 0];
          positions[c.name] = { x, y };
        });

        drawMarkersAndLines(svg, positions);
        setupMapPopups();
        syncMapLanguage();
        
        const loading = document.getElementById('mapLoading');
        if(loading) loading.classList.add('hidden');
      } catch (e) {
        console.error('Map load failed:', e);
        if (!isMounted) return;
        
        drawFallbackContinents(svg);
        const positions: any = {};
        mapCountriesData.forEach(c => {
          const x = ((c.lng + 180) / 360) * 1000;
          const y = ((90 - c.lat) / 180) * 500;
          positions[c.name] = { x, y };
        });
        drawMarkersAndLines(svg, positions);
        setupMapPopups();
        syncMapLanguage();
        
        const loading = document.getElementById('mapLoading');
        if(loading) loading.classList.add('hidden');
      }
    }

    function drawFallbackContinents(svgNode: SVGSVGElement) {
      const ns = 'http://www.w3.org/2000/svg';
      const continentsGroup = svgNode.querySelector('#continents-paths');
      if (!continentsGroup) return;
      continentsGroup.innerHTML = '';

      const fallbackPaths = [
        'M105 170 C150 115 245 115 295 170 C328 208 305 260 250 273 C184 288 116 254 105 170 Z',
        'M245 295 C292 280 342 306 348 354 C354 407 306 454 264 426 C226 400 220 328 245 295 Z',
        'M430 150 C510 104 628 126 660 202 C690 274 626 326 530 316 C446 307 382 224 430 150 Z',
        'M575 304 C640 294 704 346 698 410 C691 480 590 478 558 420 C536 380 538 326 575 304 Z',
        'M685 188 C760 145 862 162 904 226 C940 280 898 332 812 318 C740 306 666 252 685 188 Z',
        'M774 356 C836 340 900 376 918 428 C864 462 792 452 760 410 C746 392 750 368 774 356 Z'
      ];

      fallbackPaths.forEach((d) => {
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'rgba(58,127,199,0.06)');
        path.setAttribute('stroke', 'rgba(127,196,255,0.55)');
        path.setAttribute('stroke-width', '0.7');
        path.setAttribute('filter', 'url(#continentGlow)');
        continentsGroup.appendChild(path);
      });
    }

    function drawMarkersAndLines(svgNode: SVGSVGElement, positions: any) {
      const ns = 'http://www.w3.org/2000/svg';
      const glowsGroup = svgNode.querySelector('#glows');
      const linesGroup = svgNode.querySelector('#lines');
      const markersGroup = svgNode.querySelector('#markers');
      
      if (!glowsGroup || !linesGroup || !markersGroup) return;

      glowsGroup.innerHTML = '';
      linesGroup.innerHTML = '';
      markersGroup.innerHTML = '';

      const home = mapCountriesData.find(c => c.home);
      if (!home) return;
      const homePos = positions[home.name];

      // Glows
      mapCountriesData.forEach(c => {
        const p = positions[c.name];
        if (!p) return;
        const glow = document.createElementNS(ns, 'circle');
        glow.setAttribute('cx', p.x);
        glow.setAttribute('cy', p.y);
        glow.setAttribute('r', c.home ? '28' : '18');
        glow.setAttribute('fill', c.home ? 'url(#homeHaloGrad)' : 'url(#haloGrad)');
        glowsGroup.appendChild(glow);
      });

      // Lines
      const targets = mapCountriesData.filter(c => !c.home);
      targets.forEach((c, i) => {
        const target = positions[c.name];
        if (!target) return;

        const dx = target.x - homePos.x;
        const dy = target.y - homePos.y;
        const dist = Math.hypot(dx, dy);
        const arcHeight = Math.max(dist * 0.25, 25);
        const midX = (homePos.x + target.x) / 2;
        const midY = Math.min(homePos.y, target.y) - arcHeight;

        const pathD = `M ${homePos.x} ${homePos.y} Q ${midX} ${midY} ${target.x} ${target.y}`;

        const line = document.createElementNS(ns, 'path');
        line.setAttribute('d', pathD);
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke', '#ffffff');
        line.setAttribute('stroke-width', '0.8');
        line.setAttribute('stroke-opacity', '0.55');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('filter', 'url(#lineGlow)');
        linesGroup.appendChild(line);

        const dur = 2.5 + (i % 3) * 0.3;
        const begin = i * 0.18;

        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('r', '2.8');
        dot.setAttribute('fill', '#ffffff');
        dot.setAttribute('filter', 'url(#lineGlow)');
        dot.innerHTML = `
          <animateMotion dur="${dur}s" repeatCount="indefinite" begin="${begin}s" path="${pathD}"/>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="${dur}s" repeatCount="indefinite" begin="${begin}s"/>
        `;
        linesGroup.appendChild(dot);
      });

      // Markers
      mapCountriesData.forEach(c => {
        const p = positions[c.name];
        if (!p) return;

        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', p.x);
        dot.setAttribute('cy', p.y);
        dot.setAttribute('r', c.home ? '4' : '3');
        dot.setAttribute('fill', '#ffffff');
        markersGroup.appendChild(dot);

        if (c.home) {
          const pulse = document.createElementNS(ns, 'circle');
          pulse.setAttribute('cx', p.x);
          pulse.setAttribute('cy', p.y);
          pulse.setAttribute('r', '6');
          pulse.setAttribute('fill', 'none');
          pulse.setAttribute('stroke', '#ffffff');
          pulse.setAttribute('stroke-width', '1');
          pulse.innerHTML = `
            <animate attributeName="r" from="6" to="22" dur="2.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.8" to="0" dur="2.4s" repeatCount="indefinite"/>
          `;
          markersGroup.appendChild(pulse);
        }

        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', p.x);
        label.setAttribute('y', String(p.y + (c.home ? 18 : 14)));
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('fill', c.home ? '#ffffff' : 'rgba(174,220,255,0.9)');
        label.setAttribute('font-size', c.home ? '9' : '7.5');
        label.setAttribute('font-family', 'Inter, sans-serif');
        label.setAttribute('font-weight', c.home ? '600' : '500');
        label.setAttribute('letter-spacing', '0.2');
        label.style.pointerEvents = 'none';
        label.dataset.en = c.name;
        label.dataset.ar = c.name_ar;
        label.textContent = getCurrentLang() === 'ar' ? c.name_ar : c.name;
        markersGroup.appendChild(label);

        const hit = document.createElementNS(ns, 'circle');
        hit.setAttribute('cx', p.x);
        hit.setAttribute('cy', p.y);
        hit.setAttribute('r', '12');
        hit.setAttribute('fill', 'transparent');
        hit.style.cursor = 'pointer';
        hit.classList.add('map-hit');
        hit.dataset.name = c.name;
        hit.dataset.nameEn = c.name;
        hit.dataset.nameAr = c.name_ar;
        hit.dataset.flag = c.flag;
        hit.dataset.cx = p.x;
        hit.dataset.cy = p.y;
        markersGroup.appendChild(hit);
      });
    }

    function setupMapPopups() {
      const svgNode = svgRef.current;
      const wrapNode = wrapRef.current;
      if (!svgNode || !wrapNode) return;

      let popup = document.getElementById('country-popup');
      if (!popup) {
        popup = document.createElement('div');
        popup.id = 'country-popup';
        popup.className = 'country-popup';
        popup.innerHTML = '<span class="flag"></span><span class="name"></span>';
        wrapNode.appendChild(popup);
      }

      const hits = svgNode.querySelectorAll('.map-hit');
      hits.forEach((m: any) => {
        m.addEventListener('mouseenter', () => {
          const cx = parseFloat(m.dataset.cx);
          const cy = parseFloat(m.dataset.cy);
          const wrapRect = wrapNode.getBoundingClientRect();
          const svgRect = svgNode.getBoundingClientRect();
          const xPct = cx / 1000;
          const yPct = cy / 500;
          const px = (svgRect.left - wrapRect.left) + svgRect.width * xPct;
          const py = (svgRect.top - wrapRect.top) + svgRect.height * yPct;
          if (popup) {
            const flagEl = popup.querySelector('.flag');
            const nameEl = popup.querySelector('.name');
            if (flagEl) flagEl.textContent = m.dataset.flag;
            if (nameEl) nameEl.textContent = getCurrentLang() === 'ar' ? (m.dataset.nameAr || m.dataset.name) : (m.dataset.nameEn || m.dataset.name);
            popup.style.left = px + 'px';
            popup.style.top = py + 'px';
            popup.classList.add('show');
          }
        });
        m.addEventListener('mouseleave', () => {
          if (popup) popup.classList.remove('show');
        });
      });
    }

    function syncMapLanguage() {
      if (!svg) return;
      const lang = getCurrentLang();
      svg.querySelectorAll<SVGTextElement>('#markers text[data-en]').forEach((label) => {
        label.textContent = lang === 'ar' ? (label.dataset.ar || label.dataset.en || '') : (label.dataset.en || '');
      });
      const popup = document.getElementById('country-popup');
      if (popup) popup.classList.remove('show');
    }

    buildWorldMap();
    document.addEventListener('languagechange', syncMapLanguage);

    return () => {
      isMounted = false;
      document.removeEventListener('languagechange', syncMapLanguage);
    };
  }, []);

  return (
    <div className="map-frame">
      <div className="map-wrap" ref={wrapRef}>
        <div id="map-container">
          <div className="map-loading" id="mapLoading">
            <div className="map-loading-spinner"></div>
            <div className="map-loading-text" data-en="Loading world map..." data-ar="جاري تحميل الخريطة...">Loading world map...</div>
          </div>
          <svg
            id="world-svg"
            ref={svgRef}
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
          >
            <defs>
              <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#1a3a6e" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#0a1830" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#020812" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="20%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="55%" stopColor="#7fc4ff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7fc4ff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="homeHaloGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="15%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#aedcff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#aedcff" stopOpacity="0" />
              </radialGradient>
              <filter id="lineGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="continentGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(127,196,255,0.06)" strokeWidth={0.5} />
              </pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#gridPattern)" />
            <rect width="1000" height="500" fill="url(#bgGrad)" />
            <g id="continents-paths"></g>
            <g id="glows"></g>
            <g id="lines"></g>
            <g id="markers" style={{ pointerEvents: 'auto' }}></g>
          </svg>
        </div>
      </div>
      <div className="map-countries">
        {mapCountriesData.map((country: any, idx: number) => (
          <span
            key={idx}
            className={`ctry ${country.home ? 'home' : ''}`}
          >
            {country.flag} <span data-en={country.name} data-ar={country.name_ar}>{country.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
