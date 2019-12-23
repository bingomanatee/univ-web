
import tg from 'tinygradient';
import chroma from 'chroma-js';
import randomFor from '../../randomFor';

const colorGrad = tg([
  { color: 'white', pos: 0 },
  { color: 'rgb(255,153,153)', pos: 0.333 },
  { color: 'rgb(153,153,255)', pos: 0.666 },
  { color: 'white', pos: 1 },
]);
const colorGrad2 = tg([
  { color: 'white', pos: 0 },
  { color: 'rgb(255,51,51)', pos: 0.333 },
  { color: 'rgb(51,51,255)', pos: 0.666 },
  { color: 'white', pos: 1 },
]);
const colorGrad3 = tg([
  { color: 'white', pos: 0 },
  { color: 'rgb(128,0,0)', pos: 0.333 },
  { color: 'rgb(0,0,128)', pos: 0.666 },
  { color: 'white', pos: 1 },
]);

const rand = randomFor('an entirely pseudo random');
export default () => {
  const grad = rand.pick([colorGrad, colorGrad2, colorGrad3]);
  const tc = grad.rgbAt(rand.real(0, 1)).toRgb();
  return chroma(tc.r, tc.g, tc.b).num();
};
