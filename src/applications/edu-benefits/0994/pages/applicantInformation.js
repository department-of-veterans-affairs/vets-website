import ApplicantInformation from '../containers/ApplicantInformation';

export const uiSchema = {
  'ui:reviewWidget': ApplicantInformation,
  'view:applicantInfo': {
    'ui:description': ApplicantInformation,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:applicantInfo': {
      type: 'object',
      properties: {},
    },
  },
};
