import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantGender',
  primary: 'gender',
  secondary: '_unused',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const customTitle = `${bp.relativePossessive} sex listed at birth`;
  const options = [
    {
      label: 'Female',
      value: 'female',
    },
    {
      label: 'Male',
      value: 'male',
    },
  ];

  return {
    ...bp,
    options,
    customTitle,
    description: `What’s ${customTitle}?`,
    customHint: `Enter the sex that appears on ${bp.relativePossessive} birth certificate`,
  };
}

export function ApplicantGenderPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantGenderReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}
