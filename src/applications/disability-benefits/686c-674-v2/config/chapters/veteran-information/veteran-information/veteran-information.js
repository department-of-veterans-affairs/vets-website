import { veteranInformation } from '../../../utilities';
import VeteranInformation from './VeteranInformationComponent';

export const schema = {
  ...veteranInformation.properties.veteranInformation,
};

export const uiSchema = {
  'ui:description': VeteranInformation,
  'ui:options': {
    hideOnReview: true,
  },
};
