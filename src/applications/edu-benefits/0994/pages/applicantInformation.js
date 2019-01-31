import { ApplicantInformation } from '../components/ApplicantInformation';

export const uiSchema = {
  'ui:field': ApplicantInformation,
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
