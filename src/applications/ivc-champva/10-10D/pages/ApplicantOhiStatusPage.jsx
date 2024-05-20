import { reviewPageProps, pageProps } from '../config/constants';

import ApplicantRelationshipPage, {
  ApplicantRelationshipReviewPage,
  appRelBoilerplate,
} from '../../shared/components/applicantLists/ApplicantRelationshipPage';

const PROPERTY_NAMES = {
  keyname: 'applicantHasOhi',
  primary: 'hasOhi',
  secondary: '_unused',
};

function generateOptions({ data, pagePerItemIndex }) {
  const bp = appRelBoilerplate({ data, pagePerItemIndex });
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
    customTitle: `${bp.relativePossessive}
     other health insurance status`,
    description: `Does ${
      bp.applicant
    } have other health insurance (other than Medicare)?`,
  };
}

export default function ApplicantOhiStatusPage(props) {
  return ApplicantRelationshipPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args }),
  });
}
export function ApplicantOhiStatusReviewPage(props) {
  return ApplicantRelationshipReviewPage({
    ...props,
    ...PROPERTY_NAMES,
    genOp: args => generateOptions({ ...args }),
  });
}

ApplicantOhiStatusReviewPage.propTypes = reviewPageProps;
ApplicantOhiStatusPage.propTypes = pageProps;
