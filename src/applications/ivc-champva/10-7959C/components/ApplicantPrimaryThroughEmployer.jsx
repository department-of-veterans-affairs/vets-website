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

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `Is this insurance through ${bp.relativePossessive} employer?`;
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
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${bp.relativePossessive} ${
      bp.currentListItem?.applicantPrimaryProvider
    } type of insurance`,
    description: prompt,
  };
}

export function ApplicantPrimaryThroughEmployerPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantPrimaryThroughEmployerReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantPrimaryThroughEmployerPage.propTypes = pageProps;
ApplicantPrimaryThroughEmployerReviewPage.propTypes = reviewPageProps;
