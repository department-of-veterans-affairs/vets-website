import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadBlurbCustom } from 'applications/ivc-champva/shared/components/fileUploads/attachments';
import { applicantWording } from '../../../shared/utilities';
import ApplicantField from '../../../shared/components/applicantLists/ApplicantField';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import { REQUIRED_FILES } from '../../config/constants';
import { uploadWithInfoComponent } from '../Sponsor/sponsorFileUploads';

// This file contains the ui/schemas for applicant file upload screens.

/**
 * Provide a string indicating if a file contained in a form page is in the
 * requiredFiles object
 * @param {object} formContext formContext object from a list loop page
 * @returns a string, either '(Required)' or '(Optional)' depending on if the
 * formContext contained one or more properties that intersect with the
 * requiredFiles object
 */
export function isRequiredFile(formContext) {
  return Object.keys(formContext?.schema?.properties || {}).filter(v =>
    Object.keys(REQUIRED_FILES).includes(v),
  ).length >= 1
    ? '(Required)'
    : '(Optional)';
}

const mailOrFaxLaterMsg =
  'If you don’t have a copy to upload now, you can send one by mail or fax.';

const marriageDocumentList = (
  <>
    Upload a copy of one of these documents:
    <ul>
      <li>
        Marriage certificate, <b>or</b>
      </li>
      <li>
        A document showing proof of a civil union, <b>or</b>
      </li>
      <li>Common-law marriage affidavit</li>
    </ul>
  </>
);

const divorceDocumentList = (
  <>
    <b>If the remarriage has ended</b>, upload a copy of one of these documents:
    <ul>
      <li>
        Divorce decree, <b>or</b>
      </li>
      <li>
        Annulment decree, <b>or</b>
      </li>
      <li>Death certificate</li>
    </ul>
  </>
);

export const applicantBirthCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.birthCert,
  'birth certificates',
);

export const applicantBirthCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload birth certificate ${isRequiredFile(formContext)}`,
        ({ formData }) => (
          <>
            To help us process this application faster, submit a copy of{' '}
            <b>{applicantWording(formData, true, false)}</b> birth certificate.
            <br />
            Submitting a copy can help us process this application faster.
            <br />
            {mailOrFaxLaterMsg}
          </>
        ),
      ),
      ...applicantBirthCertConfig.uiSchema,
      applicantBirthCertOrSocialSecCard: fileUploadUI({
        label: 'Upload a copy of birth certificate',
      }),
    },
  },
};

export const applicantSchoolCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.schoolCert,
  'school certifications',
);

export const applicantSchoolCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of school enrollment ${isRequiredFile(formContext)}`,
        ({ formData }) => {
          const posessive = applicantWording(formData, true, false);
          const nonPosessive = applicantWording(formData, false, false);
          const beingVerb =
            nonPosessive === 'you'
              ? `${nonPosessive}’re`
              : `${nonPosessive} is`;
          return (
            <>
              <p>
                <b>If {beingVerb} already enrolled in school</b>
              </p>
              <p>You’ll need to submit a letter on the school’s letterhead.</p>
              <p>
                Ask the school to write us a letter on school letterhead that
                includes all of these pieces of information:
              </p>
              <ul>
                <li>
                  <b>{posessive}</b> first and last name
                </li>
                <li>
                  The last 4 digits of <b>{posessive}</b> Social Security number
                </li>
                <li>Enrollment status (full-time or part-time)</li>
                <li>Expected graduation date</li>
                <li>
                  Signature and title of a school official (like a director or
                  principal)
                </li>
              </ul>
              <p>
                <b>If {beingVerb} planning to enroll</b>
              </p>
              Submit a copy of {posessive} acceptance letter from the school.
            </>
          );
        },
      ),
      ...applicantSchoolCertConfig.uiSchema,
      applicantSchoolCert: fileUploadUI({
        label: 'Upload proof of school enrollment',
      }),
    },
  },
};

export const applicantHelplessChildConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.helplessCert,
  'VBA decision rating',
);

export const applicantHelplessChildUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload rating decision letter ${isRequiredFile(formContext)}`,
        ({ formData }) => {
          const posessive = applicantWording(formData, true, false);
          return (
            <>
              You’ve selected that <b>{posessive}</b> permanently incapable of
              self support and rated as a helpless child.
              <br />
              <br />
              To help us process this application faster, you can submit a copy
              of a document showing proof of <b>{posessive}</b> rating.
              <br />
              <br />
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantHelplessChildConfig.uiSchema,
      applicantHelplessCert: fileUploadUI({
        label: 'Upload rating decision letter',
      }),
    },
  },
};

export const applicantAdoptedConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.adoptionCert,
  'adoption papers',
);

export const applicantAdoptedUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of adoption ${isRequiredFile(formContext)}`,
        ({ formData }) => (
          <>
            You’ll need to submit a document showing proof of{' '}
            <b>{applicantWording(formData, true, false)} </b>
            adoption (like court ordered adoption papers).
            <br />
            {mailOrFaxLaterMsg}
          </>
        ),
      ),
      ...applicantAdoptedConfig.uiSchema,
      applicantAdoptionPapers: fileUploadUI({
        label: 'Upload proof of adoption',
      }),
    },
  },
};

export const applicantStepChildConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.stepCert,
  'marriage certificates',
);

export const applicantStepChildUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of marriage or legal union ${isRequiredFile(
            formContext,
          )}`,
        ({ formData }) => {
          const posessive = applicantWording(formData, true, false);
          return (
            <>
              You’ll need to submit a document showing proof of the marriage or
              legal union between <b>{posessive}</b> sponsor and{' '}
              <b>{posessive}</b> parent.
              <br />
              <br />
              {marriageDocumentList}
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantStepChildConfig.uiSchema,
      applicantStepMarriageCert: fileUploadUI({
        label: 'Upload proof of marriage or legal union',
      }),
    },
  },
};

export const applicantMedicarePartAPartBCardsConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.medicareABCert,
  'copy of Medicare Parts A or B card',
);

export const applicantMedicarePartAPartBCardsUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload Medicare Part A and B card ${isRequiredFile(formContext)}`,
        ({ formData }) => {
          const posessive = applicantWording(formData, true, false);
          return (
            <>
              You’ll need to submit a copy of the front and back of{' '}
              <b>{posessive}</b> Medicare Part A and B cards.
              <br />
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantMedicarePartAPartBCardsConfig.uiSchema,
      applicantMedicarePartAPartBCard: {
        ...fileUploadUI({
          label: 'Upload Medicare cards',
        }),
        'ui:errorMessages': {
          minItems:
            'You must add both the front and back of your card as separate files.',
        },
      },
    },
  },
};

export const applicantMedicarePartDCardsConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.medicareDCert,
  'copy of Medicare Part D card',
);

export const applicantMedicarePartDCardsUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload Medicare Part D card ${isRequiredFile(formContext)}`,
        ({ formData }) => {
          const posessive = applicantWording(formData, true, false);
          return (
            <>
              You’ll need to submit a copy of the front and back of{' '}
              <b>{posessive}</b> Medicare Part D card.
              <br />
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantMedicarePartDCardsConfig.uiSchema,
      applicantMedicarePartDCard: {
        ...fileUploadUI({
          label: 'Upload Medicare card',
        }),
        'ui:errorMessages': {
          minItems:
            'You must add both the front and back of your card as separate files.',
        },
      },
    },
  },
};

export const appMedicareOver65IneligibleConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.ssIneligible,
  'Medicare ineligibility proof',
);

export const appMedicareOver65IneligibleUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of Medicare ineligibility ${isRequiredFile(
            formContext,
          )}`,
        ({ formData }) => {
          const nonPosessive = applicantWording(formData, false, true);
          return (
            <>
              <b>{nonPosessive}</b> is 65 years or older and you selected that{' '}
              they’re not eligible for Medicare.
              <br />
              <br />
              You’ll need to submit a copy of a letter from the Social Security
              Administration that confirms that they don’t qualify for Medicare
              benefits under anyone’s Social Security number.
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...appMedicareOver65IneligibleConfig.uiSchema,
      applicantMedicareIneligibleProof: fileUploadUI({
        label: 'Upload proof of Medicare ineligibility',
      }),
    },
  },
};

export const applicantOhiCardsConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.healthInsCert,
  'copy of other health insurance card',
);

export const applicantOhiCardsUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload other health insurance cards ${isRequiredFile(formContext)}`,
        <>
          You’ll need to submit a copy of the front and back of all other health
          insurance cards.
          <br />
          <br />
          {mailOrFaxLaterMsg}
        </>,
      ),
      ...applicantOhiCardsConfig.uiSchema,
      applicantOhiCard: {
        ...fileUploadUI({
          label: 'Upload other health insurance cards',
        }),
        'ui:errorMessages': {
          minItems:
            'You must add both the front and back of your card as separate files.',
        },
      },
    },
  },
};

export const applicantOtherInsuranceCertificationConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.va7959cCert,
  'VA Form 10-7959c',
);

export const applicantOtherInsuranceCertificationUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload Other Insurance Certification ${isRequiredFile(formContext)}`,
        () => (
          <>
            You’ll also need to submit a completed Other Insurance Certification
            (VA Form 10-7959C)
            <br />
            <a
              target="_blank"
              rel="noreferrer noopener"
              href="https://www.va.gov/find-forms/about-form-10-7959c/"
            >
              Get VA Form 10-7959C to download (opens in new tab)
            </a>
            <br />
            <br />
            {mailOrFaxLaterMsg}
          </>
        ),
      ),
      ...applicantOtherInsuranceCertificationConfig.uiSchema,
      applicantOtherInsuranceCertification: fileUploadUI({
        label: 'Upload Other Insurance Certification',
      }),
    },
  },
};

export const applicantRemarriageCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.spouseCert,
  'remarriage certificates',
);

// When in list loop, formData is just the list element's data, but when editing
// a list item's data on review-and-submit `formData` may be the complete form
// data object. This provides a consistent interface via formContext.
export function getTopLevelFormData(formContext) {
  return formContext.contentAfterButtons === undefined
    ? formContext.data
    : formContext.contentAfterButtons.props.form.data;
}

// If the beneficiary remarried, collect proof of that remarriage
// and any other marital docs they want to include
export const applicantRemarriageCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ formData, formContext }) =>
          `If ${applicantWording(
            formData,
            false,
            false,
          )} remarried, upload proof of remarriage ${isRequiredFile(
            formContext,
          )}`,
        ({ formData, formContext }) => {
          const nonPosessive = applicantWording(formData, false, false);
          // Inside list loop this lets us grab form data outside the scope of
          // current list element:
          const vetName = getTopLevelFormData(formContext)?.veteransFullName;
          return (
            <>
              If {nonPosessive} remarried after the death of{' '}
              {vetName?.first ?? ''} {vetName?.last ?? ''}, you can help us
              process your application by submitting documents showing proof of
              that remarriage.
              <br />
              <br />
              {marriageDocumentList}
              {divorceDocumentList}
            </>
          );
        },
      ),
      ...fileUploadBlurbCustom(
        <li>You can upload more than one file here.</li>,
        'You can also upload all your supporting documents at the end of this form. Or you can send copies by mail or fax.',
      ),
      applicantRemarriageCert: fileUploadUI({
        label: 'Upload proof of remarriage',
      }),
    },
  },
};

export const applicantSecondMarriageCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of marriage or legal union ${isRequiredFile(
            formContext,
          )}`,
        ({ formData }) => {
          const nonPosessive = applicantWording(formData, false, false);
          return (
            <>
              You’ll need to submit a document showing proof of the marriage or
              legal union between <b>{nonPosessive}</b> and their current spouse
              or partner
              <br />
              <br />
              {marriageDocumentList}
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantRemarriageCertConfig.uiSchema,
      applicantSecondMarriageCert: fileUploadUI({
        label: 'Upload proof of marriage or legal union',
      }),
    },
  },
};

export const applicantSecondMarriageDivorceCertConfig = uploadWithInfoComponent(
  undefined, // acceptableFiles.divorceCert,
  'marriage certificates',
);

export const applicantSecondMarriageDivorceCertUploadUiSchema = {
  applicants: {
    'ui:options': { viewField: ApplicantField },
    items: {
      ...titleUI(
        ({ _formData, formContext }) =>
          `Upload proof of legal separation ${isRequiredFile(formContext)}`,
        ({ formData }) => {
          const nonPosessive = applicantWording(formData, false, false);
          return (
            <>
              To help us process this application faster, you can submit a
              document showing proof of legal separation between{' '}
              <b>{nonPosessive}</b> and the sponsor.
              <br />
              <br />
              Upload a copy of one of these documents:
              <ul>
                <li>
                  Divorce decree, <b>or</b>
                </li>
                <li>
                  Annulment decree
                  <b>or</b>
                </li>
              </ul>
              {mailOrFaxLaterMsg}
            </>
          );
        },
      ),
      ...applicantSecondMarriageDivorceCertConfig.uiSchema,
      applicantSecondMarriageDivorceCert: fileUploadUI({
        label: 'Upload proof of legal separation',
      }),
    },
  },
};
