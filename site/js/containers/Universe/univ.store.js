import _N from '@wonderlandlabs/n';
import configUniverse from './configUniverse';
import pixiStreamFactory from '../../pixiStreamFactory';

let universe;
export const getUniverse = () => universe;

export default ({ size, history }) => {
  universe = pixiStreamFactory({ size });
  universe
    .addChild('history', history)
    .addSubStream('currentGalaxyName', '')
    .addAction('updateMousePos', (store, x, y) => {
      if (_N(x).isValid) {
        store.do.setX(x);
        store.do.setY(y);
      }
    }, true);

  configUniverse(universe);

/*  universe.watch('currentGalaxyName', ({ name, value }) => {
    console.log('watch: current galaxy name set to ', value);
    if (!value) {
      universe.do.setCurrentGalaxy(null);
    } else universe.do.tryToLoadGalaxyFromName();
  });*/

  return universe;
};
