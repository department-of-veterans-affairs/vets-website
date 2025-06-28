import React from 'react';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import manifest from '../../686c-674/manifest.json';

export const ExitPageComponent = props => {
  return (
    <div className="vads-u-padding--3">
      <h2 className="vads-u-font-size--h2">
        Update your dependents in a different form
      </h2>
      <p className="vads-u-margin-y--0">VA Forms 21-686c and 21-674</p>

      <p className="vads-u-margin-top--2">
        <strong>You’ve told us that you need to update your dependents.</strong>{' '}
        We’ll now take you to another tool where you can add or remove
        dependents from your VA benefits (VA Forms 21-686c and 21-674).
      </p>

      <p>
        <strong>
          Updating your VA dependents is a required step before you can complete
          the verification process. Updating and verifying are two separate
          tasks.
        </strong>{' '}
        You’ll need to submit the add or remove a dependent application first,
        wait for the changes to take effect, and then come back to verify your
        dependents.
      </p>

      <p>
        We require you to verify your dependents every 8 years. If you don’t,
        we’ll remove them from your benefits.
      </p>

      <p>
        Note:{' '}
        <strong>
          <span className="vads-u-display--inline">
            The changes you make to your dependents won’t appear right away.
          </span>
        </strong>{' '}
        Once they do, you can complete the verification process.
      </p>

      {/* / Copied from FormNavButtons to adjust buttonText */}
      <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
        <div className="small-6 medium-5 columns">
          <ProgressButton
            onButtonClick={props.router.goBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        </div>
        <div className="small-6 medium-5 end columns">
          <ProgressButton
            onButtonClick={() => {
              window.location.href = manifest.rootUrl;
            }}
            buttonText="Continue to add or remove dependents"
            buttonClass="usa-button-primary"
            afterText="»"
          />
        </div>
      </div>
    </div>
  );
};
