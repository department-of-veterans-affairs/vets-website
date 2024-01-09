import React, { useCallback, useEffect } from 'react';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { focusElement } from 'platform/utilities/ui';
import {
  VaTextInput,
  VaMemorableDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../../layout/Wrapper';

export default function ValidateDisplay({
  header = '',
  subtitle = '',
  validateHandler,
  isLoading,
  lastNameInput: { lastNameError, setLastName, lastName } = {},
  dobInput: { setDob, dob } = {},
  setDobError,
  showValidateError,
  validateErrorMessage,
}) {
  const { t } = useTranslation();

  useEffect(
    () => {
      if (showValidateError) focusElement('.validate-error-alert');
    },
    [showValidateError],
  );

  const updateField = useCallback(
    event => {
      switch (event.target.name) {
        case 'last-name':
          setLastName(event.target.value);
          break;
        case 'date-of-birth':
          // using a delay here to wait for shadowdom to update with errors more of a problem with safari
          // @TODO remove this once we get an updated va-memorable-date component with an onError property
          setTimeout(() => {
            if (event.target.attributes.error) {
              setDobError(true);
            } else {
              setDobError(false);
            }
          }, 50);
          setDob(event.target.value);
          break;
        default:
          break;
      }
    },
    [setLastName, setDob, setDobError],
  );

  const handleEnter = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // doing this to trigger validation on enter
      if (e.target.name === 'date-of-birth') {
        const nestedShadowElement = e.target.shadowRoot.activeElement.shadowRoot.getElementById(
          'inputField',
        );
        focusElement('.usa-button');
        focusElement(nestedShadowElement);
      }
      validateHandler();
    }
  };
  const handleFormSubmit = e => {
    e.preventDefault();
    validateHandler();
  };

  const lastNameErrorMessage = lastNameError
    ? t('please-enter-your-last-name')
    : '';

  return (
    <Wrapper pageTitle={header || t('check-in-at-va')}>
      <p>
        {subtitle ||
          t(
            'we-need-some-information-to-verify-your-identity-so-we-can-check-you-in',
          )}
      </p>
      {showValidateError ? (
        <div className="validate-error-alert" tabIndex="-1">
          <va-alert
            status="error"
            show-icon
            data-testid="validate-error-alert"
            uswds
            slim
          >
            <div>{validateErrorMessage}</div>
          </va-alert>
        </div>
      ) : (
        <></>
      )}
      <form className="vads-u-margin-bottom--2p5" onSubmit={handleFormSubmit}>
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
          onKeyDown={handleEnter}
          uswds
        />
        <div data-testid="dob-input">
          <VaMemorableDate
            label={t('date-of-birth')}
            onDateBlur={updateField}
            onDateChange={updateField}
            name="date-of-birth"
            value={dob}
            required
            onKeyDown={handleEnter}
            monthSelect={false}
            uswds
          />
        </div>
        {isLoading ? (
          <div className="vads-u-display--flex vads-u-align-itmes--stretch vads-u-flex-direction--column">
            <va-button
              uswds
              big
              disabled
              text={t('loading')}
              role="status"
              data-testid="check-in-button-loading"
              class="vads-u-margin-top--4"
            />
          </div>
        ) : (
          <div className="vads-u-display--flex vads-u-align-itmes--stretch vads-u-flex-direction--column">
            <va-button
              uswds
              submit
              big
              text={t('continue')}
              data-testid="check-in-button"
              class="vads-u-margin-top--4"
              onClick={handleFormSubmit}
            />
          </div>
        )}
      </form>
    </Wrapper>
  );
}

ValidateDisplay.propTypes = {
  dobInput: propTypes.object,
  header: propTypes.string,
  isLoading: propTypes.bool,
  lastNameInput: propTypes.object,
  setDobError: propTypes.func,
  showValidateError: propTypes.bool,
  subtitle: propTypes.string,
  validateErrorMessage: propTypes.elementType,
  validateHandler: propTypes.func,
};
