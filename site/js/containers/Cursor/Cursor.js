import React from 'react';

function SvgComponent(props) {
  return (
    <svg width="120px" height="80px" viewBox="0 0 120 80">
      <defs>
        <linearGradient x1="50%" y1="10.962%" x2="50%" y2="100%" id="zoom">
          <stop stopColor="#FFEEAF" offset="0%" />
          <stop stopColor="#FAD961" offset="16.495%" />
          <stop stopColor="#F76B1C" offset="60.813%" />
          <stop stopColor="#893200" offset="100%" />
        </linearGradient>
      </defs>
      <g
        id="cursor"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path fill="#F8A03D" d="M70 39h26v2H70z" />
        <circle stroke="#F8E71C" cx={60} cy={40} r={10} />
        <path
          fill="#F8A03D"
          d="M10 39h40v2H10zM59 20h2v10h-2zM59 50h2v10h-2z"
        />
        <circle fill="url(#zoom)" cx={101} cy={40} r={12} onClick={props.zoom} />
        <path fill="#000" d="M94 38h14v4H94z" onClick={props.zoom} />
        <path fill="#000" d="M103.5 32.5v15h-4v-15z" onClick={props.zoom} />
        <text
          fontFamily="'Helvetica Neue',sans-serif"
          fontSize={12}
          fontWeight="normal"
          fill="white"
        >
          <tspan x={10} y={17}>
            {props.centerid || '...'}
          </tspan>
        </text>
        <text
          id="Galaxies:-0"
          fontFamily="HelveticaNeue-Bold, Helvetica Neue"
          fontSize={14}
          fontWeight="bold"
          fill="#F4E200"
        >
          <tspan x={10} y={74}>
            {`${props.galaxies || 0} galaxies`}
          </tspan>
        </text>
      </g>
    </svg>
  );
}

export default SvgComponent;
