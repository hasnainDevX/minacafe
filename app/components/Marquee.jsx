"use client";
import React from 'react'
const Marquee = ({
  children,
  speed = 15,
  direction = 'left',
  pauseOnHover = false,
  gap = 'gap-16',
  className = '',
  itemClassName = '',
}) => {
  const animationName = direction === 'right' ? 'marquee-right' : 'marquee-left'

  return (
    <div className={`group relative w-full overflow-hidden ${className}`}>
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; }
        }
      `}</style>

      <div
        className={`marquee-track flex w-max items-center justify-center font-(family-name:--font-cormorant) text-4xl  ${gap} ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
        style={{
          animationName,
          animationDuration: `${speed}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {[0, 1].map((i) => (
          <div key={i} className={`flex justify-center shrink-0 items-center ${gap} ${itemClassName}`}>
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marquee