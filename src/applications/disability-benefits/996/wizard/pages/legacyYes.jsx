import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import pageNames from './pageNames';
import { SUPPLEMENTAL_CLAIM_URL } from '../../constants';
import DownloadLink from '../../content/DownloadLink';

const headline =
  'You’ll need to submit a paper form to request a Higher-Level Review';

const alertContent = (
  <>
    <p>
      If you have a decision date before Februrary 19, 2019 and received a
      Statement of the Case (SOC) or Supplemental Statement of the Case (SSOC)
      because you had filed an appeal under the old (or former) appeals system,
      you’ll have to opt-in to the new decision review process via a submitted
      paper form.
    </p>
    <p>
      To opt in, please fill out a Decision Review Request: Higher-Level Review
      (VA Form 20-0996) and check “opt-in from SOC/SSOC” in box 15 of the paper
      form.
    </p>
    <DownloadLink content={'Download VA Form 20-0996'} />
    <p>
      If you had not filed a legacy appeal within a year of the decision dated
      before Februrary 19, 2019, you will need to{' '}
      <a href={SUPPLEMENTAL_CLAIM_URL}>file a Supplemental Claim</a>.
    </p>
  </>
);

// Yes, has a legacy appeal
const LegacyYes = () => (
  <AlertBox
    headline={headline}
    content={alertContent}
    status="info"
    isVisible
  />
);

export default {
  name: pageNames.legacyYes,
  component: LegacyYes,
};
