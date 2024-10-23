import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { pageSetup } from '../../utilities/page-setup';
import { ROUTES } from '../../constants';

import ResultsSummary from './resultsComponents/ResultsSummary';
import CarefulConsiderationStatement from './resultsComponents/CarefulConsiderationStatement';
import Warnings from './resultsComponents/Warnings';
import OptionalStep from './resultsComponents/OptionalStep';
import StepOne from './resultsComponents/StepOne';
import AdditionalInstructions from './resultsComponents/AdditionalInstructions';
import StepTwo from './resultsComponents/StepTwo';
import StepThree from './resultsComponents/StepThree';
import AirForcePortalLink from './resultsComponents/AirForcePortalLink';

import { determineIsAirForceAFRBAPortal } from '../../helpers';

const ResultsPage = ({ formResponses, router, viewedIntroPage }) => {
  const H1 = 'Your Steps for Upgrading Your Discharge';
  const airForceAFRBAPortal = determineIsAirForceAFRBAPortal(formResponses);

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
    <article className="dw-guidance" data-testid="duw-results">
      <h1>{H1}</h1>
      <ResultsSummary formResponses={formResponses} />
      {airForceAFRBAPortal ? (
        <AirForcePortalLink />
      ) : (
        <>
          <CarefulConsiderationStatement
            formResponses={formResponses}
            router={router}
          />
          <Warnings formResponses={formResponses} />
          <OptionalStep formResponses={formResponses} />
          <section>
            <va-process-list>
              <StepOne formResponses={formResponses} />
              <StepTwo formResponses={formResponses} />
              <StepThree formResponses={formResponses} />
            </va-process-list>
          </section>
        </>
      )}
      <va-button
        back
        class="vads-u-margin-top--3"
        data-testid="duw-results-back"
        onClick={() => router.push(ROUTES.REVIEW)}
        uswds
      />
      <AdditionalInstructions formResponses={formResponses} />
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
