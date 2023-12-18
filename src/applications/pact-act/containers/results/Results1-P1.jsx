import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { ROUTES } from '../../constants';
import { pageSetup } from '../../utilities/page-setup';
import { onResultsBackClick } from '../../utilities/shared';
import { getDynamicContent } from '../../utilities/results-1-1-dynamic-content';

const Results1Page1 = ({ formResponses, router, viewedIntroPage }) => {
  const H1 = 'You may be eligible for VA benefits';

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
      <h1 data-testid="paw-results-1-p1">{H1}</h1>
      <p>
        You may be eligible for benefits, including a monthly disability
        compensation payment and VA health care.
      </p>
      <p>
        Based on where you told us you served, we think you may have had
        exposure to a toxic substance. We call this a “presumption of exposure.”
      </p>
      <h2>Presumptive exposure locations we think may apply to you</h2>
      <ul>{getDynamicContent(formResponses)}</ul>
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
        data-testid="paw-results-1-p1-continue"
        to={ROUTES.RESULTS_1_P2}
      >
        Learn more about presumptive conditions and what to do next
      </Link>
      <va-button
        back
        class="vads-u-margin-top--3 vads-u-display--block"
        data-testid="paw-results-back"
        onClick={() => onResultsBackClick(formResponses, router)}
      />
    </>
  );
};

Results1Page1.propTypes = {
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

export default connect(mapStateToProps)(Results1Page1);
