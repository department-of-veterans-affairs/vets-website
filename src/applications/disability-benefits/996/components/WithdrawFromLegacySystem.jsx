import React, { useState } from 'react';
// import CheckboxWidget from 'platform/forms-system/src/js/widgets/CheckboxWidget';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

export const WithdrawFromLegacySystem = ({ onContinue }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // TODO - update with approved message; add to form config?
  const displayedError = 'Please check the above box to proceed';

  return (
    <>
      <h3 className="confirmation-page-title">
        Withdraw from legacy appeal system
      </h3>
      <p>
        In order to request a Higher-Level Review, you need to opt out of the
        Legacy Appeals system. Once you opt in to the new system, the decision
        is permanent and you cannot return to the Legacy appeals system. The
        switch triggers VA to formally withdraw the claimants' claim or appeal
        from the old system and process it in the new system.
      </p>
      <div>
        <ErrorableCheckbox
          id="withdraw-from-legacy-system"
          label={
            <strong>
              I elect to participate in the modernized review system.
            </strong>
          }
          onValueChange={checked => {
            setIsChecked(checked);
            setErrorMessage(checked ? '' : displayedError);
          }}
          errorMessage={errorMessage}
          title="Required opt-in"
        />
        <div style={{ marginLeft: '1.8em' }}>
          I am widthdrawing this eligible appeal issues and any associated
          hearing requests, from the legacy appeals system to seek review of
          those issues in VA's modernized review system. I understand that I
          cannot return to the legacy appeals process for the issue(s)
          withdrawn.
        </div>
        <p>
          <a
            href="/decision-reviews"
            className="usa-button usa-button-secondary"
          >
            « Back
          </a>
          <button
            type="button"
            className="usa-button-primary"
            onClick={() => {
              if (isChecked) {
                onContinue();
              } else {
                setErrorMessage(displayedError);
              }
            }}
          >
            Continue »
          </button>
        </p>
        <p>
          <a href="/decision-reviews">Learn more about the review options</a>
        </p>
        <p>
          {/* TODO - make this link do something */}
          <a href="#">See all your contested issues</a>
        </p>
        <br />
        <br />
      </div>
    </>
  );
};
