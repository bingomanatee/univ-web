import { Store } from '@wonderlandlabs/looking-glass-engine';

const SiteStore = new Store({
  actions: {
  },
})
  .addProp('count', {
    start: 1,
    type: 'int'
  });

export default SiteStore;
