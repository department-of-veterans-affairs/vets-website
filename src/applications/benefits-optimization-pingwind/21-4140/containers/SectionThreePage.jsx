import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollTo } from 'platform/utilities/scroll';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { waitForRenderThenFocus } from 'platform/utilities/ui';

const SectionThreePage = ({ goBack, goForward, NavButtons }) => {
  useEffect(() => {
    scrollTo('topScrollElement');
    waitForRenderThenFocus('#main-content');
  }, []);

  return (
    <div className="schemaform-intro">
      <h3 className="vads-u-margin-bottom--2" id="main-content">
        Section III: Unemployment Certification
      </h3>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '16px' }}>
        Complete this section if you did NOT work during the past 12 months.
      </p>
      <VaSummaryBox
        id="employment-section-summary"
        uswds
        class="vads-u-margin-bottom--3"
      >
        <h4 slot="headline">What to expect</h4>
        <ul className="usa-list vads-u-margin--0">
          <li>Review the information you provided</li>
          <li>
            Read the unemployment certifications
            <ul>
              <li>Confirm you had no employment in the last 12 months</li>
              <li>
                Confirm your disability continues to prevent gainful employment
              </li>
            </ul>
          </li>
          <li>Sign and date your questionnaire</li>
          <li>Takes about 1-2 minutes</li>
        </ul>
      </VaSummaryBox>
      <NavButtons goBack={goBack} goForward={goForward} submitToContinue />
    </div>
  );
};

SectionThreePage.propTypes = {
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  NavButtons: PropTypes.elementType,
};

export default SectionThreePage;
