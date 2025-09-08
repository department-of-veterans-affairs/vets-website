import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VeteranInformation from './VeteranInformationComponent';

export const schema = {
  type: 'object',
  properties: {},
};

export const uiSchema = {
  ...titleUI('Confirm the personal information we have on file for you.'),
  'ui:description': VeteranInformation,
  'ui:options': {
    hideOnReview: true,
  },
};
