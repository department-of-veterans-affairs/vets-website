import { combineReducers } from 'redux';

import ModalDisplayReducer from './modals';
import PageTitleReducer from './title';
import PreviewModeReducer from './preview';
import CalculatorConstantsReducer from './constants';
import EligibilityReducer from './eligibility';
import AutocompleteReducer from './autocomplete';
import SearchReducer from './search';
import InstitutionDetailsFilterReducer from './filter';
import ProfileReducer from './profile';

const rootReducer = combineReducers({
  modals: ModalDisplayReducer,
  pageTitle: PageTitleReducer,
  preview: PreviewModeReducer,
  constants: CalculatorConstantsReducer,
  eligibility: EligibilityReducer,
  autocomplete: AutocompleteReducer,
  search: SearchReducer,
  filters: InstitutionDetailsFilterReducer,
  profile: ProfileReducer,
});

export default rootReducer;
