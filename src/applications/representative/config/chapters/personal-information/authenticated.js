import PersonalInformation from '../../../containers/PersonalInformation';

export const title = 'Veteran’s Name and Date of Birth';

export const schema = {
  type: 'object',
  title,
  properties: {
    'view:informationOnFile': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:informationOnFile': {
    'ui:field': PersonalInformation,
  },
};
