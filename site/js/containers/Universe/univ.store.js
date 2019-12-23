import _N from '@wonderlandlabs/n';
import configUniverse from './configUniverse';
import pixiStreamFactory from '../../pixiStreamFactory';


let univStore;
export const getUniverse = () => univStore;

export default ({ size, history }) => {
  univStore = pixiStreamFactory({ size });
  univStore
    .addChild('history', history)
    .addSubStream('currentGalaxyName', '')
    .addAction('updateMousePos', (store, x, y) => {
      if (_N(x).isValid) {
        store.do.setX(x);
        store.do.setY(y);
      }
    }, true);

  configUniverse(univStore);

  /*  univStore.watch('currentGalaxyName', ({ name, value }) => {
    console.log('watch: current galaxy name set to ', value);
    if (!value) {
      univStore.do.setCurrentGalaxy(null);
    } else univStore.do.tryToLoadGalaxyFromName();
  }); */

  return univStore;
};
