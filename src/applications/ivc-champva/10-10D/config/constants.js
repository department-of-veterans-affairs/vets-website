import PropTypes from 'prop-types';

export const MAX_APPLICANTS = 25;

// These proptypes are used with the custom pages that use ApplicantRelationshipPage
export const PAGE_PROPS = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.any,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
export const REVIEW_PAGE_PROPS = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  pagePerItemIndex: PropTypes.any,
  props: PropTypes.object,
  title: PropTypes.func,
};

/* List of required files - not enforced by the form because we want
users to be able to opt into mailing these documents. This object 
performs double duty by also providing a map to presentable names. */
export const REQUIRED_FILES = {
  applicantStepMarriageCert: 'Proof of Marriage (step child)',
  applicantAdoptionPapers: 'Proof of Adoption',
  applicantSchoolCert: 'Proof of School Enrollment',
  applicantMedicarePartAPartBCard: 'Medicare Cards (Parts A/B)',
  applicantMedicarePartDCard: 'Medicare Card (Part D)',
  applicantMedicareIneligibleProof: 'Proof of Medicare Ineligibility',
  applicantOhiCard: 'Other Health Insurance Cards',
  applicantOtherInsuranceCertification: {
    name:
      'Completed and signed CHAMPVA Other Health Insurance (OHI) Certification ',
    linkText: 'Get VA Form 10-7959c to download (opens in a new tab)',
    href: 'https://www.va.gov/find-forms/about-form-10-7959c/',
  },
};

/* Similar to the above, this provides a mapping of file keynames
  to presentable display names for the file review page. */
export const OPTIONAL_FILES = {
  applicantBirthCertOrSocialSecCard:
    'Birth Certificate or Social Security Card',
  applicantHelplessCert: 'VBA Rating (Helpless Child)',
  applicantRemarriageCert: 'Proof of Remarriage or Legal Union, or separation',
  applicantSecondMarriageCert: 'Proof of Marriage or Legal Union to Other',
  applicantSecondMarriageDivorceCert:
    'Proof of Legal Separation from Marriage Or Legal Union to Other',
};

// The backend needs this list so that it can properly match the attachmentId
// on a per applicant basis to the temporary cache files that have been uploaded
// See: https://github.com/department-of-veterans-affairs/va.gov-team/issues/96358
export const FILE_UPLOAD_ORDER = [
  'applicantBirthCertOrSocialSecCard',
  'applicantAdoptionPapers',
  'applicantStepMarriageCert',
  'applicantSchoolCert',
  'applicantHelplessCert',
  'applicantRemarriageCert',
  'applicantMedicarePartAPartBCard',
  'applicantMedicarePartDCard',
  'applicantMedicareIneligibleProof',
  'applicantOhiCard',
  'applicantOtherInsuranceCertification',
];
