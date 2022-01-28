import React from 'react';

import { getAppUrl } from 'platform/utilities/registry-helpers';

const coeUrl = getAppUrl('coe');
const introUrl = `${coeUrl}/introduction`;

const MakeChanges = ({ clickHandler }) => (
  <>
    <h2>What if I need to make changes to my COE?</h2>
    <p>
      Complete and submit a Request for a Certificate of Eligibility (VA Form
      26-1880) if you need to:
    </p>
    <ul>
      <li>
        Make changes to your COE (correct an error or update your information),
        or
      </li>
      <li>Request a restoration of entitlement</li>
    </ul>
    <a href={introUrl} onClick={clickHandler}>
      Make changes to your COE online by filling out VA Form 26-1880
    </a>
  </>
);

export default MakeChanges;
