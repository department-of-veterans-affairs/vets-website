import ApplicantInformation from '../containers/ApplicantInformation';

export const uiSchema = {
  'ui:reviewWidget': ApplicantInformation,
  'view:test': {
    'ui:description': ApplicantInformation,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:test': {
      type: 'object',
      properties: {},
    },
  },
};
