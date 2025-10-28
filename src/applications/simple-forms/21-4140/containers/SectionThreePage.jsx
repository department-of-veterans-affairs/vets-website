import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { scrollTo } from 'platform/utilities/scroll';
import { VaSummaryBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SectionThreePage = ({ goBack, goForward, NavButtons }) => {
  useEffect(() => {
    scrollTo('topScrollElement');
  }, []);

  return (
    <div className="schemaform-intro">
      <h1 className="vads-u-margin-bottom--2">Section III: Unemployment Certification</h1>
      <p className="vads-u-margin-bottom--3" style={{ fontSize: '20px' }}>
        Complete this section if you did NOT work during the past 12 months.
      </p>
      <VaSummaryBox id="employment-section-summary" uswds class="vads-u-margin-bottom--3">
        <h2 slot="headline">What to expect</h2>
        <ul className="usa-list vads-u-margin--0">
          <li>Review the information you provided</li>
          <li>Read the unemployment certifications</li>
          <ul>
            <li>Confirm you had no employment in the last 12 months</li>
            <li>Confirm your disability continues to prevent gainful employment</li>
          </ul>
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
