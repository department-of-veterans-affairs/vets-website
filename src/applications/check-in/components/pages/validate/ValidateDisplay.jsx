import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { focusElement } from 'platform/utilities/ui';
import {
  VaTextInput,
  VaMemorableDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../../layout/Wrapper';
import { makeSelectApp } from '../../../selectors';

export default function ValidateDisplay({
  header = '',
  subtitle = '',
  validateHandler,
  isLoading,
  lastNameInput: { lastNameError, setLastName, lastName } = {},
  dobInput: { setDob, dob, dobError } = {},
  setDobError,
  showValidateError,
  validateErrorMessage,
}) {
  const { t } = useTranslation();

  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);

  useEffect(
    () => {
      if (showValidateError) focusElement('.validate-error-alert');
    },
    [showValidateError],
  );

  useEffect(
    () => {
      if (lastNameError) {
        const nestedShadowElement = document
          .getElementById('last-name-input')
          .shadowRoot.getElementById('inputField');
        focusElement(nestedShadowElement);
      } else if (dobError) {
        // get the first element with the class usa-input--error with in the shadowRoot of the dob-input
        const inputs = document
          .getElementById('dob-input')
          .shadowRoot.querySelectorAll('va-text-input');
        const firstError = [...inputs].find(input => {
          const inputField = input.shadowRoot.getElementById('inputField');
          return inputField.classList.contains('usa-input--error');
        });
        if (firstError) {
          focusElement(firstError.shadowRoot.getElementById('inputField'));
        }
      }
      setDobError(false);
    },
    [lastNameError, dobError, setDobError],
  );

  const updateField = useCallback(
    event => {
      if (event.target.name.includes('date-of-birth')) {
        setDob(event.target.value);
      }
      if (event.target.name === 'last-name') {
        setLastName(event.target.value);
      }
    },
    [setLastName, setDob],
  );

  const handleEnter = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
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
    <Wrapper
      pageTitle={header || t('start-checking-in-for-your-appointment')}
      testID={`${app}-validate-page`}
    >
      <p>{subtitle || t('we-need-your-last-name-and-birth')}</p>
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
          id="last-name-input"
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
            id="dob-input"
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
              big
              text={t('continue')}
              data-testid="check-in-button"
              class="vads-u-margin-top--4"
              onClick={handleFormSubmit}
              id="check-in-button"
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
