import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollTo } from 'platform/utilities/scroll';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { waitForRenderThenFocus } from 'platform/utilities/ui';

const SectionOnePage = ({ goBack, goForward, NavButtons }) => {
  useEffect(() => {
    scrollTo('topScrollElement');
    waitForRenderThenFocus('#main-content');
  }, []);

  return (
    <div className="schemaform-intro">
      <h3 className="vads-u-margin-bottom--2" id="main-content">
        Section I: Veteran ID
      </h3>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '16px' }}>
        We’ll start by confirming your identity and how to reach you.
      </p>
      <VaSummaryBox
        id="required-information-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h4 slot="headline">What to expect</h4>
        <ul className="usa-list vads-u-margin--0">
          <li>Your name and identification numbers</li>
          <li>Your contact information (address, email, phone)</li>
          <li>Takes about 1-2 minutes</li>
        </ul>
      </VaSummaryBox>
      <NavButtons goBack={goBack} goForward={goForward} submitToContinue />
    </div>
  );
};

SectionOnePage.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  NavButtons: PropTypes.elementType,
};

export default SectionOnePage;
