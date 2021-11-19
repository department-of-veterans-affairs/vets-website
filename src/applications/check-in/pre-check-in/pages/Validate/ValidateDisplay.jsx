/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
import React from 'react';

export default function ValidateDisplay({ validateHandler, isLoading }) {
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <h1>Check in at VA</h1>
      <p>
        We need some information to verify your identity so we can check you in.
      </p>
      <form className="vads-u-margin-bottom--2p5" onSubmit={() => false}>
        <VaTextInput
          autoCorrect="false"
          error={lastNameErrorMessage}
          label="Your last name"
          name="last-name"
          onVaChange={event => setLastName(event.detail.value)}
          required
          spellCheck="false"
          value={lastName}
        />
        <VaTextInput
          error={last4ErrorMessage}
          inputmode="numeric"
          label="Last 4 digits of your Social Security number"
          maxlength="4"
          onVaChange={event => setLast4Ssn(event.detail.value)}
          name="last-4-ssn"
          required
          value={last4Ssn}
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
        {isLoading ? <>Loading...</> : <>Continue</>}
      </button>
    </div>
  );
}
