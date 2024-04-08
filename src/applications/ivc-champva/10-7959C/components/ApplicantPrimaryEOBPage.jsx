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

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
  const prompt = `Does ${
    bp.relativePossessive
  } health insurance provide an explanation of benefits (EOB) for prescriptions?`;
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
    relativeBeingVerb: `${bp.relative} ${bp.beingVerbPresent}`,
    customTitle: `${bp.relativePossessive} ${
      bp.currentListItem?.applicantPrimaryProvider
    } explanation of benefits`,
    customHint: ' ',
    description: prompt,
  };
}

export function ApplicantPrimaryEOBPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipPage(newProps);
}
export function ApplicantPrimaryEOBReviewPage(props) {
  const newProps = {
    ...props,
    ...PROPERTY_NAMES,
    genOp: generateOptions,
  };
  return ApplicantRelationshipReviewPage(newProps);
}

ApplicantPrimaryEOBPage.propTypes = pageProps;
ApplicantPrimaryEOBReviewPage.propTypes = reviewPageProps;
