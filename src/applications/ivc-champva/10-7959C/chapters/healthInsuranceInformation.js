import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  titleUI,
  titleSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantListSchema } from '../config/constants';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';

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
        ...titleUI(
          ({ formData }) =>
            `${applicantWording(formData)} health insurance provider’s name`,
        ),
        applicantPrimaryProvider: {
          'ui:title': 'Provider’s name',
          'ui:webComponentField': VaTextInputField,
        },
      },
    },
  },
  schema: applicantListSchema(['applicantPrimaryProvider'], {
    titleSchema,
    applicantPrimaryProvider: { type: 'string' },
  }),
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
