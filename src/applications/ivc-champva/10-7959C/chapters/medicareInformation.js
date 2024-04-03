import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantListSchema } from '../config/constants';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';

export const blankSchema = { type: 'object', properties: {} };

// Used with a custom page
export const applicantHasMedicareABSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantMedicareStatus: {
      type: 'object',
      properties: {
        enrollment: { type: 'string' },
        otherEnrollment: { type: 'string' },
      },
    },
  }),
};

export const applicantMedicareABContextSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantMedicareStatusContinued: {
      type: 'object',
      properties: {
        medicareContext: { type: 'string' },
        otherMedicareContext: { type: 'string' },
      },
    },
  }),
};

export const applicantMedicarePartACarrierSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        applicantMedicarePartACarrier: {
          'ui:title': 'Carrier’s name',
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
                  )} Medicare Part A carrier`,
                )['ui:title'],
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema(['applicantMedicarePartACarrier'], {
    titleSchema,
    applicantMedicarePartACarrier: { type: 'string' },
  }),
};
