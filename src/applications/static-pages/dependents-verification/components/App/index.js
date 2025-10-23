import React from 'react';
import PropTypes from 'prop-types';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

export const App = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  const isLoadingFeatures = useToggleLoadingValue();
  const formEnabled = useToggleValue(TOGGLE_NAMES.vaDependentsVerification);

  if (isLoadingFeatures) {
    return <va-loading-indicator label="Loading" message="Loading..." />;
  }
  return (
    <div className="dependents-verification-widget">
      {formEnabled ? (
        // form enabled state - Show both online and mail options
        <div>
          <p>You can submit this form in 1 of these 2 ways:</p>

          <div className="verification-option">
            <p>
              <strong>Option 1: Verify online</strong>
            </p>
            <p>You can verify your dependents online right now.</p>
            <va-link-action
              href={getAppUrl('0538-dependents-verification')}
              text="Verify your dependents on your disability benefits"
              type="secondary"
            />
          </div>

          <div className="verification-option">
            <p>
              <strong>Option 2: Mail us the verification form</strong>
            </p>
            <p>
              Fill out the Mandatory Verification of Dependents (VA Form
              21-0538).
            </p>
            <va-link
              href="/find-forms/about-form-21-0538/"
              text="Get VA Form 21-0538 to download"
            />
            <p>Then, mail your completed form to us at this address:</p>
            <p className="va-address-block">
              Department of Veterans Affairs <br />
              Evidence Intake Center
              <br />
              PO Box 4444
              <br />
              Janesville, WI 53547-4444
            </p>
          </div>
        </div>
      ) : (
        // Not logged in state - Show only mail option
        <div>
          <p>You can submit this form by mail.</p>

          <p>
            Fill out the Mandatory Verification of Dependents (VA Form 21-0538).
          </p>

          <va-link
            href="/find-forms/about-form-21-0538/"
            text="Get VA Form 21-0538 to download"
          />

          <p>Then, mail your completed form to us at this address:</p>

          <p className="va-address-block">
            Department of Veterans Affairs <br />
            Evidence Intake Center
            <br />
            PO Box 4444
            <br />
            Janesville, WI 53547-4444
          </p>
        </div>
      )}
    </div>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

export default App;
