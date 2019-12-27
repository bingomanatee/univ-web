import { ValueStream } from '@wonderlandlabs/looking-glass-engine';
import * as PIXI from 'pixi.js';
import _ from 'lodash';
import _N from '@wonderlandlabs/n';
import { Vector2 } from './three/Vector2';
/**
 * this is a general portal that has a PIXI display element
 * @param size {Object}
 * @returns {ValueStream}
 */
export default ({ size }) => {
  const stream = new ValueStream('home-stream')
    .addProp('x', 0, 'number')
    .addProp('y', 0, 'number')
    .addProp('ele', null)
    .addProp('width', _.get(size, 'width', 0), 'number')
    .addProp('height', _.get(size, 'height', 0), 'number')
    .addProp('app', null)
    .addProp('screenCenter', new Vector2(0, 0))
    .addAction('updateCenter', (store) => {
      store.do.setScreenCenter(new Vector2(store.my.width / 2, store.my.height / 2));
    })
    .addAction('tryInit', (store, ele, iSize) => {
      if (ele && !store.my.app) {
        store.do.setEle(ele);
        const app = new PIXI.Application({ transparent: true, forceFXAA: true });
        store.do.setApp(app);
        if (iSize) store.do.resizeApp(iSize);
        ele.innerHTML = '';
        ele.appendChild(app.view);
        store.emit('initApp');
      }
    }, true)
    .addAction('resizeApp', (store, { width, height }) => {
      const app = store.get('app');
      store.set('width', width, 'height', height);
      if (app) {
        app.renderer.resize(width, height);
        store.emit('resized', { width, height });
      }
    })
    .addAction('updateMousePos', (store, x, y) => {
      if (_N(x).isValid) {
        store.do.setX(x);
        store.do.setY(y);
      }
    }, true);

  // purge the app when the stream is shut down
  stream.subscribe(() => {}, () => {}, () => {
    const app = stream.my.app;
    if (app) {
      app.destroy();
    }
  });
  stream.watch('width', 'updateCenter');
  stream.watch('height', 'updateCenter');

  return stream;
};
