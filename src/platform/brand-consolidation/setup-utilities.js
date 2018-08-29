import { setupFeatureFlag } from './feature-flag';

export default function setupBrandConsolidationUtilities(store) {

  function setup() {
    const state = store.getState();
    setupFeatureFlag(state);
  }

  store.subscribe(setup);

  setup();
}
