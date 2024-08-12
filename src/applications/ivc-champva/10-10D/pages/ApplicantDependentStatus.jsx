import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantDependentStatus',
  primary: 'status',
  secondary: '_unused',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const customTitle = `${bp.applicant}’s status`;
  const relativeBeingVerb = `${bp.relative} ${bp.beingVerbPresent}`;
  const options = [
    {
      label: `${relativeBeingVerb} between the ages of 18 and 23 years old and ${
        bp.beingVerbPresent
      } enrolled as a student in a high school, college, or vocational school`,
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
    relativeBeingVerb,
    ...bp,
    ...PROPERTY_NAMES,
    customTitle,
    description: `Which of these best describes ${bp.applicant}?`,
  };
}

export function ApplicantDependentStatusPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantDependentStatusReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}
