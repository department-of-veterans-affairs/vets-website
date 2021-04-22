import { veteranInformation } from '../../../schemaImports';

import VeteranInformationSummary from './VeteranInformationSummary';

export const schema = veteranInformation;

export const uiSchema = {
  'ui:description': VeteranInformationSummary,
  'ui:options': {
    hideOnReview: true,
  },
};
