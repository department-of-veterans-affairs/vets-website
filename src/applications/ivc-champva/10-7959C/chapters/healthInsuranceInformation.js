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
  const keyname = isPrimary ? 'applicantHasPrimary' : 'applicantHasSecondary';
  const property = isPrimary ? 'hasPrimary' : 'hasSecondary';
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
  const keyname = isPrimary
    ? 'applicantPrimaryProvider'
    : 'applicantSecondaryProvider';
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
  const keyname = isPrimary
    ? 'applicantPrimaryEffectiveDate'
    : 'applicantSecondaryEffectiveDate';
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
  const keyname = isPrimary
    ? 'applicantPrimaryExpirationDate'
    : 'applicantSecondaryExpirationDate';
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
  const keyname = isPrimary
    ? 'applicantPrimaryThroughEmployer'
    : 'applicantSecondaryThroughEmployer';
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
  const keyname = isPrimary
    ? 'applicantPrimaryHasPrescription'
    : 'applicantSecondaryHasPrescription';
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

export function applicantInsuranceEOBSchema(isPrimary) {
  const keyname = isPrimary ? 'applicantPrimaryEOB' : 'applicantSecondaryEOB';
  return {
    uiSchema: {
      applicants: { items: {} },
    },
    schema: applicantListSchema([keyname], {
      [keyname]: {
        type: 'object',
        properties: {
          providesEOB: { type: 'string' },
          _unused: { type: 'string' },
        },
      },
    }),
  };
}

export function applicantInsuranceTypeSchema(isPrimary) {
  const keyname = isPrimary
    ? 'applicantPrimaryInsuranceType'
    : 'applicantSecondaryInsuranceType';
  return {
    uiSchema: {
      applicants: { items: {} },
    },
    schema: applicantListSchema([], {
      [keyname]: {
        type: 'string',
      },
    }),
  };
}

export function applicantMedigapSchema(isPrimary) {
  const keyname = isPrimary ? 'primaryMedigapPlan' : 'secondaryMedigapPlan';
  return {
    uiSchema: {
      applicants: {
        'ui:options': { viewField: ApplicantField },
        items: {
          ...titleUI(
            ({ formData }) =>
              `${applicantWording(formData)} ${
                isPrimary
                  ? formData?.applicantPrimaryProvider
                  : formData?.applicantSecondaryProvider
              } Medigap information`,
          ),
          [keyname]: radioUI({
            title: 'Which type of Medigap plan is the applicant enrolled in?',
            required: () => true,
            labels: MEDIGAP,
          }),
        },
      },
    },
    schema: applicantListSchema([keyname], {
      titleSchema,
      [keyname]: radioSchema(Object.keys(MEDIGAP)),
    }),
  };
}

export function applicantInsuranceCommentsSchema(isPrimary) {
  const val = isPrimary ? 'primary' : 'secondary';
  const keyname = isPrimary
    ? 'primaryAdditionalComments'
    : 'secondaryAdditionalComments';
  return {
    uiSchema: {
      applicants: {
        'ui:options': { viewField: ApplicantField },
        items: {
          ...titleUI(
            ({ formData }) =>
              `${applicantWording(formData)} ${
                isPrimary
                  ? formData?.applicantPrimaryProvider
                  : formData?.applicantSecondaryProvider
              } ${val} health insurance additional comments`,
          ),
          [keyname]: {
            'ui:title':
              'Any additional comments about this applicant’s health insurance?',
            'ui:webComponentField': VaTextInputField,
          },
        },
      },
    },
    schema: applicantListSchema([], {
      titleSchema,
      [keyname]: { type: 'string' },
    }),
  };
}
