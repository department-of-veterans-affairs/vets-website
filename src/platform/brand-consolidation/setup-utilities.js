import { setupRoutes } from './routes';
import { setupFeatureFlag } from './feature-flag';

export default function setupBrandConsolidationUtilities(store) {
  store.subscribe(() => {
    const state = store.getState();
    setupFeatureFlag(state);
    setupRoutes(state);
  });
}
