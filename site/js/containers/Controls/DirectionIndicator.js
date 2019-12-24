import React from "react"

function SvgComponent(props) {
  return (
    <svg width={55} height={55} viewBox="0 0 55 55" {...props}>
      <defs>
        <radialGradient
          cx="50%"
          cy="62.881%"
          fx="50%"
          fy="62.881%"
          r="78.36%"
          gradientTransform="matrix(0 -.63523 .60405 0 .12 .946)"
          id="prefix__a"
        >
          <stop stopColor="#FFF" offset="0%" />
          <stop stopColor="#1272B8" offset="41.622%" />
          <stop stopColor="#000001" offset="100%" />
        </radialGradient>
      </defs>
      <path
        d="M27.5 1.476l14.07 26.282A16.925 16.925 0 0145 38c0 9.389-7.611 17-17 17s-17-7.611-17-17c0-3.368.98-6.507 2.668-9.148L27.5 1.476z"
        stroke="#FFF"
        strokeWidth={2}
        fill="url(#prefix__a)"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default SvgComponent
