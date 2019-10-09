import React, { useState } from 'react';
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
        To request a Higher-Level Review, you'll need to opt out (withdraw) from
        the old appeals process. This switch triggers us to formally withdraw
        your claim or appeal from the old appeal system and process it under the
        new system. Once you opt in to the new appeals process, the decision is
        permanent and you can't return to the old appeals process.
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
        <div style={{ marginLeft: '1.8em' }} role="presentation">
          I'm removing my claim and any related hearing requests from the old
          appeals process, and I'm requesting these be reviewed under the new
          appeals review process. I understand that this decision is permanent
          and I can't return to the old appeals process.
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
      </div>
    </>
  );
};
