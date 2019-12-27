import _N from '@wonderlandlabs/n';
import configUniverse from './configUniverse';
import configGalaxy from './configGalaxy';
import pixiStreamFactory from '../../pixiStreamFactory';

let stream;
export const getUniverse = () => stream;

export default ({ size, history }) => {
  stream = pixiStreamFactory({ size });
  stream
    .addChild('history', history)
    .addSubStream('currentGalaxyName', '');

  configUniverse(stream);
  configGalaxy(stream);

  return stream;
};
