import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  titleUI,
  titleSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantListSchema, requiredFiles } from '../config/constants';
import { applicantWording } from '../../shared/utilities';
import ApplicantField from '../../shared/components/applicantLists/ApplicantField';
import { isRequiredFile } from '../helpers/utilities';
import { fileUploadUi as fileUploadUI } from '../../shared/components/fileUploads/upload';
import {
  fileWithMetadataSchema,
  fileUploadBlurb,
} from '../../shared/components/fileUploads/attachments';

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

export const appMedicareOver65IneligibleUploadSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        ...titleUI(
          ({ _formData, formContext }) =>
            `Upload proof of Medicare ineligibility ${isRequiredFile(
              formContext,
              requiredFiles,
            )}`,
          ({ formData }) => {
            const appName = applicantWording(formData, undefined, false);
            return (
              <>
                <b>{appName}</b> is 65 years or older and you selected that{' '}
                they’re not eligible for Medicare.
                <br />
                <br />
                You’ll need to submit a copy of a letter from the Social
                Security Administration that confirms that <b>{appName}</b>{' '}
                doesn’t qualify for Medicare benefits under anyone’s Social
                Security number.
                <br />
                If you don’t have a copy to upload now, you can send one by mail
                or fax
              </>
            );
          },
        ),
        ...fileUploadBlurb,
        applicantMedicareIneligibleProof: fileUploadUI({
          label: 'Upload proof of Medicare ineligibility',
        }),
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    'view:fileUploadBlurb': blankSchema,
    applicantMedicareIneligibleProof: fileWithMetadataSchema([
      'Letter from the SSA',
    ]),
  }),
};

export const applicantMedicarePartAEffectiveDateSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        applicantMedicarePartAEffectiveDate: currentOrPastDateUI(
          'Medicare Part A effective date',
        ),
        'ui:options': {
          updateSchema: formData => {
            return {
              title: context =>
                titleUI(
                  `${applicantWording(formData, context)} coverage information`,
                )['ui:title'],
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema(['applicantMedicarePartAEffectiveDate'], {
    titleSchema,
    applicantMedicarePartAEffectiveDate: currentOrPastDateSchema,
  }),
};

export const applicantMedicarePartBCarrierSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        applicantMedicarePartBCarrier: {
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
                  )} Medicare Part B carrier`,
                )['ui:title'],
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema(['applicantMedicarePartBCarrier'], {
    titleSchema,
    applicantMedicarePartBCarrier: { type: 'string' },
  }),
};

export const applicantMedicarePartBEffectiveDateSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        applicantMedicarePartBEffectiveDate: currentOrPastDateUI(
          'Medicare Part B effective date',
        ),
        'ui:options': {
          updateSchema: formData => {
            return {
              title: context =>
                titleUI(
                  `${applicantWording(formData, context)} coverage information`,
                )['ui:title'],
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema(['applicantMedicarePartBEffectiveDate'], {
    titleSchema,
    applicantMedicarePartBEffectiveDate: currentOrPastDateSchema,
  }),
};

export const applicantMedicarePharmacySchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantMedicarePharmacyBenefits: {
      type: 'object',
      properties: {
        hasBenefits: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};

export const applicantMedicareAdvantageSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantMedicareAdvantage: {
      type: 'object',
      properties: {
        hasAdvantage: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};

export const applicantMedicareABUploadSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        ...titleUI(
          ({ _formData, formContext }) =>
            `Upload Medicare card ${isRequiredFile(
              formContext,
              requiredFiles,
            )}`,
          ({ formData }) => {
            const appName = applicantWording(formData);
            return (
              <>
                You’ll need to submit a copy of the front and back of {appName}{' '}
                Medicare Part A & B card.
                <br />
                If you don’t have a copy to upload now, you can send it by mail
                or fax
              </>
            );
          },
        ),
        ...fileUploadBlurb,
        applicantMedicarePartAPartBCard: fileUploadUI({
          label: 'Upload Medicare card',
        }),
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    'view:fileUploadBlurb': blankSchema,
    applicantMedicarePartAPartBCard: fileWithMetadataSchema([
      'Front of Medicare Parts A or B card',
      'Back of Medicare Parts A or B card',
    ]),
  }),
};

export const applicantHasMedicareDSchema = {
  uiSchema: {
    applicants: { items: {} },
  },
  schema: applicantListSchema([], {
    applicantMedicareStatusD: {
      type: 'object',
      properties: {
        enrollment: { type: 'string' },
        _unused: { type: 'string' },
      },
    },
  }),
};

export const applicantMedicarePartDCarrierSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        applicantMedicarePartDCarrier: {
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
                  )} Medicare Part D carrier`,
                )['ui:title'],
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema(['applicantMedicarePartDCarrier'], {
    titleSchema,
    applicantMedicarePartDCarrier: { type: 'string' },
  }),
};

export const applicantMedicarePartDEffectiveDateSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        applicantMedicarePartDEffectiveDate: currentOrPastDateUI(
          'Medicare Part D effective date',
        ),
        'ui:options': {
          updateSchema: formData => {
            return {
              title: context =>
                titleUI(
                  `${applicantWording(formData, context)} coverage information`,
                )['ui:title'],
            };
          },
        },
      },
    },
  },
  schema: applicantListSchema(['applicantMedicarePartDEffectiveDate'], {
    titleSchema,
    applicantMedicarePartDEffectiveDate: currentOrPastDateSchema,
  }),
};

export const applicantMedicareDUploadSchema = {
  uiSchema: {
    applicants: {
      'ui:options': {
        viewField: ApplicantField,
      },
      items: {
        ...titleUI(
          ({ _formData, formContext }) =>
            `Upload Medicare card ${isRequiredFile(
              formContext,
              requiredFiles,
            )}`,
          ({ formData }) => {
            const appName = applicantWording(formData);
            return (
              <>
                You’ll need to submit a copy of the front and back of {appName}{' '}
                Medicare Part D card.
                <br />
                If you don’t have a copy to upload now, you can send it by mail
                or fax
              </>
            );
          },
        ),
        ...fileUploadBlurb,
        applicantMedicarePartDCard: fileUploadUI({
          label: 'Upload Medicare card',
        }),
      },
    },
  },
  schema: applicantListSchema([], {
    titleSchema,
    'view:fileUploadBlurb': blankSchema,
    applicantMedicarePartDCard: fileWithMetadataSchema([
      'Front of Medicare Part D card',
      'Back of Medicare Part D card',
    ]),
  }),
};
