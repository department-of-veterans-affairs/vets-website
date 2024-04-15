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
      label: `Yes, ${
        useFirstPerson ? 'I‘m' : `${applicant} is `
      } enrolled in Medicare`,
      value: 'enrolled',
    },
    {
      label: `No, ${
        useFirstPerson ? "I'm" : `${applicant} is `
      } not eligible for Medicare`,
      value: 'ineligible',
    },
    {
      label: `No, ${
        useFirstPerson ? "I'm" : `${applicant} is `
      } eligible for Medicare but ${
        useFirstPerson ? 'have' : 'has'
      } not been signed up for it yet`,
      value: 'eligibleNotSignedUp',
    },
  ];

  const prompt = `${
    useFirstPerson ? 'Are you' : `Is ${applicant}`
  } enrolled in Medicare Parts A & B?`;

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
    customTitle: `${
      useFirstPerson ? `Your` : `${applicant}'s`
    } Medicare status`,
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
  pagePerItemIndex: PropTypes.string || PropTypes.number,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
