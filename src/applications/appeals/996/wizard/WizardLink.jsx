import React from 'react';

import { BASE_URL } from '../constants';

const WizardLink = (
  <>
    <h3 className="vads-u-font-size--h4">Online</h3>
    <p>
      To request a Higher-Level Review for compensation claims, you can use our
      online request tool. This online option is only available for disability
      compensation claims.
    </p>
    <a href={BASE_URL} className="vads-c-action-link--green">
      Let’s get started
      <span role="img" aria-hidden="true" className="button-icon">
        &nbsp;»
      </span>
    </a>
  </>
);

export default WizardLink;
