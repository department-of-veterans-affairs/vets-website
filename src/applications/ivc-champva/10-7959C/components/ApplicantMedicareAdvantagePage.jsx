import { pageProps, reviewPageProps, yesNoOptions } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantMedicareAdvantage',
  primary: 'hasAdvantage',
  secondary: '_unused',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `Did ${
    bp.useFirstPerson ? 'you' : `${bp.applicant}`
  } choose the advantage plan for coverage?`;

  return {
    ...bp,
    options: yesNoOptions,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${
      bp.useFirstPerson ? `Your` : `${bp.applicant}’s`
    } Medicare coverage`,
    customHint:
      'You can find this information on the front of your Medicare card.',
    description: prompt,
  };
}

export function ApplicantMedicareAdvantagePage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicareAdvantageReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicareAdvantagePage.propTypes = pageProps;
ApplicantMedicareAdvantageReviewPage.propTypes = reviewPageProps;
