import { pageProps, reviewPageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantMedicareStatusContinued',
  primary: 'medicareContext',
  secondary: 'otherMedicareContext',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const haveOrHas = bp.relative === 'I' ? 'have' : 'has';
  const prompt = `Which of these best describes ${
    bp.useFirstPerson ? 'you' : `${bp.applicant}`
  }?`;
  const options = [
    {
      label: `${bp.relative} ${bp.beingVerbPresent} not eligible for Medicare`,
      value: 'ineligible',
    },
    {
      label: `${
        bp.relative
      } ${haveOrHas} Medicare but no updates to add at this time`,
      value: 'enrolledNoUpdates',
    },
    {
      label: `No, ${bp.relative} ${
        bp.beingVerbPresent
      } eligible for Medicare but ${haveOrHas} not signed up for it yet`,
      value: 'eligibleNotEnrolled',
    },
  ];

  return {
    ...bp,
    options,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${
      bp.useFirstPerson ? `Your` : `${bp.applicant}'s`
    } Medicare status`,
    description: prompt,
  };
}

// Using the widely customizable ApplicantRelationshipPage
// as it now functions like a generic radioUI + other text field:
export function ApplicantMedicareStatusContinuedPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicareStatusContinuedReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicareStatusContinuedReviewPage.propTypes = reviewPageProps;
ApplicantMedicareStatusContinuedPage.propTypes = pageProps;
