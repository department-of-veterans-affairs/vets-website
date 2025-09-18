import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const daytimePhoneUI = phoneUI();
daytimePhoneUI['ui:title'] = 'Daytime telephone number (include area code)';

const eveningPhoneUI = phoneUI();
eveningPhoneUI['ui:title'] = 'Evening telephone number (include area code)';

const emailAddressUI = emailUI();
emailAddressUI['ui:title'] = 'Email address';

export default {
  uiSchema: {
    ...titleUI('How can we reach you?'),
    recipient: {
      phone: {
        daytime: daytimePhoneUI,
        evening: eveningPhoneUI,
      },
      email: emailAddressUI,
    },
  },
  schema: {
    type: 'object',
    properties: {
      recipient: {
        type: 'object',
        properties: {
          phone: {
            type: 'object',
            properties: {
              daytime: phoneSchema,
              evening: phoneSchema,
            },
          },
          email: emailSchema,
        },
      },
    },
  },
};
