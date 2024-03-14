import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from './ApplicantRelationshipPage';

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

  const customTitle = `${
    useFirstPerson ? `Your` : `${applicant}’s`
  } relationship to the ${personTitle} (continued)`;

  const relativeBeingVerb = `${relative} ${beingVerbPresent}`;

  // Create dynamic radio labels based on above phrasing
  const options = [
    {
      label: `${relativeBeingVerb} a biological child of the ${personTitle}`,
      value: 'blood',
    },
    {
      label: `${relativeBeingVerb} a stepchild of the ${personTitle}`,
      value: 'step',
    },
    {
      label: `${relativeBeingVerb} an adopted child of the ${personTitle}`,
      value: 'adoption',
    },
    {
      label: `${
        applicant && !useFirstPerson ? `${applicant} doesn’t` : 'We don’t'
      } have a relationship that’s listed here`,
      value: 'other',
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
    description: customTitle,
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
export function ApplicationRelOriginReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}
