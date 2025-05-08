import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { veteranInformation } from '../../../utilities';
import VeteranInformation from './VeteranInformationComponent';

export const schema = {
  ...veteranInformation.properties.veteranInformation,
};

export const uiSchema = {
  ...titleUI('Confirm the personal information we have on file for you.'),
  'ui:description': VeteranInformation,
  'ui:options': {
    hideOnReview: true,
  },
};
