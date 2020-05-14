import { veteranInformation } from '../../../utilities';
import VeteranInformationComponent from './VeteranInformationComponent.js';

export const schema = {
  ...veteranInformation.properties.veteranInformation,
};

export const uiSchema = {
  'ui:description': VeteranInformationComponent,
  'ui:options': {
    hideOnReview: true,
  },
};
