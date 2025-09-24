import {
  titleUI,
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedallionsDescription } from '../components/MedallionsDescription';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name'),
    'ui:description': formContext => MedallionsDescription(formContext),
    fullName: firstNameLastNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: firstNameLastNameNoSuffixSchema,
    },
    required: ['fullName'],
  },
};
