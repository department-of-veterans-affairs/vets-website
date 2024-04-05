// import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
// import {
//   titleUI,
//   titleSchema,
//   currentOrPastDateUI,
//   currentOrPastDateSchema,
// } from 'platform/forms-system/src/js/web-component-patterns';
import { applicantListSchema } from '../config/constants';
// import { applicantWording } from '../../shared/utilities';
// import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
// import { blankSchema } from './applicantInformation';

export const applicantHasOtherPrimarySchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantHasOtherPrimary: {
      type: 'object',
      properties: {
        enrollment: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};
