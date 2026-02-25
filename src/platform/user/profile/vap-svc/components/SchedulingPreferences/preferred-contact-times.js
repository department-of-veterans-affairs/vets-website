import cloneDeep from 'platform/utilities/data/cloneDeep';
import {
  FIELD_OPTION_IDS_INVERTED,
  FIELD_NAMES,
  FIELD_TITLES,
} from '@@vap-svc/constants/schedulingPreferencesConstants';

import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';

const formSchema = {
  type: 'object',
  required: [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
  properties: {
    [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: {
      type: 'string',
      enum: Object.keys(
        FIELD_OPTION_IDS_INVERTED[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
      ),
    },
  },
};

const uiSchema = {
  [FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD]: {
    'ui:title': FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
    'ui:widget': 'select',
    'ui:options': {
      labels:
        FIELD_OPTION_IDS_INVERTED[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
    },
    'ui:webComponentField': VaSelectField,
  },
};

export const getFormSchema = () => cloneDeep(formSchema);
export const getUiSchema = () => cloneDeep(uiSchema);
