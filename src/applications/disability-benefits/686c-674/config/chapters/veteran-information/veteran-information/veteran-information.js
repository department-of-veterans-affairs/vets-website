// import { veteranInformation } from '../../../utilities';
import VeteranInformationComponent from './VeteranInformationComponent.js';

export const schema = {
  type: 'object',
  properties: {},
};

export const uiSchema = {
  'ui:description': VeteranInformationComponent,
  'ui:options': {
    hideOnReview: true,
  },
};
