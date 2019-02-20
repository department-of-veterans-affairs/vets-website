import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';

import {
  recentJobApplicationsDescription,
  substantiallyGainfulEmployment,
} from '../content/recentJobApplications';

import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/date';
import RecentJobApplicationField from '../components/RecentJobApplicationField';
import { addressUISchema } from '../utils';

const {
  appliedEmployers,
} = fullSchema.properties.form8940.properties.unemployability.properties;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': unemployabilityPageTitle('Recent job applications'),
    attemptedToObtainEmploymentSinceUnemployability: {
      'ui:title': recentJobApplicationsDescription(),
      'ui:widget': 'yesNo',
    },
    appliedEmployers: {
      'ui:options': {
        viewField: RecentJobApplicationField,
        expandUnder: 'attemptedToObtainEmploymentSinceUnemployability',
        itemName: 'Job',
      },
      items: {
        name: {
          'ui:title': "Company's Name",
        },
        address: addressUISchema(
          'unemployability.appliedEmployers[:index].address',
          null,
          false,
          false,
        ),
        workType: {
          'ui:title': 'Type of work',
        },
        date: currentOrPastDateUI('Date you applied'),
      },
    },
    'view:substantiallyGainfulEmploymentInfo': {
      'ui:title': ' ',
      'ui:description': substantiallyGainfulEmployment(),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        // Should this be in the shared schema?
        attemptedToObtainEmploymentSinceUnemployability: {
          type: 'boolean',
        },
        appliedEmployers,
        'view:substantiallyGainfulEmploymentInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
