import PropTypes from 'prop-types';

export const MAX_APPLICANTS = 25;

// These proptypes are used with the custom pages that use ApplicantRelationshipPage
export const pageProps = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.any,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
export const reviewPageProps = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  pagePerItemIndex: PropTypes.any,
  props: PropTypes.object,
  title: PropTypes.func,
};

/* List of required files - not enforced by the form because we want
users to be able to opt into mailing these documents. This object 
performs double duty by also providing a map to presentable names. */
export const requiredFiles = {
  applicantStepMarriageCert: 'Proof of Marriage (step child)',
  applicantAdoptionPapers: 'Proof of Adoption',
  applicantSchoolCert: 'Proof of School Enrollment',
  applicantMedicarePartAPartBCard: 'Medicare Cards (Parts A/B)',
  applicantMedicarePartDCard: 'Medicare Card (Part D)',
  applicantMedicareIneligibleProof: 'Proof of Medicare Ineligibility',
  applicantOhiCard: 'Other Health Insurance Cards',
  applicantOtherInsuranceCertification: 'VA Form 10-7959C',
};

/* Similar to the above, this provides a mapping of file keynames
  to presentable display names for the file review page. */
export const optionalFiles = {
  applicantBirthCertOrSocialSecCard:
    'Birth Certificate or Social Security Card',
  applicantHelplessCert: 'VBA Rating (Helpless Child)',
  applicantMarriageCert: 'Proof of Marriage or Legal Union to Sponsor',
  applicantSecondMarriageCert: 'Proof of Marriage or Legal Union to Other',
  applicantSecondMarriageDivorceCert:
    'Proof of Legal Separation from Marriage Or Legal Union to Other',
};
