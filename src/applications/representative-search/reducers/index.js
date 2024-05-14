import { SearchResultReducer } from './searchResult';
import { SearchQueryReducer } from './searchQuery';
import { ErrorsReducer } from './errors';

const rootReducer = {
  searchResult: SearchResultReducer,
  searchQuery: SearchQueryReducer,
  errors: ErrorsReducer,
};

export default rootReducer;
