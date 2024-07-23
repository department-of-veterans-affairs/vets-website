import { pageProps, reviewPageProps } from '../config/constants';
import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantMedicarePartD',
  primary: 'enrollment',
  secondary: '_unused',
};

export function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });

  const options = [
    {
      label: `Yes`,
      value: 'enrolled',
    },
    {
      label: `No`,
      value: 'notEnrolled',
    },
  ];

  const prompt = `Is ${bp.applicant} enrolled in Medicare Part D?`;

  return {
    options,
    ...bp,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    ...PROPERTY_NAMES,
    customTitle: `${bp.applicant}’s Medicare Part D status`,
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
