import autocomplete from './autocomplete';
import calculator from './calculator';
import compare from './compare';
import constants from './constants';
import eligibility from './eligibility';
import filters from './filters';
import modals from './modals';
import preview from './preview';
import profile from './profile';
import search from './search';
import errorReducer from './error';
import filterBeforeResultsReducer from './filterBeforeResultsReducer';
import focusSearchReducer from './searchFocusReducer';
import licenseCertificationSearch from './licenseCertificationSearch';
import institutionPrograms from './institutionPrograms';
import nationalExams from './nationalExams';

const rootReducer = {
  autocomplete,
  calculator,
  compare,
  constants,
  eligibility,
  filters,
  modals,
  preview,
  profile,
  search,
  errorReducer,
  filterBeforeResultsReducer,
  focusSearchReducer,
  licenseCertificationSearch,
  institutionPrograms,
  nationalExams,
};

export default rootReducer;
