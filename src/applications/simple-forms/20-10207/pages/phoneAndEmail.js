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

/** @type {PageSchema} */
const oldPageSchema = {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      emailAddress: emailSchema,
    },
  },
};

/** @type {PageSchema} */
const pageSchema = {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phone: phoneUI('Phone number'),
    emailAddress: emailToSendNotificationsUI({
      // no living situation risk = has housing = has email
      required: formData => formData.livingSituation?.NONE,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      emailAddress: emailToSendNotificationsSchema,
    },
  },
};

// test on dev before making this change
const useNewPageSchema = environment.isDev() || environment.isLocalhost();

export default (useNewPageSchema ? pageSchema : oldPageSchema);
