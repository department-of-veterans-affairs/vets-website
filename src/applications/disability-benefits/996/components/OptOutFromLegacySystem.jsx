import React, { useState } from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

import {
  OptOutDescription,
  OptInCheckBoxLabel,
  OptInCheckboxDescription,
} from '../content/OptOutOldAppeals';
import { errorMessages } from '../constants';

export const OptOutFromLegacySystem = ({ onContinue }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      {OptOutDescription}
      <div>
        <ErrorableCheckbox
          id="opt-out-from-legacy-system"
          label={OptInCheckBoxLabel}
          onValueChange={checked => {
            setIsChecked(checked);
            setErrorMessage(checked ? '' : errorMessages.optOutCheckbox);
          }}
          errorMessage={errorMessage}
          title="Required opt-in"
        />
        {OptInCheckboxDescription}
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
                setErrorMessage(errorMessages.optOutCheckbox);
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
