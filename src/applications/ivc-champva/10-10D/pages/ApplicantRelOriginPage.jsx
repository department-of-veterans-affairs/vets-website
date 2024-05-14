import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const KEYNAME = 'applicantRelationshipOrigin';

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

  const customTitle = `${applicant}’s relationship to the ${personTitle}`;

  const relativeBeingVerb = `${relative} ${beingVerbPresent}`;
  const surv = data.sponsorIsDeceased ? 'surviving' : '';

  // Create dynamic radio labels based on above phrasing
  const options = [
    {
      label: `${relativeBeingVerb} the ${personTitle}’s ${surv} biological child`,
      value: 'blood',
    },
    {
      label: `${relativeBeingVerb} the ${personTitle}’s ${surv} step child`,
      value: 'step',
    },
    {
      label: `${relativeBeingVerb} the ${personTitle}’s ${surv} adopted child`,
      value: 'adoption',
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
    currentListItem,
    customTitle,
    description: `What’s ${customTitle}?`,
  };
}

export function ApplicantRelOriginPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantRelOriginReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}
