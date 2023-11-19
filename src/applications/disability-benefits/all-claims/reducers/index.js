import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import itf from './itf';
import mvi from './mvi';
import { getFormConfig } from '../config/form';
import { getDisabilityLabels } from '../content/disabilityLabels';

const reducer = state => {
  const isReducedContentionList = toggleValues(state)[FEATURE_FLAG_NAMES.disability526ReducedContentionList];
  const formConfig = getFormConfig(getDisabilityLabels(isReducedContentionList));
  return {
    form: createSaveInProgressFormReducer(formConfig),
    itf,
    mvi,
  }
};

export default reducer;