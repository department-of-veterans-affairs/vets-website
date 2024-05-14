import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

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

  const customTitle = `${applicant}’s status`;

  const relativeBeingVerb = `${relative} ${beingVerbPresent}`;

  const options = [
    {
      label: `${relativeBeingVerb} between the ages of 18 and 23 years old and ${beingVerbPresent} enrolled as a student in a high school, college, or vocational school`,
      value: 'enrolled',
    },
    {
      label: `${relativeBeingVerb} between the ages of 18 and 23 years old and plans to enroll as a student in a high school, college, or vocational school`,
      value: 'intendsToEnroll',
    },
    {
      label: `${relativeBeingVerb} over the age of 18, permanently incapable of self-support and was rated as a helpless child`,
      value: 'over18HelplessChild',
    },
  ];

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
    description: `Which of these best describes ${applicant}?`,
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
