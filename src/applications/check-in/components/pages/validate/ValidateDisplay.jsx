import React, { useCallback } from 'react';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { VaTextInput } from 'web-components/react-bindings';

export default function ValidateDisplay({
  header = '',
  subtitle = '',
  validateHandler,
  isLoading,
  lastNameInput: { lastNameErrorMessage, setLastName, lastName } = {},
  last4Input: { last4ErrorMessage, setLast4Ssn, last4Ssn } = {},
  Footer,
  showValidateError,
  validateErrorMessage,
}) {
  const { t } = useTranslation();
  const updateField = useCallback(
    event => {
      switch (event.target.name) {
        case 'last-name':
          setLastName(event.target.value);
          break;
        case 'last-4-ssn':
          setLast4Ssn(event.target.value);
          break;
        default:
          break;
      }
    },
    [setLastName, setLast4Ssn],
  );
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <h1>{header || t('check-in-at-va')}</h1>
      <p>
        {subtitle ||
          t(
            'we-need-some-information-to-verify-your-identity-so-we-can-check-you-in',
          )}
      </p>
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
          label={t('your-last-name')}
          name="last-name"
          onInput={updateField}
          required
          spellCheck="false"
          value={lastName}
          data-testid="last-name-input"
        />
        <VaTextInput
          error={last4ErrorMessage}
          inputmode="numeric"
          label={t('last-4-digits-of-your-social-security-number')}
          maxlength="4"
          onInput={updateField}
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
        aria-label={t('check-in-now-for-your-appointment')}
      >
        {' '}
        {isLoading ? (
          <span role="status">{t('loading')}</span>
        ) : (
          <>{t('continue')}</>
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
