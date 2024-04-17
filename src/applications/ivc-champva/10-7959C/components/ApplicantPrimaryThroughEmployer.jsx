import { pageProps, reviewPageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantPrimaryThroughEmployer',
  primary: 'throughEmployer',
  secondary: '_unused',
};

const SECONDARY_PROPERTY_NAMES = {
  ...PROPERTY_NAMES,
  keyname: 'applicantSecondaryThroughEmployer',
};

function generateOptions({ data, pagePerItemIndex, isPrimary }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const options = [
    {
      label: `Yes, ${
        bp.relativePossessive
      } health insurance is through their employer`,
      value: 'yes',
    },
    {
      label: `No, ${
        bp.relativePossessive
      } health insurance is not through their employer`,
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
    } type of insurance`,
    description: `Is this insurance through ${bp.relativePossessive} employer?`,
  };
}

export function ApplicantPrimaryThroughEmployerPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: true }),
  });
}
export function ApplicantPrimaryThroughEmployerReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: true }),
  });
}

export function ApplicantSecondaryThroughEmployerPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...SECONDARY_PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: false }),
  });
}
export function ApplicantSecondaryThroughEmployerReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...SECONDARY_PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args, isPrimary: false }),
  });
}

ApplicantPrimaryThroughEmployerPage.propTypes = pageProps;
ApplicantPrimaryThroughEmployerReviewPage.propTypes = reviewPageProps;
ApplicantSecondaryThroughEmployerPage.propTypes = pageProps;
ApplicantSecondaryThroughEmployerReviewPage.propTypes = reviewPageProps;
