import {
  recentJobApplicationsDescription,
  substantiallyGainfulEmployment,
} from '../content/recentJobApplications';

export const uiSchema = {
  'ui:title': 'Recent job applications',
  'ui:description': recentJobApplicationsDescription(),
  'view:recentJobApplications': {
    'ui:title': ' ',
    'ui:widget': 'yesNo',
  },
  'view:substantiallyGainfulEmploymentInfo': {
    'ui:title': ' ',
    'ui:description': substantiallyGainfulEmployment(),
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:recentJobApplications': {
      type: 'boolean',
    },
    'view:substantiallyGainfulEmploymentInfo': {
      type: 'object',
      properties: {},
    },
  },
};
