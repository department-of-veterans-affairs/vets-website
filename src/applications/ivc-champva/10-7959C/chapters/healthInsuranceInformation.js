import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  titleUI,
  titleSchema,
  //   currentOrPastDateUI,
  //   currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantListSchema } from '../config/constants';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
// import { blankSchema } from './applicantInformation';

export const applicantHasPrimarySchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantHasPrimary: {
      type: 'object',
      properties: {
        hasPrimary: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};

export const applicantPrimaryProviderSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        applicantPrimaryProvider: {
          'ui:title': 'Provider’s name',
          'ui:webComponentField': VaTextInputField,
        },
        'ui:options': {
          updateSchema: formData => {
            return {
              title: context =>
                titleUI(
                  `${applicantWording(
                    formData,
                    context,
                  )} health insurance provider’s name`,
                )['ui:title'],
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema(['applicantPrimaryProvider'], {
    titleSchema,
    applicantPrimaryProvider: { type: 'string' },
  }),
};
