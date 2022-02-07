import React, { useCallback } from 'react';
import propTypes from 'prop-types';

import { VaTextInput } from 'web-components/react-bindings';

export default function ValidateDisplay({
  header = 'Check in at VA',
  subtitle = 'We need some information to verify your identity so we can check you in.',
  validateHandler,
  isLoading,
  lastNameInput: { lastNameErrorMessage, setLastName, lastName } = {},
  last4Input: { last4ErrorMessage, setLast4Ssn, last4Ssn } = {},
  Footer,
}) {
  const updateField = useCallback(
    event => {
      switch (event.target.name) {
        case 'last-name':
          setLastName(event.detail.value);
          break;
        case 'last-4-ssn':
          setLast4Ssn(event.detail.value);
          break;
        default:
          break;
      }
    },
    [setLastName, setLast4Ssn],
  );
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <h1>{header}</h1>
      <p>{subtitle}</p>
      <form className="vads-u-margin-bottom--2p5" onSubmit={validateHandler}>
        <VaTextInput
          autoCorrect="false"
          error={lastNameErrorMessage}
          label="Your last name"
          name="last-name"
          onVaChange={updateField}
          required
          spellCheck="false"
          value={lastName}
          data-testid="last-name-input"
        />
        <VaTextInput
          error={last4ErrorMessage}
          inputmode="numeric"
          label="Last 4 digits of your Social Security number"
          maxlength="4"
          onVaChange={updateField}
          name="last-4-ssn"
          required
          value={last4Ssn}
          data-testid="last-4-input"
        />
      </form>
      <button
        onClick={validateHandler}
        type="button"
        className="usa-button usa-button-big"
        data-testid="check-in-button"
        disabled={isLoading}
        aria-label="Check in now for your appointment"
      >
        {' '}
        {isLoading ? <span role="status">Loading...</span> : <>Continue</>}
      </button>
      {Footer && <Footer />}
    </div>
  );
}

ValidateDisplay.propTypes = {
  Footer: propTypes.elementType,
  header: propTypes.string,
  isLoading: propTypes.bool,
  last4Input: propTypes.object,
  lastNameInput: propTypes.object,
  subtitle: propTypes.string,
  validateHandler: propTypes.func,
};
