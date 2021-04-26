import CalculatorConstantsReducer from './constants';
import EligibilityReducer from './eligibility';
import FilterReducer from './filters';
import ModalDisplayReducer from './modals';
import PreviewModeReducer from './preview';
import ProfileReducer from './profile';
import CalculatorReducer from './calculator';

const rootReducer = {
  constants: CalculatorConstantsReducer,
  eligibility: EligibilityReducer,
  filters: FilterReducer,
  modals: ModalDisplayReducer,
  preview: PreviewModeReducer,
  profile: ProfileReducer,
  calculator: CalculatorReducer,
};

export default rootReducer;
