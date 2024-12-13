import {
  emailSchema,
  emailUI,
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import {
  getPhoneAndEmailPageTitle,
  getPhoneAndEmailPageEmailHint,
} from '../helpers';

/** @type {PageSchema} */
const oldPageSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => getPhoneAndEmailPageTitle(formData)),
    veteranPhone: phoneUI('Phone number'),
    veteranEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranPhone: phoneSchema,
      veteranEmailAddress: emailSchema,
    },
  },
};

/** @type {PageSchema} */
const pageSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => getPhoneAndEmailPageTitle(formData)),
    veteranPhone: phoneUI('Phone number'),
    veteranEmailAddress: emailToSendNotificationsUI({
      // no living situation risk = has housing = has email
      required: formData => formData.livingSituation?.NONE,
      updateUiSchema: formData => ({
        'ui:options': {
          hint: getPhoneAndEmailPageEmailHint(formData),
        },
      }),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranPhone: phoneSchema,
      veteranEmailAddress: emailToSendNotificationsSchema,
    },
  },
};

// test on dev before making this change
const useNewPageSchema = environment.isDev() || environment.isLocalhost();

export default (useNewPageSchema ? pageSchema : oldPageSchema);
