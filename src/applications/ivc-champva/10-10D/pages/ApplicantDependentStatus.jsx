import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from './ApplicantRelationshipPage';

const KEYNAME = 'applicantDependentStatus';
const PRIMARY = 'status';
const SECONDARY = 'otherStatus';

function generateOptions({ data, pagePerItemIndex }) {
  const {
    currentListItem,
    personTitle,
    applicant,
    useFirstPerson,
    relative,
    beingVerbPresent,
    relativePossessive,
  } = appRelBoilerplate({ data, pagePerItemIndex });

  const customTitle = `${
    useFirstPerson ? `Your` : `${applicant}’s`
  } dependent status`;

  const relativeBeingVerb = `${relative} ${beingVerbPresent}`;

  const options = [
    {
      label: `${relativeBeingVerb} age 18-23 and enrolled in, or intending to enroll in, college or another educational institution within the next term`,
      value: 'enrolledOrIntendsToEnroll',
    },
    {
      label: `${relativeBeingVerb} over the age of 18, permanently incapable of self-support and was rated as a helpless child`,
      value: 'over18HelplessChild',
    },
    {
      label: `${
        applicant && !useFirstPerson ? `${applicant}` : 'My'
      } dependent status is not listed`,
      value: 'other',
    },
  ];

  const customOtherDescription = `Since ${
    applicant && !useFirstPerson ? `${applicant}’s` : 'Your'
  } status was not listed, please describe it here`;

  return {
    options,
    useFirstPerson,
    relativePossessive,
    relativeBeingVerb,
    applicant,
    personTitle,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    currentListItem,
    customTitle,
    description: customTitle,
    customOtherDescription,
  };
}

export function ApplicantDependentStatusPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantDependentStatusReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}
