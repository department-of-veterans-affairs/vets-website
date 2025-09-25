import { phoneUI } from 'platform/forms-system/src/js/web-component-patterns';
import EditInternationalPhonePage from '../../../components/EditInternationalPhonePage';

// Wikipedia says "E.164 permits a maximum length of 15 digits", but RBPS has
// an 11 digit limit
const internationalPhoneDigitLimit = 11;

const intPhoneSchema = {
  type: 'string',
  // needs to allow empty string OR 15 digits for downstream services
  pattern: `^$|^\\d{1,${internationalPhoneDigitLimit}}$`,
};

/** @type {PageSchema} */
export default {
  title: 'Edit international number',
  path: 'veteran-contact-information/international-phone',
  hideNavButtons: true,
  CustomPage: EditInternationalPhonePage,
  CustomPageReview: null,
  uiSchema: {
    internationalPhone: {
      ...phoneUI({
        title: 'International number',
        errorMessages: {
          pattern: `Enter an international phone number up to ${internationalPhoneDigitLimit} digits`,
        },
      }),
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      internationalPhone: intPhoneSchema,
    },
  },
};
