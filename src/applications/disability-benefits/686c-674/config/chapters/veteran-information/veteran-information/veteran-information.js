// import { veteranInformation } from '../../../utilities';
import VeteranInformationComponent from './VeteranInformationComponent.js';

export const schema = {
  type: 'object',
  properties: {},
};

export const uiSchema = {
  'ui:description': VeteranInformationComponent,
  'ui:title': 'This is the personal information we have on file for you.',
  'ui:options': {
    hideOnReview: true,
  },
};
