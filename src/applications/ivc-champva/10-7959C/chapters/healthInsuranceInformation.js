import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  titleUI,
  titleSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantListSchema } from '../config/constants';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';

const MEDIGAP = {
  medigapPlanA: 'Medigap Plan A',
  medigapPlanB: 'Medigap Plan B',
  medigapPlanC: 'Medigap Plan C',
  medigapPlanD: 'Medigap Plan D',
  medigapPlanF: 'Medigap Plan F',
  medigapPlanG: 'Medigap Plan G',
  medigapPlanK: 'Medigap Plan K',
  medigapPlanL: 'Medigap Plan L',
  medigapPlanM: 'Medigap Plan M',
};

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

/*
Primary health insurance and secondary health insurance information use
the same set of questions. This schema works for either depending on
the boolean passed in (if true, we generate the primary schema, if false
we generate the secondary schema).
*/
export const applicantProviderSchema = isPrimary => {
  const keyname = `applicant${isPrimary ? 'Primary' : 'Secondary'}Provider`;
  return {
    uiSchema: {
      applicants: {
        'ui:options': {
          viewField: ApplicantField,
        },
        items: {
          ...titleUI(
            ({ formData }) =>
              `${applicantWording(formData)} ${
                isPrimary ? '' : 'secondary'
              } health insurance provider’s name`,
          ),
          [keyname]: {
            'ui:title': 'Provider’s name',
            'ui:webComponentField': VaTextInputField,
          },
        },
      },
    },
    schema: applicantListSchema([keyname], {
      titleSchema,
      [keyname]: { type: 'string' },
    }),
  };
};

export const applicantPrimaryEffectiveDateSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        ...titleUI(
          ({ formData }) =>
            `${applicantWording(formData)} ${
              formData?.applicantPrimaryProvider
            } insurance effective date`,
        ),
        applicantPrimaryEffectiveDate: currentOrPastDateUI(
          'Health insurance effective date',
        ),
      },
    },
  },
  schema: applicantListSchema(['applicantPrimaryEffectiveDate'], {
    titleSchema,
    applicantPrimaryEffectiveDate: currentOrPastDateSchema,
  }),
};

export const applicantPrimaryExpirationDateSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        ...titleUI(
          ({ formData }) =>
            `${applicantWording(formData)} ${
              formData?.applicantPrimaryProvider
            } insurance expiration date`,
        ),
        applicantPrimaryExpirationDate: currentOrPastDateUI(
          'Health insurance expiration date',
        ),
      },
    },
  },
  schema: applicantListSchema(['applicantPrimaryExpirationDate'], {
    titleSchema,
    applicantPrimaryExpirationDate: currentOrPastDateSchema,
  }),
};

export const applicantPrimaryThroughEmployerSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantPrimaryThroughEmployer: {
      type: 'object',
      properties: {
        throughEmployer: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};

export const applicantPrimaryPrescriptionSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantPrimaryHasPrescription: {
      type: 'object',
      properties: {
        hasPrescription: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};

export const applicantPrimaryEOBSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantPrimaryEOB: {
      type: 'object',
      properties: {
        providesEOB: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};

export const applicantPrimaryTypeSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantPrimaryInsuranceType: {
      type: 'string',
    },
  }),
};

export const applicantPrimaryMedigapSchema = {
  uiSchema: {
    applicants: {
      'ui:options': { viewField: ApplicantField },
      items: {
        ...titleUI(
          ({ formData }) =>
            `${applicantWording(formData)} ${
              formData?.applicantPrimaryProvider
            } Medigap information`,
        ),
        primaryMedigapPlan: radioUI({
          title: 'Which type of Medigap plan is the applicant enrolled in?',
          required: () => true,
          labels: MEDIGAP,
        }),
      },
    },
  },
  schema: applicantListSchema(['primaryMedigapPlan'], {
    titleSchema,
    primaryMedigapPlan: radioSchema(Object.keys(MEDIGAP)),
  }),
};

export const applicantPrimaryCommentsSchema = {
  uiSchema: {
    applicants: {
      'ui:options': { viewField: ApplicantField },
      items: {
        ...titleUI(
          ({ formData }) =>
            `${applicantWording(formData)} ${
              formData?.applicantPrimaryProvider
            } additional comments`,
        ),
        primaryAdditionalComments: {
          'ui:title':
            'Any additional comments about this applicant’s health insurance?',
          'ui:webComponentField': VaTextInputField,
        },
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    primaryAdditionalComments: { type: 'string' },
  }),
};

export const applicantHasSecondarySchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantHasSecondary: {
      type: 'object',
      properties: {
        hasSecondary: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};
