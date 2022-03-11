import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import i18next from 'i18next';
import { VaTextInput } from 'web-components/react-bindings';

export default function ValidateDisplay({
  header = i18next.t('check-in-at-va'),
  subtitle = i18next.t(
    'we-need-some-information-to-verify-your-identity-so-we-can-check-you-in',
  ),
  validateHandler,
  isLoading,
  lastNameInput: { lastNameErrorMessage, setLastName, lastName } = {},
  last4Input: { last4ErrorMessage, setLast4Ssn, last4Ssn } = {},
  Footer,
  showValidateError,
  validateErrorMessage,
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
      {showValidateError ? (
        <va-alert
          background-only
          status="error"
          show-icon
          data-testid="validate-error-alert"
        >
          <div>{validateErrorMessage}</div>
        </va-alert>
      ) : (
        <></>
      )}
      <form className="vads-u-margin-bottom--2p5" onSubmit={validateHandler}>
        <VaTextInput
          autoCorrect="false"
          error={lastNameErrorMessage}
          label={i18next.t('your-last-name')}
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
          label={i18next.t('last-4-digits-of-your-social-security-number')}
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
        aria-label={i18next.t('check-in-now-for-your-appointment')}
      >
        {' '}
        {isLoading ? (
          <span role="status">Loading...</span>
        ) : (
          <>{i18next.t('continue')}</>
        )}
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
  showValidateError: propTypes.bool,
  subtitle: propTypes.string,
  validateErrorMessage: propTypes.elementType,
  validateHandler: propTypes.func,
};
