import PropTypes from 'prop-types';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const KEYNAME = 'applicantMedicareStatus';
const PRIMARY = 'eligibility';
const SECONDARY = 'otherIneligible';

export function generateOptions({ data, pagePerItemIndex }) {
  const {
    currentListItem,
    personTitle,
    applicant,
    useFirstPerson,
    relative,
    beingVerbPresent,
    relativePossessive,
  } = appRelBoilerplate({ data, pagePerItemIndex });

  const options = [
    {
      label: `Yes, ${applicant} is enrolled in Medicare`,
      value: 'enrolled',
    },
    {
      label: `No, ${applicant} is not eligible for Medicare`,
      value: 'ineligible',
    },
    {
      label: `No, ${applicant} is eligible for Medicare but has not been signed up for it yet`,
      value: 'eligibleNotSignedUp',
    },
  ];

  const prompt = `Is ${applicant} enrolled in Medicare Parts A & B?`;

  return {
    options,
    currentListItem,
    personTitle,
    relativePossessive,
    relativeBeingVerb: `${relative} ${beingVerbPresent}`,
    useFirstPerson,
    applicant,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    customTitle: `${applicant}'s Medicare status`,
    description: prompt,
  };
}

// Using the widely customizable ApplicantRelationshipPage
// as it now functions like a generic radioUI + other text field:
export function ApplicantMedicareStatusPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicareStatusReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicareStatusReviewPage.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  props: PropTypes.object,
  title: PropTypes.func,
};

ApplicantMedicareStatusPage.propTypes = {
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  pagePerItemIndex: PropTypes.string,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
