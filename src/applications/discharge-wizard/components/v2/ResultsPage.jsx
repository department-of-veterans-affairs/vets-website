import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';

import ResultsSummary from './resultsComponents/ResultsSummary';
import CarefulConsiderationStatement from './resultsComponents/CarefulConsiderationStatement';
import Warnings from './resultsComponents/Warnings';
import OptionalStep from './resultsComponents/OptionalStep';

const ResultsPage = ({ formResponses, router, viewedIntroPage }) => {
  const H1 = 'Your Steps for Upgrading Your Discharge';

  useEffect(
    () => {
      pageSetup(H1);
    },
    [H1],
  );

  useEffect(
    () => {
      if (!viewedIntroPage) {
        router.push(ROUTES.HOME);
      }
    },
    [router, viewedIntroPage],
  );

  return (
    <article className="dw-guidance" data-testId="duw-results">
      <h1>{H1}</h1>
      <div className="medium-8">
        <ResultsSummary formResponses={formResponses} />
        <CarefulConsiderationStatement formResponses={formResponses} />
        <Warnings formResponses={formResponses} />
        <OptionalStep formResponses={formResponses} />
      </div>
    </article>
  );
};

ResultsPage.propTypes = {
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  viewedIntroPage: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  formResponses: state?.dischargeUpgradeWizard?.duwForm?.form,
  viewedIntroPage: state?.dischargeUpgradeWizard?.duwForm?.viewedIntroPage,
});

export default connect(mapStateToProps)(ResultsPage);
