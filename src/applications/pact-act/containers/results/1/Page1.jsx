// this file will be deleted when research is complete
// and replaced with TempResults1Page1
import React, { useEffect } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ROUTES } from '../../../constants';
import { customizeTitle } from '../../../utilities/customize-title';

const ResultsSet1Page1 = () => {
  const H1 = 'You may be eligible for VA benefits';

  useEffect(() => {
    document.title = customizeTitle(H1);
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    waitForRenderThenFocus('h1');
  });

  return (
    <>
      <h1>{H1}</h1>
      <p>
        You may be eligible for benefits, including a monthly disability
        compensation payment and VA health care.
      </p>
      <p>
        Based on where you told us you served, we think you may have had
        exposure to a toxic substance. We call this a “presumption of exposure.”
      </p>
      <h2>Presumptive exposure locations we think may apply to you</h2>
      <p>
        Burn pit or other toxic exposures from service in any of these
        locations, on or after <strong>August 2, 1990</strong>:
      </p>
      <ul>
        <li>Arabian Sea</li>
        <li>Gulf of Aden</li>
        <li>Gulf of Oman</li>
        <li>The neutral zone on the border between Iraq and Saudi Arabia</li>
        <li>Persian Gulf</li>
        <li>Red Sea</li>
      </ul>
      <p>
        We’ve added new presumptive conditions for these locations under the
        PACT Act.
      </p>
      <h2>What this means for you</h2>
      <p>
        We automatically assume (or “presume”) that these exposures cause
        certain health conditions. We call these “presumptive conditions.”
      </p>
      <p>
        If you have a presumptive condition, you don’t need to prove that your
        service caused the condition to get VA disability compensation. You only
        need to meet the service requirements for presumption.
      </p>
      <Link
        className="vads-c-action-link--green"
        to={ROUTES.RESULTS_SET_1_PAGE_2}
      >
        Learn more about presumptive conditions and what to do next
      </Link>
    </>
  );
};

ResultsSet1Page1.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default ResultsSet1Page1;
