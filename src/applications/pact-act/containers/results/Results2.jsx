import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../../constants';
import { pageSetup } from '../../utilities/page-setup';
import { onResultsBackClick } from '../../utilities/shared';
import { QUESTION_MAP } from '../../constants/question-data-map';

const Results2 = ({ formResponses, router, viewedIntroPage }) => {
  const H1 = QUESTION_MAP.RESULTS_2;

  useEffect(() => {
    pageSetup(H1);
  });

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  return (
    <>
      <h1 data-testid="paw-results-2">{H1}</h1>
      <p>
        Based on where you told us you served, we think you may have had
        exposure to a toxic substance. We call this a “presumption of exposure.”
      </p>
      <p>Here’s the presumptive exposure location we think may apply to you:</p>
      <ul>
        <li>
          Exposure to contaminated water from service for at least 30 days at
          either of these North Carolina bases between{' '}
          <strong>August 1, 1953</strong>, and{' '}
          <strong>December 31, 1987</strong>:
          <ul>
            <li>
              Marine Corps Base Camp Lejeune, <strong>or</strong>
            </li>
            <li>Marine Corps Air Station (MCAS) New River</li>
          </ul>
        </li>
      </ul>
      <p>
        These aren’t new changes based on the PACT Act. But we encourage you to
        file a claim if you haven’t done so already. We also encourage you to
        learn more about VA benefits and health care for Veterans and family
        members who had exposure to contaminated water. And learn more about how
        the PACT Act affects Camp Lejeune claims and related benefits.
      </p>
      <a
        className="vads-u-margin-top--3 vads-u-display--block"
        href="/disability/eligibility/hazardous-materials-exposure/camp-lejeune-water-contamination/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn about Camp Lejeune and VA benefits (opens in a new tab)
      </a>
      <va-button
        back
        class="vads-u-margin-top--3"
        data-testid="paw-results-back"
        onClick={() => onResultsBackClick(formResponses, router)}
        uswds={false}
      />
    </>
  );
};

Results2.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool,
};

const mapStateToProps = state => ({
  formResponses: state?.pactAct?.form,
  viewedIntroPage: state?.pactAct?.viewedIntroPage,
});

export default connect(mapStateToProps)(Results2);
