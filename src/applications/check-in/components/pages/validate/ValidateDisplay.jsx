import React from 'react';

import { VaTextInput } from 'web-components/react-bindings';

export default function ValidateDisplay({
  header = 'Check in at VA',
  subtitle = 'We need some information to verify your identity so we can check you in.',
  validateHandler,
  isLoading,
  lastNameInput: { lastNameErrorMessage, setLastName, lastName } = {},
  last4Input: { last4ErrorMessage, setLast4Ssn, last4Ssn } = {},
  Footer,
  isPreCheckIn = true,
}) {
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <h1>{header}</h1>
      <p>{subtitle}</p>
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
          data-testid="last-name-input"
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
        {isLoading ? <>Loading...</> : <>Continue</>}
      </button>
      {Footer && <Footer isPreCheckIn={isPreCheckIn} />}
    </div>
  );
}
