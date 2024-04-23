import { pageProps, reviewPageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantPrimaryEOB',
  primary: 'providesEOB',
  secondary: '_unused',
};

const SECONDARY_PROPERTY_NAMES = {
  ...PROPERTY_NAMES,
  keyname: 'applicantSecondaryEOB',
};

function generateOptions({ data, pagePerItemIndex, isPrimary }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const options = [
    {
      label: `Yes, ${
        bp.relativePossessive
      } health insurance provides an explanation of benefits for prescriptions`,
      value: 'yes',
    },
    {
      label: `No, ${
        bp.relativePossessive
      } health insurance does not provide an explanation of benefits for prescriptions`,
      value: 'no',
    },
    {
      label: 'I don’t know',
      value: 'unknown',
    },
  ];
  return {
    ...bp,
    options,
    customTitle: `${bp.relativePossessive} ${
      isPrimary
        ? bp.currentListItem?.applicantPrimaryProvider
        : bp.currentListItem?.applicantSecondaryProvider
    } explanation of benefits`,
    customHint: ' ',
    description: `Does ${
      bp.relativePossessive
    } health insurance provide an explanation of benefits (EOB) for prescriptions?`,
  };
}

export function ApplicantPrimaryEOBPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: true }),
  });
}
export function ApplicantPrimaryEOBReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: true }),
  });
}

export function ApplicantSecondaryEOBPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...SECONDARY_PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: false }),
  });
}
export function ApplicantSecondaryEOBReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...SECONDARY_PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: false }),
  });
}

ApplicantPrimaryEOBPage.propTypes = pageProps;
ApplicantPrimaryEOBReviewPage.propTypes = reviewPageProps;
ApplicantSecondaryEOBPage.propTypes = pageProps;
ApplicantSecondaryEOBReviewPage.propTypes = reviewPageProps;
