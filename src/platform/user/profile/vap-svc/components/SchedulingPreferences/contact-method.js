import cloneDeep from 'platform/utilities/data/cloneDeep';
import {
  FIELD_OPTION_IDS,
  FIELD_NAMES,
} from 'platform/user/profile/vap-svc/constants/schedulingPreferencesConstants';

import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';

const formSchema = {
  type: 'object',
  properties: {
    contactMethod: {
      type: 'string',
      enum: FIELD_OPTION_IDS.CONTACT_METHOD,
      enumNames: FIELD_NAMES.CONTACT_METHOD,
    },
  },
  required: ['contactMethod'],
};

const uiSchema = {
  contactMethod: {
    'ui:title': 'What is the best way to contact you to schedule appointments?',
    'ui:webComponentField': VaSelectField,
    'ui:required': true,
  },
};

export const getFormSchema = () => cloneDeep(formSchema);
export const getUiSchema = () => cloneDeep(uiSchema);
