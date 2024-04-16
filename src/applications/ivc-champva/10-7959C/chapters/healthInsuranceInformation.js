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

function insuranceName(applicant, isPrimary) {
  return isPrimary
    ? applicant?.applicantPrimaryProvider
    : applicant?.applicantSecondaryProvider;
}

/*
Primary health insurance and secondary health insurance information use
the same set of questions. This schema works for either depending on
the boolean passed in (if true, we generate the primary schema, if false
we generate the secondary schema). Using this pattern for all primary/secondary
schemas
*/
export function applicantHasInsuranceSchema(isPrimary) {
  const val = isPrimary ? 'Primary' : 'Secondary';
  const keyname = `applicantHas${val}`;
  const property = `has${val}`;
  return {
    uiSchema: {
      applicants: { items: {} },
    },
    schema: applicantListSchema([], {
      [keyname]: {
        type: 'object',
        properties: {
          [property]: { type: 'string' },
          _unused: { type: 'string' },
        },
      },
    }),
  };
}

export function applicantProviderSchema(isPrimary) {
  const keyname = `applicant${isPrimary ? 'Primary' : 'Secondary'}Provider`;
  return {
    uiSchema: {
      applicants: {
        'ui:options': { viewField: ApplicantField },
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
}

export function applicantInsuranceEffectiveDateSchema(isPrimary) {
  const keyname = `applicant${
    isPrimary ? 'Primary' : 'Secondary'
  }EffectiveDate`;
  return {
    uiSchema: {
      applicants: {
        'ui:options': { viewField: ApplicantField },
        items: {
          ...titleUI(
            ({ formData }) =>
              `${applicantWording(formData)} ${insuranceName(
                formData,
                isPrimary,
              )} ${
                isPrimary ? 'primary' : 'secondary'
              } insurance effective date`,
          ),
          [keyname]: currentOrPastDateUI('Health insurance effective date'),
        },
      },
    },
    schema: applicantListSchema([keyname], {
      titleSchema,
      [keyname]: currentOrPastDateSchema,
    }),
  };
}

export function applicantInsuranceExpirationDateSchema(isPrimary) {
  const keyname = `applicant${
    isPrimary ? 'Primary' : 'Secondary'
  }ExpirationDate`;
  return {
    uiSchema: {
      applicants: {
        'ui:options': { viewField: ApplicantField },
        items: {
          ...titleUI(
            ({ formData }) =>
              `${applicantWording(formData)} ${insuranceName(
                formData,
                isPrimary,
              )} ${
                isPrimary ? 'primary' : 'secondary'
              } insurance expiration date`,
          ),
          [keyname]: currentOrPastDateUI('Health insurance expiration date'),
        },
      },
    },
    schema: applicantListSchema([keyname], {
      titleSchema,
      [keyname]: currentOrPastDateSchema,
    }),
  };
}

export function applicantInsuranceThroughEmployerSchema(isPrimary) {
  const keyname = `applicant${
    isPrimary ? 'Primary' : 'Secondary'
  }ThroughEmployer`;
  return {
    uiSchema: {
      applicants: { items: {} },
    },
    schema: applicantListSchema([keyname], {
      [keyname]: {
        type: 'object',
        properties: {
          throughEmployer: { type: 'string' },
          _unused: { type: 'string' },
        },
      },
    }),
  };
}

export function applicantInsurancePrescriptionSchema(isPrimary) {
  const keyname = `applicant${
    isPrimary ? 'Primary' : 'Secondary'
  }HasPrescription`;
  return {
    uiSchema: {
      applicants: { items: {} },
    },
    schema: applicantListSchema([keyname], {
      [keyname]: {
        type: 'object',
        properties: {
          hasPrescription: { type: 'string' },
          _unused: { type: 'string' },
        },
      },
    }),
  };
}

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
