import {
  addressUI,
  addressSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  emailUI,
  emailSchema,
  fullNameUI,
  fullNameSchema,
  phoneUI,
  phoneSchema,
  ssnUI,
  ssnSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
import { MAX_APPLICANTS, applicantListSchema } from '../config/constants';

export const blankSchema = { type: 'object', properties: {} };

export const applicantNameDobSchema = {
  uiSchema: {
    ...titleUI('Applicant name and date of birth'),
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
        keepInPageOnReview: true,
        useDlWrap: false,
        itemName: 'Applicant',
        confirmRemove: true,
      },
      'ui:errorMessages': {
        minItems: 'Must have at least one applicant listed.',
        maxItems: `You can add up to ${MAX_APPLICANTS} in a single application. If you need to add more than ${MAX_APPLICANTS} applicants, you need to submit a separate application for them.`,
      },
      items: {
        applicantName: fullNameUI(),
        applicantDOB: dateOfBirthUI({ required: true }),
      },
    },
  },
  schema: applicantListSchema(['applicantDOB'], {
    titleSchema,
    applicantName: fullNameSchema,
    applicantDOB: dateOfBirthSchema,
  }),
};

export const applicantStartSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        'ui:options': {
          updateSchema: formData => {
            return {
              title: context =>
                titleUI(
                  `${applicantWording(formData, context)} information`,
                  `Next we'll ask more questions about ${applicantWording(
                    formData,
                    context,
                    false,
                    false,
                  )}. This includes social security number, mailing address, 
                    contact information, relationship to sponsor, and health 
                    insurance information.`,
                )['ui:title'],
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    'view:description': blankSchema,
  }),
};

export const applicantSsnSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        'ui:options': {
          updateSchema: formData => {
            return {
              title: context =>
                titleUI(
                  `${applicantWording(
                    formData,
                    context,
                  )} identification information`,
                  `You must enter a Social Security number`,
                )['ui:title'],
            };
          },
        },
        applicantSsn: ssnUI(),
      },
    },
  },
  schema: applicantListSchema(['applicantSsn'], {
    titleSchema,
    applicantSsn: ssnSchema,
  }),
};

export const applicantPreAddressSchema = {
  uiSchema: {
    applicants: {
      items: {},
      'ui:options': {
        viewField: ApplicantField,
      },
    },
  },
  schema: applicantListSchema([], {}),
};

export const applicantAddressInfoSchema = {
  uiSchema: {
    applicants: {
      'ui:options': { viewField: ApplicantField },
      items: {
        'view:description': {
          'ui:description':
            'We’ll send any important information about your application to this address.',
        },
        applicantAddress: {
          ...addressUI({
            labels: {
              militaryCheckbox:
                'Address is on a United States military base outside the country.',
            },
          }),
        },
        'ui:options': {
          updateSchema: formData => {
            return {
              title: context =>
                titleUI(
                  `${applicantWording(formData, context)} mailing address`,
                )['ui:title'], // grab styled title rather than plain text
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema([], {
    'view:description': blankSchema,
    applicantAddress: addressSchema(),
  }),
};

export const applicantContactInfoSchema = {
  uiSchema: {
    applicants: {
      'ui:options': { viewField: ApplicantField },
      items: {
        'ui:options': {
          updateSchema: formData => {
            return {
              title: context =>
                titleUI(
                  `${applicantWording(formData, context)} phone number`,
                  `We’ll use this information to contact ${applicantWording(
                    formData,
                    context,
                    false,
                    false,
                  )} if we have more questions.`,
                )['ui:title'],
            };
          },
        },
        applicantPhone: phoneUI(),
        applicantEmailAddress: emailUI(),
      },
    },
  },
  schema: applicantListSchema(['applicantPhone'], {
    applicantPhone: phoneSchema,
    applicantEmailAddress: emailSchema,
  }),
};
