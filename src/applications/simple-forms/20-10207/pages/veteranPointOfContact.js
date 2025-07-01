import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/** @type {PageSchema} */
const pageSchema = {
  uiSchema: {
    ...titleUI(
      'Veteran’s point of contact',
      'To help us process this request, we may need to contact the Veteran. As a 3rd party filling out this form on their behalf, you may list yourself as the point of contact, or you may add another person. By adding a point of contact you agree to let us contact this person about this form.',
    ),
    pointOfContactName: {
      'ui:title': 'Name of Veteran’s point of contact',
      'ui:webComponentField': VaTextInputField,
      'ui:required': formData => !formData.veteranEmailAddress,
    },
    pointOfContactPhone: phoneUI(
      'Telephone number of Veteran’s point of contact',
    ),
    pointOfContactEmail: emailToSendNotificationsUI({
      hint:
        'We’ll use this email to send the Veteran’s point of contact notifications about your form submission',
      required: formData => !formData.veteranEmailAddress,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      pointOfContactName: {
        type: 'string',
        maxLength: 40,
      },
      pointOfContactPhone: phoneSchema,
      pointOfContactEmail: emailToSendNotificationsSchema,
    },
  },
};

export default pageSchema;
