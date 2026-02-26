import {
  emailSchema,
  emailUI,
  internationalPhoneUI,
  internationalPhoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isCustodian } from '../utils/helpers';

export const contactTitle = formData =>
  `${
    isCustodian(formData) ? 'Child’s' : 'Your'
  } email address and phone number`;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(({ formData }) => contactTitle(formData)),
    claimantEmail: emailUI('Email'),
    claimantPhone: internationalPhoneUI('Primary phone number'),
  },
  schema: {
    type: 'object',
    required: ['claimantEmail', 'claimantPhone'],
    properties: {
      claimantEmail: emailSchema,
      claimantPhone: internationalPhoneSchema(),
    },
  },
};
