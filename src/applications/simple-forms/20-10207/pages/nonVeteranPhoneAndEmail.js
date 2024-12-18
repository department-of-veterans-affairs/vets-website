import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  getPhoneAndEmailPageEmailHint,
  getPhoneAndEmailPageTitle,
} from '../helpers';

/** @type {PageSchema} */
const pageSchema = {
  uiSchema: {
    ...titleUI(({ formData }) => getPhoneAndEmailPageTitle(formData)),
    nonVeteranPhone: phoneUI('Phone number'),
    nonVeteranEmailAddress: emailToSendNotificationsUI({
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
      nonVeteranPhone: phoneSchema,
      nonVeteranEmailAddress: emailToSendNotificationsSchema,
    },
  },
};

export default pageSchema;
