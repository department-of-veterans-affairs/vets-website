import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from './ApplicantRelationshipPage';

const KEYNAME = 'applicantSponsorMarriageDetails';

/* 
Being generous with the applicantRelationshipPage component and
using it to create this radio interface w custom wording.

This page is displayed when the sponsor is deceased and the
applicant indicated they were married to the sponsor at some point.
*/
function generateOptions({ data, pagePerItemIndex }) {
  const {
    currentListItem,
    personTitle,
    applicant,
    useFirstPerson,
    relative,
    relativePossessive,
  } = appRelBoilerplate({ data, pagePerItemIndex });

  const customTitle = `${
    useFirstPerson ? `Your` : `${applicant}’s`
  } marriage to the ${personTitle}`;

  const options = [
    {
      label: `${relative} was married to the ${personTitle} at the time of their death and did not remarry`,
      value: 'marriedTillDeathNoRemarriage',
    },
    {
      label: `${relative} was married to the ${personTitle} at the time of ${personTitle}’s death and remarried someone else on or after ${
        useFirstPerson ? 'my' : relativePossessive
      } 55th birthday`,
      value: 'marriedTillDeathRemarriedAfter55',
    },
    {
      label: `${relative} was legally separated from ${personTitle} before ${personTitle} died`,
      value: 'marriageDissolved',
    },
    {
      label: `${
        applicant && !useFirstPerson ? `${applicant}` : 'My'
      } relationship is not listed here`,
      value: 'other',
    },
  ];

  return {
    options,
    useFirstPerson,
    relativePossessive,
    applicant,
    personTitle,
    keyname: KEYNAME,
    currentListItem,
    customTitle,
    description: customTitle,
  };
}

export function ApplicantSponsorMarriageDetailsPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantSponsorMarriageDetailsReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}
