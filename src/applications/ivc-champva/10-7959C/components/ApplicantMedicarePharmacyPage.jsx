import { pageProps, reviewPageProps, yesNoOptions } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantMedicarePharmacyBenefits',
  primary: 'hasBenefits',
  secondary: '_unused',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `Do ${
    bp.useFirstPerson ? 'your' : `${bp.applicant}’s`
  } Medicare Parts A & B provide pharmacy benefits?`;

  return {
    ...bp,
    options: yesNoOptions,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${
      bp.useFirstPerson ? `Your` : `${bp.applicant}’s`
    } Medicare pharmacy benefits`,
    customHint:
      'You can find this information on the front of your Medicare card.',
    description: prompt,
  };
}

export function ApplicantMedicarePharmacyPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicarePharmacyReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicarePharmacyPage.propTypes = pageProps;
ApplicantMedicarePharmacyReviewPage.propTypes = reviewPageProps;
