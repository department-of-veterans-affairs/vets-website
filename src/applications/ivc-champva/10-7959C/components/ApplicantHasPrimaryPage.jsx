import { pageProps, reviewPageProps, yesNoOptions } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantHasPrimary',
  primary: 'hasPrimary',
  secondary: '_unused',
};

const SECONDARY_PROPERTY_NAMES = {
  keyname: 'applicantHasSecondary',
  primary: 'hasSecondary',
  secondary: '_unused',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  return {
    ...bp,
    options: yesNoOptions,
    customTitle: `${bp.applicant}’s primary health insurance`,
    description: `Does ${
      bp.applicant
    } have other health insurance to add or update?`,
  };
}

function secondaryGenerateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  return {
    ...bp,
    options: yesNoOptions,
    customTitle: `${bp.applicant}’s secondary health insurance`,
    description: `Does ${
      bp.applicant
    } have secondary health insurance to add or update?`,
  };
}

export function ApplicantHasPrimaryPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  });
}

export function ApplicantHasPrimaryReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  });
}

export function ApplicantHasSecondaryPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...SECONDARY_PROPERTY_NAMES,
    genOp: secondaryGenerateOptions,
  });
}

export function ApplicantHasSecondaryReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...SECONDARY_PROPERTY_NAMES,
    genOp: secondaryGenerateOptions,
  });
}

ApplicantHasPrimaryPage.propTypes = pageProps;
ApplicantHasPrimaryReviewPage.propTypes = reviewPageProps;
ApplicantHasSecondaryPage.propTypes = pageProps;
ApplicantHasSecondaryReviewPage.propTypes = reviewPageProps;
