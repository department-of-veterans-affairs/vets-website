import { reviewPageProps, pageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantMedicareStatus',
  primary: 'eligibility',
  secondary: '_unused',
};

export function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });

  const options = [
    {
      label: `Yes, ${bp.applicant} is enrolled in Medicare`,
      value: 'enrolled',
    },
    {
      label: `No, ${bp.applicant} is not eligible for Medicare`,
      value: 'ineligible',
    },
    {
      label: `No, ${
        bp.applicant
      } is eligible for Medicare but has not been signed up for it yet`,
      value: 'eligibleNotSignedUp',
    },
  ];

  const prompt = `Is ${bp.applicant} enrolled in Medicare Parts A & B?`;

  return {
    options,
    ...bp,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    ...PROPERTY_NAMES,
    customTitle: `${bp.applicant}’s Medicare Part A and B status`,
    description: prompt,
  };
}

// Using the widely customizable ApplicantRelationshipPage
// as it now functions like a generic radioUI + other text field:
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
