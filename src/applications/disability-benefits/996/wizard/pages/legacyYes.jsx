import React from 'react';
import pageNames from './pageNames';
import { SUPPLEMENTAL_CLAIM_URL } from '../../constants';
import DownloadLink from '../../content/DownloadLink';

// Yes, has a legacy appeal
const LegacyYes = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
    Since your claim has a decision date before Februrary 19, 2019, you’ll need
    to opt in to the new decision review process. To opt in, fill out and submit
    VA Form 20-0996 by mail, fax, or in person. On the form you’ll need to check
    Box 15 to "opt in from{' '}
    <dfn>
      <abbr title="Statement of the Case">SOC</abbr>/
      <abbr title="Supplemental Statement of the Case">SSOC</abbr>
    </dfn>
    ".
    <p>
      <DownloadLink content={'Download VA Form 20-0996'} />
    </p>
    <p className="vads-u-margin-bottom--0">
      If you haven’t filed a legacy appeal for this claim, you’ll need to{' '}
      <a href={SUPPLEMENTAL_CLAIM_URL}>file a Supplemental Claim</a>.
    </p>
  </div>
);

export default {
  name: pageNames.legacyYes,
  component: LegacyYes,
};
