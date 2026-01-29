import cloneDeep from 'platform/utilities/data/cloneDeep';
import {
  FIELD_OPTION_IDS,
  FIELD_NAMES,
  FIELD_TITLES,
} from '@@vap-svc/constants/schedulingPreferencesConstants';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const fieldName = FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES;

const noPreference = FIELD_OPTION_IDS[fieldName].NO_PREFERENCE;
const step1Options = {
  [noPreference]: 'No preference',
  continue: 'Select days and time to be scheduled',
};

const formSchema = {
  type: 'object',
  properties: {
    [`${fieldName}-step-1`]: radioSchema({
      title: FIELD_TITLES[fieldName],
      labels: step1Options,
    }),
  },
};

const uiSchema = {
  [`${fieldName}-step-1`]: radioUI({
    title: FIELD_TITLES[fieldName],
    labels: step1Options,
    uswds: true,
  }),
};

export const getFormSchema = () => cloneDeep(formSchema);
export const getUiSchema = () => cloneDeep(uiSchema);
