import { Store } from '@wonderlandlabs/looking-glass-engine';

export default (props) => {
  const BetaStore = new Store({
    actions: {
    },
  })
    .addProp('count', {
      start: 1,
      type: 'integer',
    });

  return BetaStore;
};
