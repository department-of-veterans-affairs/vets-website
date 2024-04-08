import { pageProps, reviewPageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantPrimaryHasPrescription',
  primary: 'hasPrescription',
  secondary: '_unused',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `Does ${
    bp.relativePossessive
  } health insurance cover prescriptions?`;
  const options = [
    {
      label: `Yes, ${
        bp.relativePossessive
      } health insurance covers prescriptions`,
      value: 'yes',
    },
    {
      label: `No, ${
        bp.relativePossessive
      } health insurance does not cover prescriptions`,
      value: 'no',
    },
  ];
  return {
    ...bp,
    options,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${bp.relativePossessive} ${
      bp.currentListItem?.applicantPrimaryProvider
    } prescription coverage`,
    customHint:
      'You can find this information on the front of your health insurance card.',
    description: prompt,
  };
}

export function ApplicantPrimaryPrescriptionPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantPrimaryPrescriptionReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantPrimaryPrescriptionPage.propTypes = pageProps;
ApplicantPrimaryPrescriptionReviewPage.propTypes = reviewPageProps;
