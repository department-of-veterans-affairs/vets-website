import PropTypes from 'prop-types';

export const MAX_APPLICANTS = 3;

export const applicantListSchema = (requireds, propertyList) => {
  return {
    type: 'object',
    properties: {
      applicants: {
        type: 'array',
        minItems: 1,
        maxItems: MAX_APPLICANTS,
        items: {
          type: 'object',
          required: requireds,
          properties: propertyList,
        },
      },
    },
  };
};

// These proptypes are used with the custom pages that use
// ApplicantRelationshipPage
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

export const yesNoOptions = [
  {
    label: 'Yes',
    value: 'yes',
  },
  {
    label: 'No',
    value: 'no',
  },
];

/* List of required files - not enforced by the form because we want
users to be able to opt into mailing these documents. This object 
performs double duty by also providing a map to presentable names. */
export const requiredFiles = {
  applicantMedicareIneligibleProof: 'Proof of Medicare Ineligibility',
  applicantMedicarePartAPartBCard: 'Medicare Cards (Parts A/B)',
  applicantMedicarePartDCard: 'Medicare Card (Part D)',
  primaryInsuranceCard: 'Primary health insurance card',
  secondaryInsuranceCard: 'Secondary health insurance card',
};
