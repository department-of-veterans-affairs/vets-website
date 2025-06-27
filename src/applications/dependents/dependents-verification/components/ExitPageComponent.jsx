import React from 'react';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

export const ExitPageComponent = props => {
  return (
    <div className="">
      <h2 className="vads-u-font-size--h2">
        Continue to update dependents on your VA benefits
      </h2>
      <p className="vads-u-margin-y--0">VA Forms 21-686c and 21-674</p>

      <p className="vads-u-margin-top--2">
        <strong>
          You’ve selected to update one or more dependents. You’ll exit this
          form
        </strong>
        , and we’ll take you to another tool to add or remove dependents on your
        VA benefits (VA Forms 21-686c and 21-674).
      </p>

      <p>
        The VA requires you to verify your dependents every 8 years or we’ll
        remove them from your benefits.
      </p>

      <p>
        <strong>Updates will not appear right away.</strong>
        <br />
        After making changes, allow some time before returning to this form to
        confirm your updates are reflected in your benefits.
      </p>

      <FormNavButtons
        goBack={props.router.goBack}
        goForward={() => {
          window.location.href =
            '/view-change-dependents/add-remove-form-21-686c-674/introduction';
        }}
        submitToContinue
      />
    </div>
  );
};
