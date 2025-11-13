import ApplicantRelationshipPage, {
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const KEYNAME = 'applicantRelationshipOrigin';

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const customTitle = `${bp.applicant}’s dependent status`;
  const relativeBeingVerb = `${bp.relative} ${bp.beingVerbPresent}`;
  const surv = data.sponsorIsDeceased ? 'surviving' : '';

  // Create dynamic radio labels based on above phrasing
  const options = [
    {
      label: `${relativeBeingVerb} the ${
        bp.personTitle
      }’s ${surv} biological child`,
      value: 'blood',
    },
    {
      label: `${relativeBeingVerb} the ${bp.personTitle}’s ${surv} step child`,
      value: 'step',
    },
    {
      label: `${relativeBeingVerb} the ${
        bp.personTitle
      }’s ${surv} adopted child`,
      value: 'adoption',
    },
  ];

  return {
    options,
    ...bp,
    relativeBeingVerb,
    keyname: KEYNAME,
    customTitle,
    customHint:
      'Depending on your response, you may need to submit additional documents.',
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
