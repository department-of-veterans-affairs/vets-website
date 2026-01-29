import {
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern';
import {
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns/ssnPattern';
import {
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns';
import VeteranLookupButton from '../components/VeteranLookupButton';

/**
 * Veteran Identification Page
 *
 * This page collects the veteran's identifying information so the representative
 * can file a 526EZ on their behalf. The information is used to:
 * 1. Perform an MVI lookup to get the veteran's ICN
 * 2. Include in the submission payload for EVSS/Lighthouse
 *
 * Fields:
 * - fullName (first, middle, last, suffix)
 * - ssn (Social Security Number)
 * - dateOfBirth
 */

export const uiSchema = {
  'ui:title': 'Veteran information',
  'ui:description':
    'Enter the veteran\u2019s information as it appears on their official documents.',
  fullName: fullNameUI(title => `Veteran\u2019s ${title}`),
  ssn: ssnUI('Veteran\u2019s Social Security number'),
  dateOfBirth: dateOfBirthUI('Veteran\u2019s date of birth'),
  'view:veteranLookup': {
    'ui:field': VeteranLookupButton,
    'ui:options': {
      hideOnReview: true,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['ssn', 'dateOfBirth'],
  properties: {
    fullName: fullNameSchema,
    ssn: ssnSchema,
    dateOfBirth: dateOfBirthSchema,
    'view:veteranLookup': {
      type: 'object',
      properties: {},
    },
    // Hidden field to store the veteran ICN after successful lookup
    veteranIcn: {
      type: 'string',
    },
    'view:mviLookupComplete': {
      type: 'boolean',
    },
  },
};

export default {
  uiSchema,
  schema,
};
