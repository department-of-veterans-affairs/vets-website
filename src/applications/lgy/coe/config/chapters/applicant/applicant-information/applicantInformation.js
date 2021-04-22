import { applicantInformation } from '../../../schemaImports';

import ApplicantInformationSummary from './ApplicantInformationSummary';

export const schema = applicantInformation;

export const uiSchema = {
  'ui:description': ApplicantInformationSummary,
  'ui:options': {
    hideOnReview: true,
  },
};
