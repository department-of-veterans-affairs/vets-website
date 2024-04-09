import { pageProps, reviewPageProps, yesNoOptions } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantMedicareStatus',
  primary: 'enrollment',
  secondary: 'otherEnrollment',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `${
    bp.useFirstPerson ? 'Do you' : `Does ${bp.applicant}`
  } have Medicare Parts A & B to add or update?`;

  return {
    ...bp,
    options: yesNoOptions,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${
      bp.useFirstPerson ? `Your` : `${bp.applicant}'s`
    } Medicare status`,
    description: prompt,
  };
}

export function ApplicantMedicareStatusPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicareStatusReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicareStatusReviewPage.propTypes = reviewPageProps;
ApplicantMedicareStatusPage.propTypes = pageProps;
