// Dependencies
import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import localStorage from 'platform/utilities/storage/localStorage';

// Relative imports
import scrollTo from 'platform/utilities/ui/scrollTo';
import AdditionalInstructions from '../components/gpMinorComponents/AdditionalInstructions';
import AirForcePortalLink from '../components/AirForcePortalLink';
import CarefulConsiderationStatement from '../components/CarefulConsiderationStatement';
import OptionalStep from '../components/gpMinorComponents/OptionalStep';
import ResultsSummary from '../components/gpMinorComponents/ResultsSummary';
import StepOne from '../components/gpSteps/StepOne';
import StepTwo from '../components/gpSteps/StepTwo';
import StepThree from '../components/gpSteps/StepThree';
import Warnings from '../components/gpMinorComponents/Warnings';
import { deriveIsAirForceAFRBAPortal } from '../helpers';
import { applyAirForcePortalLink } from '../helpers/selectors';

export const GuidancePage = ({ formValues, showNewAirForcePortal, router }) => {
  const airForceAFRBAPortal = deriveIsAirForceAFRBAPortal(formValues);

  useEffect(() => {
    // Redirect to the discharge wizard homepage if there isn't any form values in state.
    if (formValues?.questions?.length <= 1) {
      router.replace('');
    }
  }, []);

  useEffect(
    () => {
      // This effect hook only runs on mount OR if formValues dependency changes (Which is a new render/ or props to the component)
      localStorage.setItem('dw-viewed-guidance', true);
      localStorage.setItem('dw-formValues', JSON.stringify(formValues));
      scrollTo(0);
    },
    [formValues],
  );

  if (formValues?.questions?.length > 1) {
    return (
      <article className="dw-guidance">
        <h1>Your Steps for Upgrading Your Discharge</h1>
        <div className="medium-8">
          <ResultsSummary formValues={formValues} />
          {showNewAirForcePortal && airForceAFRBAPortal ? (
            <AirForcePortalLink />
          ) : (
            <>
              <CarefulConsiderationStatement formValues={formValues} />
              <Warnings formValues={formValues} />
              <OptionalStep formValues={formValues} />
              <section>
                <va-process-list uswds>
                  <StepOne formValues={formValues} />
                  <StepTwo formValues={formValues} />
                  <StepThree formValues={formValues} />
                </va-process-list>
              </section>
            </>
          )}
          <AdditionalInstructions formValues={formValues} />
        </div>
      </article>
    );
  }

  return null;
};

const mapStateToProps = state => ({
  formValues: state.dischargeWizard.form,
  showNewAirForcePortal: applyAirForcePortalLink(state),
});
const mapDispatchToProps = {};

GuidancePage.propTypes = {
  formValues: PropTypes.object.isRequired,
  showNewAirForcePortal: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GuidancePage);
