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

const SECONDARY_PROPERTY_NAMES = {
  ...PROPERTY_NAMES,
  keyname: 'applicantSecondaryHasPrescription',
};

function generateOptions({ data, pagePerItemIndex, isPrimary }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
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
    customTitle: `${bp.relativePossessive} ${
      isPrimary
        ? bp.currentListItem?.applicantPrimaryProvider
        : bp.currentListItem?.applicantSecondaryProvider
    } prescription coverage`,
    customHint:
      'You can find this information on the front of your health insurance card.',
    description: `Does ${
      bp.relativePossessive
    } health insurance cover prescriptions?`,
  };
}

export function ApplicantPrimaryPrescriptionPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: true }),
  });
}
export function ApplicantPrimaryPrescriptionReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: true }),
  });
}

export function ApplicantSecondaryPrescriptionPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...SECONDARY_PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: false }),
  });
}
export function ApplicantSecondaryPrescriptionReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...SECONDARY_PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: false }),
  });
}

ApplicantPrimaryPrescriptionPage.propTypes = pageProps;
ApplicantPrimaryPrescriptionReviewPage.propTypes = reviewPageProps;
ApplicantSecondaryPrescriptionPage.propTypes = pageProps;
ApplicantSecondaryPrescriptionReviewPage.propTypes = reviewPageProps;
