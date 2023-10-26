import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';

import { SearchResultReducer } from './searchResult';
import { SearchQueryReducer } from './searchQuery';
import formConfig from '../config/form';

const rootReducer = {
  searchResult: SearchResultReducer,
  searchQuery: SearchQueryReducer,
  form: createSaveInProgressFormReducer(formConfig),
};

export default rootReducer;
