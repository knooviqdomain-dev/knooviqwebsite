import React from 'react';

export interface ClientLogoItem {
  id: string;
  name: string;
  category: string;
  logoSrc: string;
}

// 40 Authentic enterprise clients using exact original logo assets from reference image
export const ALL_CLIENTS: ClientLogoItem[] = [
  // ── ROW 1 ──
  {
    id: 'mahindra',
    name: 'Mahindra',
    category: 'Automotive & Farm Equipment',
    logoSrc: '/images/clients/mahindra.png',
  },
  {
    id: 'mcgm',
    name: 'Municipal Corporation of Greater Mumbai',
    category: 'Public Administration & Smart City',
    logoSrc: '/images/clients/mcgm.png',
  },
  {
    id: 'intermec-honeywell',
    name: 'Intermec by Honeywell',
    category: 'Barcode & RFID Automation',
    logoSrc: '/images/clients/intermec-honeywell.png',
  },
  {
    id: 'godrej',
    name: 'Godrej',
    category: 'Diversified Conglomerate',
    logoSrc: '/images/clients/godrej.png',
  },
  {
    id: 'mimah',
    name: 'mimah Technology Systems',
    category: 'Enterprise Technology Solutions',
    logoSrc: '/images/clients/mimah.png',
  },

  // ── ROW 2 ──
  {
    id: 'provogue',
    name: 'Provogue',
    category: 'Fashion & Retail',
    logoSrc: '/images/clients/provogue.png',
  },
  {
    id: 'prozone',
    name: 'Prozone',
    category: 'Retail & Commercial Real Estate',
    logoSrc: '/images/clients/prozone.png',
  },
  {
    id: 'solar',
    name: 'Solar',
    category: 'Industrial & Energy Solutions',
    logoSrc: '/images/clients/solar.png',
  },
  {
    id: 'sterlite',
    name: 'Sterlite Industries',
    category: 'Metals & Mining Infrastructure',
    logoSrc: '/images/clients/sterlite.png',
  },
  {
    id: 'tata-communications',
    name: 'Tata Communications',
    category: 'Global Telecom & Digital Core',
    logoSrc: '/images/clients/tata-communications.png',
  },

  // ── ROW 3 ──
  {
    id: 'total',
    name: 'TotalEnergies',
    category: 'Global Multi-Energy & Oil',
    logoSrc: '/images/clients/total.png',
  },
  {
    id: 'viraj',
    name: 'Viraj Profiles Limited',
    category: 'Stainless Steel Manufacturing',
    logoSrc: '/images/clients/viraj.png',
  },
  {
    id: 'welspun',
    name: 'Welspun',
    category: 'Steel, Pipes & Home Textiles',
    logoSrc: '/images/clients/welspun.png',
  },
  {
    id: 'loha',
    name: 'Loha',
    category: 'Steel & Construction Materials',
    logoSrc: '/images/clients/loha.png',
  },
  {
    id: 'adani',
    name: 'Adani',
    category: 'Energy & Infrastructure',
    logoSrc: '/images/clients/adani.png',
  },

  // ── ROW 4 ──
  {
    id: 'alkem',
    name: 'Alkem Laboratories',
    category: 'Pharmaceuticals & Formulations',
    logoSrc: '/images/clients/alkem.png',
  },
  {
    id: 'berger',
    name: 'Berger Paints',
    category: 'Paints & Specialty Coatings',
    logoSrc: '/images/clients/berger.png',
  },
  {
    id: 'astec',
    name: 'Astec LifeSciences',
    category: 'Agrochemicals & Intermediates',
    logoSrc: '/images/clients/astec.png',
  },
  {
    id: 'ceat',
    name: 'CEAT',
    category: 'Automotive Tyres',
    logoSrc: '/images/clients/ceat.png',
  },
  {
    id: 'bajaj',
    name: 'Bajaj',
    category: 'Automotive & Manufacturing',
    logoSrc: '/images/clients/bajaj.png',
  },

  // ── ROW 5 ──
  {
    id: 'oriental',
    name: 'Oriental Insurance',
    category: 'General Insurance & Protection',
    logoSrc: '/images/clients/oriental.png',
  },
  {
    id: 'fujitsu',
    name: 'Fujitsu',
    category: 'Enterprise IT Solutions',
    logoSrc: '/images/clients/fujitsu.png',
  },
  {
    id: 'ibm',
    name: 'IBM',
    category: 'Enterprise Cloud & Cognitive AI',
    logoSrc: '/images/clients/ibm.png',
  },
  {
    id: 'pidilite',
    name: 'Pidilite',
    category: 'Adhesives & Consumer Chemicals',
    logoSrc: '/images/clients/pidilite.png',
  },
  {
    id: 'jyoti',
    name: 'Jyoti',
    category: 'Engineering & Power Equipment',
    logoSrc: '/images/clients/jyoti.png',
  },

  // ── ROW 6 ──
  {
    id: 'kama-schachter',
    name: 'Kama Schachter',
    category: 'Diamond Jewellery Manufacturing',
    logoSrc: '/images/clients/kama-schachter.png',
  },
  {
    id: 'lodha',
    name: 'Lodha Group',
    category: 'Real Estate & Smart Communities',
    logoSrc: '/images/clients/lodha.png',
  },
  {
    id: 'lupin',
    name: 'Lupin',
    category: 'Global Healthcare & Bio-pharma',
    logoSrc: '/images/clients/lupin.png',
  },
  {
    id: 'nilkamal',
    name: 'Nilkamal',
    category: 'Moulded Furniture & Logistics',
    logoSrc: '/images/clients/nilkamal.png',
  },
  {
    id: 'pepsi',
    name: 'PepsiCo',
    category: 'Global Food & Beverages',
    logoSrc: '/images/clients/pepsi.png',
  },

  // ── ROW 7 ──
  {
    id: 'pfizer',
    name: 'Pfizer',
    category: 'Global Biopharmaceuticals',
    logoSrc: '/images/clients/pfizer.png',
  },
  {
    id: 'premier',
    name: 'Premier',
    category: 'Automotive & Heavy Engineering',
    logoSrc: '/images/clients/premier.png',
  },
  {
    id: 'promart',
    name: 'Promart',
    category: 'Retail & Value Supermarkets',
    logoSrc: '/images/clients/promart.png',
  },
  {
    id: 'rashi-peripherals',
    name: 'Rashi Peripherals',
    category: 'ICT Distribution & Devices',
    logoSrc: '/images/clients/rashi-peripherals.png',
  },
  {
    id: 'reliance-power',
    name: 'Reliance Power',
    category: 'Power Generation & Utilities',
    logoSrc: '/images/clients/reliance-power.png',
  },

  // ── ROW 8 ──
  {
    id: 'sanathan',
    name: 'Sanathan Textiles',
    category: 'Yarn & Global Textiles',
    logoSrc: '/images/clients/sanathan.png',
  },
  {
    id: 'savera',
    name: 'Savera Hotels',
    category: 'Hospitality & Leisure Services',
    logoSrc: '/images/clients/savera.png',
  },
  {
    id: 'hindustan-unilever',
    name: 'Hindustan Unilever',
    category: 'Consumer FMCG & Personal Care',
    logoSrc: '/images/clients/hindustan-unilever.png',
  },
  {
    id: 'tata',
    name: 'TATA Communications',
    category: 'Enterprise Telecom & Connectivity',
    logoSrc: '/images/clients/tata.png',
  },
  {
    id: 'blue-star',
    name: 'Blue Star',
    category: 'Air Conditioning & Refrigeration',
    logoSrc: '/images/clients/blue-star.png',
  },
];

// Backwards-compatibility aliases
export const CLIENTS_LIST_ROW_1 = ALL_CLIENTS.slice(0, 20);
export const CLIENTS_LIST_ROW_2 = ALL_CLIENTS.slice(20, 40);

export const ClientLogoMarquee: React.FC<{
  title?: string;
  subtitle?: string;
  description?: string;
  badge1?: string;
  badge2?: string;
  badge3?: string;
  sectorsList?: string[];
  className?: string;
}> = ({
  className = ""
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null);
  const [isUserDragging, setIsUserDragging] = React.useState(false);

  // Drag tracking refs
  const isMouseDownRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startScrollLeftRef = React.useRef(0);
  const dragMovedRef = React.useRef(false);
  const isHoveredRef = React.useRef(false);
  const selectedClientIdRef = React.useRef<string | null>(null);
  const isUserDraggingRef = React.useRef(false);

  // Synchronize refs for 60fps RAF loop without re-subscribing
  React.useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  React.useEffect(() => {
    selectedClientIdRef.current = selectedClientId;
  }, [selectedClientId]);

  React.useEffect(() => {
    isUserDraggingRef.current = isUserDragging;
  }, [isUserDragging]);

  // Infinite loop wrapping helper
  const wrapScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const halfWidth = container.scrollWidth / 2;
    if (halfWidth > 100) {
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft -= halfWidth;
        startScrollLeftRef.current -= halfWidth;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += halfWidth;
        startScrollLeftRef.current += halfWidth;
      }
    }
  }, []);

  // Continuous auto-scroll loop (pauses on hover, drag, or clicked client)
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animId: number;
    let lastTime = performance.now();
    const speed = 95; // Crisp & smooth speed (fast, responsive, elegant)

    const step = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1); // Guard against tab background jumps
      lastTime = now;

      const isPaused = isHoveredRef.current || isUserDraggingRef.current || isMouseDownRef.current || selectedClientIdRef.current !== null;

      if (!isPaused && container) {
        const halfWidth = container.scrollWidth / 2;
        if (halfWidth > 100) {
          container.scrollLeft += speed * delta;
          if (container.scrollLeft >= halfWidth) {
            container.scrollLeft -= halfWidth;
          } else if (container.scrollLeft <= 0) {
            container.scrollLeft += halfWidth;
          }
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Mouse Wheel (horizontal or vertical scroll support)
  const handleWheel = (e: React.WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 0) {
      container.scrollLeft += delta * 0.8;
      wrapScroll();
    }
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isMouseDownRef.current = true;
    dragMovedRef.current = false;
    startXRef.current = e.pageX - container.offsetLeft;
    startScrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      dragMovedRef.current = true;
      setIsUserDragging(true);
    }
    container.scrollLeft = startScrollLeftRef.current - walk;
    wrapScroll();
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setTimeout(() => {
      setIsUserDragging(false);
      dragMovedRef.current = false;
    }, 60);
  };

  // Click on a client card to pause / inspect
  const handleCardClick = (_e: React.MouseEvent, client: ClientLogoItem) => {
    if (dragMovedRef.current) return; // User was dragging, do not treat as click
    if (selectedClientId === client.id) {
      setSelectedClientId(null); // Click again to resume
    } else {
      setSelectedClientId(client.id); // Pause on this client
    }
  };

  // Keyboard accessibility (Enter / Space)
  const handleLogoKeyDown = (e: React.KeyboardEvent, client: ClientLogoItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(e as unknown as React.MouseEvent, client);
    }
  };

  const renderClientCard = (client: ClientLogoItem, key: string, isDuplicate = false) => {
    const isSelected = selectedClientId === client.id;

    return (
      <div
        key={key}
        role="button"
        tabIndex={0}
        aria-label={`${client.name} - ${client.category}${isSelected ? ' (Selected - Paused)' : ''}`}
        aria-hidden={isDuplicate ? true : undefined}
        onClick={(e) => handleCardClick(e, client)}
        onKeyDown={(e) => handleLogoKeyDown(e, client)}
        className={`bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-between min-w-[260px] sm:min-w-[280px] h-[136px] sm:h-[140px] flex-shrink-0 transition-all duration-200 select-none outline-none focus:outline-none ring-0 relative cursor-pointer ${
          isSelected
            ? 'border-2 border-[#00A3E0] shadow-[0_0_25px_rgba(0,163,224,0.45)] scale-[1.03] z-10'
            : 'border border-slate-200/90 hover:border-sky-400 shadow-[0_4px_18px_-2px_rgba(0,0,0,0.18)] hover:shadow-xl hover:scale-[1.01]'
        }`}
      >
        {/* Selected Active Indicator Pill */}
        {isSelected && (
          <div className="absolute -top-2.5 px-2.5 py-0.5 rounded-full bg-[#00A3E0] text-white text-[9.5px] font-bold uppercase tracking-wider shadow-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            PAUSED • CLICK TO RESUME
          </div>
        )}

        {/* Exact Authentic Logo Image - Uses Full Box Size with Ultra-Crisp Rendering */}
        <div className="flex-1 w-full flex items-center justify-center px-1 py-0.5 pointer-events-none overflow-hidden">
          <img
            src={`${client.logoSrc}?v=20261125_ultra_hd_v2`}
            alt={client.name}
            draggable={false}
            className="w-full h-full max-h-[92px] sm:max-h-[96px] max-w-[250px] sm:max-w-[265px] object-contain select-none pointer-events-none"
            style={{
              imageRendering: 'auto',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
            loading="eager"
            decoding="sync"
          />
        </div>

        {/* Crisp, Highly Readable Category Label */}
        <div className="flex items-center justify-center w-full pt-1 pointer-events-none">
          <span className="text-[11.5px] sm:text-[12.5px] font-bold text-slate-800 dark:text-slate-900 tracking-tight text-center leading-snug line-clamp-1 px-1">
            {client.category}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section
      className={`py-6 sm:py-8 relative overflow-hidden bg-gradient-to-r from-[#061224] via-[#0A1931] to-[#002B5B] border-t border-b border-sky-500/20 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUp();
      }}
    >
      {/* Background Architectural Dot Matrix Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Dual Soft Ambient Colored Spotlights */}
      <div className="absolute -top-24 left-1/4 w-[500px] h-[350px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-[500px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Crisp Edge Soft Fade (Matching the Deep Dark Navy Blue Background) */}
      <div className="absolute top-0 left-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#061224] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#002B5B] to-transparent z-20 pointer-events-none" />

      {/* Interactive Drag & Scrollable Track Container */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={wrapScroll}
        onTouchMove={wrapScroll}
        className={`w-full overflow-x-auto no-scrollbar py-3 select-none ${
          isUserDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pan-y',
          scrollBehavior: 'auto',
          willChange: 'scroll-position',
          transform: 'translateZ(0)',
        }}
      >
        <div className="flex items-center gap-6 px-4 w-max">
          {/* Primary Track with all 40 authentic clients */}
          {ALL_CLIENTS.map((client, idx) => renderClientCard(client, `primary-${client.id}-${idx}`))}

          {/* Seamless Infinite Loop Duplicate Track with all 40 authentic clients */}
          {ALL_CLIENTS.map((client, idx) => renderClientCard(client, `duplicate-${client.id}-${idx}`, true))}
        </div>
      </div>
    </section>
  );
};
