import { pageProps, reviewPageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const KEYNAME = 'applicantMedicarePharmacyBenefits';
const PRIMARY = 'hasBenefits';
const SECONDARY = '_unused';

export function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `Do ${
    bp.useFirstPerson ? 'your' : `${bp.applicant}’s`
  } Medicare Parts A & B provide pharmacy benefits?`;
  const options = [
    {
      label: `Yes`,
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ];

  return {
    ...bp,
    options,
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    customTitle: `${
      bp.useFirstPerson ? `Your` : `${bp.applicant}’s`
    } Medicare pharmacy benefits`,
    customHint:
      'You can find this infromation on the front of your Medicare card.',
    description: prompt,
  };
}

export function ApplicantMedicarePharmacyPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicarePharmacyReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicarePharmacyPage.propTypes = pageProps;
ApplicantMedicarePharmacyReviewPage.propTypes = reviewPageProps;
