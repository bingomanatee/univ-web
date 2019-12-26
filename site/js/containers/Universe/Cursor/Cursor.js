import React from 'react';

function SvgComponent(props) {
  return (
    <svg width="120px" height="80px" viewBox="0 0 120 80" {...props}>
      <defs>
        <radialGradient
          cx="93.4423828%"
          cy="50%"
          fx="93.4423828%"
          fy="50%"
          r="246.71875%"
          gradientTransform="translate(0.934424,0.500000),scale(0.500000,1.000000),rotate(180.000000),scale(1.000000,0.604045),translate(-0.934424,-0.500000)"
          id="radialGradient-1"
        >
          <stop stopColor="#FFC500" offset="0%" />
          <stop stopColor="#FFC500" offset="41.313727%" />
          <stop stopColor="#000001" offset="100%" />
        </radialGradient>
      </defs>
      <g
        id="cursor"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Group"
          transform="translate(15.000000, 30.000000)"
          fill="url(#radialGradient-1)"
          stroke="#000000"
          strokeLinejoin="round"
          strokeWidth={3}
        >
          <path
            d="M-1.5,-1.92116461 L46.1846584,10 L-1.5,21.9211646 L-1.5,-1.92116461 Z"
            id="Path-6"
          />
          <path
            d="M48.5,-1.92116461 L96.1846584,10 L48.5,21.9211646 L48.5,-1.92116461 Z"
            id="Path-6-Copy"
            transform="translate(70.000000, 10.000000) scale(-1, 1) translate(-70.000000, -10.000000) "
          />
        </g>
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
