import { pageProps, reviewPageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const KEYNAME = 'applicantMedicareStatusD';
const PRIMARY = 'enrollment';
const SECONDARY = '_unused';

export function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `${
    bp.useFirstPerson ? 'Are you' : `Is ${bp.applicant}`
  } enrolled in Medicare Part D?`;
  const options = [
    {
      label: 'Yes',
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
    } Medicare status`,
    description: prompt,
  };
}

// Using the widely customizable ApplicantRelationshipPage
// as it now functions like a generic radioUI + other text field:
export function ApplicantMedicareStatusDPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantMedicareStatusDReviewPage(props) {
  const newProps = {
    ...props,
    keyname: KEYNAME,
    primary: PRIMARY,
    secondary: SECONDARY,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantMedicareStatusDReviewPage.propTypes = reviewPageProps;
ApplicantMedicareStatusDPage.propTypes = pageProps;
