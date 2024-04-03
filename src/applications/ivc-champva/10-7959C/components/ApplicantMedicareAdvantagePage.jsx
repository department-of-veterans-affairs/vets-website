import { pageProps, reviewPageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const KEYNAME = 'applicantMedicareAdvantage';
const PRIMARY = 'hasAdvantage';
const SECONDARY = '_unused';

export function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `Did ${
    bp.useFirstPerson ? 'you' : `${bp.applicant}`
  } choose the advantage plan for coverage?`;
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
    } Medicare coverage`,
    customHint:
      'You can find this information on the front of your Medicare card.',
    description: prompt,
  };
}

export function ApplicantMedicareAdvantagePage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicareAdvantageReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicareAdvantagePage.propTypes = pageProps;
ApplicantMedicareAdvantageReviewPage.propTypes = reviewPageProps;
