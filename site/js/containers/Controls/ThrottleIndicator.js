import React from 'react';

const SvgComponent = (props) => (
  <svg width={65} height={20} {...props}>
    <g fill="#2A3A4C" fillRule="evenodd">
      <path d="M0 14h60v6H0zM0 0h60v6H0z" />
      <path d="M45 3h20v14H45z" />
    </g>
  </svg>
);

export default SvgComponent;
