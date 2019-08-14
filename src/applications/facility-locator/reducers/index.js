import { SearchResultReducer } from './searchResult';
import { SearchQueryReducer } from './searchQuery';
import { FeatureToggleReducer } from './featureToggle';

const rootReducer = {
  featureToggles: FeatureToggleReducer,
  searchResult: SearchResultReducer,
  searchQuery: SearchQueryReducer,
};

export default rootReducer;
