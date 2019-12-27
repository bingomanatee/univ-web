/* eslint-disable max-len */
import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';

function showIf(show) {
  if (!show) {
    return { display: 'none' };
  }
  return {};
}

function SvgComponent({
  setThrottle, setDirection, throttle = 0, direction = 0,
}) {
  const chooseDirection = (e) => {
    const ele = _.get(e, 'target');
    if (!ele) {
      return;
    }
    const angle = _.get(ele, 'attributes.dataangle.value');
    console.log('chose direction click on ', ele, 'angle = ', angle);
    setDirection(Number(angle) || 0);
  };

  const chooseThrottle = (e) => {
    const ele = _.get(e, 'target');
    if (!ele) {
      return;
    }
    const t = _.get(ele, 'attributes.datathrottle.value');
    console.log('chose throttle click on ', ele, 'throttle = ', t);
    setThrottle(Number(t) || 0);
  };

  const strokeColor = 'rgba(0,0,0,0.25)';
  const inactiveColor = 'rgba(128,128,128,0.5)';
  const inactiveDirColor = 'rgba(0,0,0,0.5)';

  return (
    <svg width="312px" height="279px" viewBox="0 0 312 279">
      <defs>
        <radialGradient
          cx="50%"
          cy="62.881289%"
          fx="50%"
          fy="62.881289%"
          r="78.3596579%"
          gradientTransform="translate(0.500000,0.628813),scale(1.000000,0.635227),rotate(-90.000000),scale(1.000000,0.604045),translate(-0.500000,-0.628813)"
          id="controlCompass"
        >
          <stop stopColor="#FFFFFF" offset="0%" />
          <stop stopColor="#1272B8" offset="41.6220364%" />
          <stop stopColor="#000001" offset="100%" />
        </radialGradient>
      </defs>
      <g
        id="controls-2-large"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <path
          d="M141,31 C207.27417,31 261,84.72583 261,151 C261,217.27417 207.27417,271 141,271 C74.72583,271 21,217.27417 21,151 C21,84.72583 74.72583,31 141,31 Z M141,51 C85.771525,51 41,95.771525 41,151 C41,206.228475 85.771525,251 141,251 C196.228475,251 241,206.228475 241,151 C241,95.771525 196.228475,51 141,51 Z"
          id="go-ring-inactive"
          stroke={strokeColor}
          strokeWidth={2}
          fill={inactiveColor}
          strokeLinejoin="bevel"
        />
        <circle
          id="go-center"
          stroke={strokeColor}
          strokeWidth={2}
          fill={inactiveColor}
          strokeLinejoin="bevel"
          cx={141}
          cy={151}
          r={5}
        />
        <rect
          id="throttle-stop-inactive"
          stroke={strokeColor}
          strokeWidth={2}
          fill={inactiveColor}
          strokeLinejoin="bevel"
          x={1}
          y={131}
          width={10}
          height={25}
          datathrottle={0}
          onClick={chooseThrottle}
        />
        <path
          d="M75.7209356,27.118865 L80.2407218,36.0431435 C47.1686017,53.5593608 22.5615512,84.9294801 14.1512462,122.421826 L4.47538306,119.861408 C13.6226949,79.5870703 40.1337999,45.9103019 75.7209356,27.118865 Z"
          id="throttle-1-inactive"
          stroke={strokeColor}
          strokeWidth={2}
          fill={inactiveColor}
          strokeLinejoin="bevel"
          datathrottle={1}
          onClick={chooseThrottle}
        />
        <path
          d="M141,1 C166.540952,1 190.590959,7.38349767 211.641614,18.6420871 L202.491272,36.4338386 C184.183478,26.5868248 163.244175,21 141,21 C118.755832,21 97.8165358,26.5868212 79.5087462,36.433829 L70.3587237,18.6419064 C91.4092982,7.38342935 115.459184,1 141,1 Z"
          id="throttle-2-inactive"
          stroke={strokeColor}
          strokeWidth={2}
          fill={inactiveColor}
          strokeLinejoin="bevel"
          datathrottle={2}
          onClick={chooseThrottle}
        />
        <path
          d="M301,151 C301,152.672777 300.97433,154.339559 300.923361,155.999973 L270.905603,156.000352 C270.968346,154.341338 271,152.674366 271,151 C271,101.667752 243.521423,58.7534698 203.035166,36.7280511 L216.521549,9.9095447 C266.804546,36.8809789 301,89.9471013 301,151 Z"
          id="throttle-3-inactive"
          stroke={strokeColor}
          strokeWidth={2}
          fill={inactiveColor}
          strokeLinejoin="bevel"
          datathrottle={3}
          onClick={chooseThrottle}
        />
        <path
          d="M311,156 L311,271 L191.079145,271.003697 C236.561967,252.000998 268.942864,207.894579 270.90559,156.000684 L311,156 Z"
          id="throttle-4-inactive"
          stroke={strokeColor}
          strokeWidth={2}
          fill={inactiveColor}
          strokeLinejoin="bevel"
          datathrottle={4}
          onClick={chooseThrottle}
        />
        <rect
          id="throttle-stop"
          stroke={strokeColor}
          strokeWidth={2}
          fill="#FF4E00"
          strokeLinejoin="bevel"
          x={1}
          y={131}
          width={10}
          height={25}
          datathrottle={0}
          onClick={chooseThrottle}
          style={showIf(throttle === 0)}
        />
        <path
          d="M75.7209356,27.118865 L80.2407218,36.0431435 C47.1686017,53.5593608 22.5615512,84.9294801 14.1512462,122.421826 L4.47538306,119.861408 C13.6226949,79.5870703 40.1337999,45.9103019 75.7209356,27.118865 Z"
          id="throttle-1"
          stroke={strokeColor}
          strokeWidth={2}
          fill="#FFC500"
          strokeLinejoin="bevel"
          datathrottle={1}
          onClick={chooseThrottle}
          style={showIf(throttle > 0)}
        />
        <path
          d="M141,1 C166.540952,1 190.590959,7.38349767 211.641614,18.6420871 L202.491272,36.4338386 C184.183478,26.5868248 163.244175,21 141,21 C118.755832,21 97.8165358,26.5868212 79.5087462,36.433829 L70.3587237,18.6419064 C91.4092982,7.38342935 115.459184,1 141,1 Z"
          id="throttle-2"
          stroke={strokeColor}
          strokeWidth={2}
          fill="#FFC500"
          strokeLinejoin="bevel"
          datathrottle={2}
          onClick={chooseThrottle}
          style={showIf(throttle > 1)}
        />
        <path
          d="M301,151 C301,152.672777 300.97433,154.339559 300.923361,155.999973 L270.905603,156.000352 C270.968346,154.341338 271,152.674366 271,151 C271,101.667752 243.521423,58.7534698 203.035166,36.7280511 L216.521549,9.9095447 C266.804546,36.8809789 301,89.9471013 301,151 Z"
          id="throttle-3"
          stroke={strokeColor}
          strokeWidth={2}
          fill="#FFC500"
          strokeLinejoin="bevel"
          datathrottle={3}
          onClick={chooseThrottle}
          style={showIf(throttle > 2)}
        />
        <path
          d="M311,156 L311,271 L191.079145,271.003697 C236.561967,252.000998 268.942864,207.894579 270.90559,156.000684 L311,156 Z"
          id="throttle-4"
          stroke={strokeColor}
          strokeWidth={2}
          fill="#FFC500"
          strokeLinejoin="bevel"
          datathrottle={4}
          onClick={chooseThrottle}
          style={showIf(throttle > 3)}
        />
        <g
          id="go-arrow-inactive"
          transform="translate(249.500000, 151.000000) rotate(90.000000) translate(-249.500000, -151.000000) translate(239.500000, 132.500000)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={0}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(234.963756, 96.750000) rotate(60.000000) translate(-234.963756, -96.750000) translate(224.963756, 78.250000)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={330}
          />
        </g>

        <g
          id="go-arrow-inactive"
          transform="translate(195.250000, 57.036244) rotate(30.000000) translate(-195.250000, -57.036244) translate(185.250000, 38.536244)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={300}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(131.000000, 24.000000)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={270}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(86.750000, 57.036244) rotate(-30.000000) translate(-86.750000, -57.036244) translate(76.750000, 38.536244)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={240}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(47.036244, 96.750000) rotate(300.000000) translate(-47.036244, -96.750000) translate(37.036244, 78.250000)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={210}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(32.500000, 151.000000) rotate(270.000000) translate(-32.500000, -151.000000) translate(22.500000, 132.500000)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={180}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(47.036244, 205.250000) rotate(240.000000) translate(-47.036244, -205.250000) translate(37.036244, 186.750000)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={150}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(86.750000, 244.963756) rotate(210.000000) translate(-86.750000, -244.963756) translate(76.750000, 226.463756)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={120}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(141.000000, 259.500000) rotate(180.000000) translate(-141.000000, -259.500000) translate(131.000000, 241.000000)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={90}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(195.250000, 244.963756) rotate(150.000000) translate(-195.250000, -244.963756) translate(185.250000, 226.463756)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={60}
          />
        </g>
        <g
          id="go-arrow-inactive"
          transform="translate(234.963756, 205.250000) rotate(120.000000) translate(-234.963756, -205.250000) translate(224.963756, 186.750000)"
          fill={inactiveDirColor}
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
        >
          <polygon
            id="Triangle"
            points="10 0 20 37 0 37"
            onClick={chooseDirection}
            dataangle={30}
          />
        </g>
        <g
          id="go-active"
          transform="translate(249.500000, 151.000000) rotate(90.000000) translate(-249.500000, -151.000000) translate(239.500000, 132.500000)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 0)}
          dataangle={0}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(234.963756, 96.750000) rotate(60.000000) translate(-234.963756, -96.750000) translate(224.963756, 78.250000)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 330)}
          dataangle={330}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(195.250000, 57.036244) rotate(30.000000) translate(-195.250000, -57.036244) translate(185.250000, 38.536244)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 300)}
          dataangle={300}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(131.000000, 24.000000)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 270)}
          dataangle={270}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(86.750000, 57.036244) rotate(-30.000000) translate(-86.750000, -57.036244) translate(76.750000, 38.536244)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 240)}
          dataangle={240}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(47.036244, 96.750000) rotate(300.000000) translate(-47.036244, -96.750000) translate(37.036244, 78.250000)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 210)}
          dataangle={210}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(32.500000, 151.000000) rotate(270.000000) translate(-32.500000, -151.000000) translate(22.500000, 132.500000)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 180)}
          dataangle={180}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(47.036244, 205.250000) rotate(240.000000) translate(-47.036244, -205.250000) translate(37.036244, 186.750000)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 150)}
          dataangle={150}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(86.750000, 244.963756) rotate(210.000000) translate(-86.750000, -244.963756) translate(76.750000, 226.463756)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 120)}
          dataangle={120}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(141.000000, 259.500000) rotate(180.000000) translate(-141.000000, -259.500000) translate(131.000000, 241.000000)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 90)}
          dataangle={90}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(195.250000, 244.963756) rotate(150.000000) translate(-195.250000, -244.963756) translate(185.250000, 226.463756)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 60)}
          dataangle={60}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="go-active"
          transform="translate(234.963756, 205.250000) rotate(120.000000) translate(-234.963756, -205.250000) translate(224.963756, 186.750000)"
          fill="#B6D300"
          stroke={strokeColor}
          strokeLinejoin="bevel"
          strokeWidth={2}
          style={showIf(direction === 30)}
          dataangle={30}
        >
          <polygon id="Triangle" points="10 0 20 37 0 37" />
        </g>
        <g
          id="direction"
          transform={`translate(138.500000, 148.500000) rotate(${direction}) translate(-138.500000, -148.500000) translate(100.000000, 131.000000)`}
          fill="url(#controlCompass)"
          stroke="#FFFFFF"
          strokeWidth={2}
        >
          <g
            id="di2"
            opacity={0}
            transform="translate(27.093512, 17.932200) scale(1, -1) rotate(270.000000) translate(-27.093512, -17.932200) translate(10.093512, -9.067800)"
          >
            <path
              d="M16.5,0 L30.5696348,26.2822208 C32.7228945,29.1306191 34,32.6782525 34,36.5241699 C34,45.9130107 26.3888407,53.5241699 17,53.5241699 C7.61115925,53.5241699 0,45.9130107 0,36.5241699 C0,33.1565402 0.979209301,30.0176171 2.66843437,27.3765941 L16.5,0 Z"
              id="Combined-Shape"
            />
          </g>
          <g
            id="di2"
            transform="translate(50.000000, 18.000000) rotate(90.000000) translate(-50.000000, -18.000000) translate(33.000000, -9.000000)"
          >
            <path
              d="M16.5,0 L30.5696348,26.2822208 C32.7228945,29.1306191 34,32.6782525 34,36.5241699 C34,45.9130107 26.3888407,53.5241699 17,53.5241699 C7.61115925,53.5241699 0,45.9130107 0,36.5241699 C0,33.1565402 0.979209301,30.0176171 2.66843437,27.3765941 L16.5,0 Z"
              id="Combined-Shape"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default SvgComponent;
