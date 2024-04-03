import { pageProps, reviewPageProps, yesNoOptions } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantMedicareStatusD',
  primary: 'enrollment',
  secondary: '_unused',
};

export function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `${
    bp.useFirstPerson ? 'Are you' : `Is ${bp.applicant}`
  } enrolled in Medicare Part D?`;

  return {
    ...bp,
    options: yesNoOptions,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${
      bp.useFirstPerson ? `Your` : `${bp.applicant}’s`
    } Medicare status`,
    description: prompt,
  };
}

// Using the widely customizable ApplicantRelationshipPage
// as it now functions like a generic radioUI + other text field:
export function ApplicantMedicareStatusDPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicareStatusDReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicareStatusDReviewPage.propTypes = reviewPageProps;
ApplicantMedicareStatusDPage.propTypes = pageProps;
