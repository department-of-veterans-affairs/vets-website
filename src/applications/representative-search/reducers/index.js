import { SearchResultReducer } from './searchResult';
import { SearchQueryReducer } from './searchQuery';

const rootReducer = {
  searchResult: SearchResultReducer,
  searchQuery: SearchQueryReducer,
};

export default rootReducer;
