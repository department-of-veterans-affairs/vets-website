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

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `Does ${
    bp.applicant
  } have other health insurance to add or update?`;
  return {
    ...bp,
    options: yesNoOptions,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${bp.applicant}’s primary health insurance`,
    description: prompt,
  };
}

export function ApplicantHasPrimaryPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantHasPrimaryReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantHasPrimaryPage.propTypes = pageProps;
ApplicantHasPrimaryReviewPage.propTypes = reviewPageProps;
