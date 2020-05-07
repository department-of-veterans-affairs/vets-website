// import { veteranInformation } from '../../../utilities';
import VeteranInformationComponent from './VeteranInformationComponent.js';

export const schema = {
  type: 'object',
  properties: {
    veteranInformation: {
      type: 'string',
    },
  },
};

export const uiSchema = {
  veteranInformation: {
    'ui:widget': VeteranInformationComponent,
    'ui:title': 'This is the personal information we have on file for you.',
    'ui:options': {
      hideOnReview: true,
    },
  },
};
