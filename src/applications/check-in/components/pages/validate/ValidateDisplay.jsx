import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { focusElement } from 'platform/utilities/ui';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VaMemorableDate } from '@department-of-veterans-affairs/web-components/react-bindings';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import Wrapper from '../../layout/Wrapper';
import TextInputErrorWrapper from '../../TextInputErrorWrapper';

export default function ValidateDisplay({
  header = '',
  subtitle = '',
  validateHandler,
  isLoading,
  lastNameInput: { lastNameErrorMessage, setLastName, lastName } = {},
  last4Input: { last4ErrorMessage, setLast4Ssn, last4Ssn } = {},
  dobInput: { dobErrorMessage, setDob, dob } = {},
  Footer,
  showValidateError,
  validateErrorMessage,
}) {
  const { t } = useTranslation();

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isLorotaSecurityUpdatesEnabled } = useSelector(selectFeatureToggles);
  const [willSubmit, setWillSubmit] = useState(false);

  useEffect(
    () => {
      if (showValidateError) focusElement('.validate-error-alert');
    },
    [showValidateError],
  );

  useEffect(
    () => {
      if (willSubmit) validateHandler();
    },
    [willSubmit, validateHandler],
  );

  const updateField = useCallback(
    event => {
      switch (event.target.name) {
        case 'last-name':
          setLastName(event.target.value);
          break;
        case 'last-4-ssn':
          setLast4Ssn(event.target.value);
          break;
        case 'date-of-birth':
          setDob(event.target.value);
          break;
        default:
          break;
      }
    },
    [setLastName, setLast4Ssn, setDob],
  );
  const handleDateEnterPress = e => {
    const { value } = e.target;
    const [year, month, day] = (value || '').split('-').map(val => val);
    let newValue = value;
    let newMonth = month;
    let newDay = day;
    if (month.length === 1) {
      newMonth = `0${month}`;
    }
    if (day.length === 1) {
      newDay = `0${day}`;
    }

    newValue = `${year}-${newMonth}-${newDay}`;
    setDob(newValue);
    setWillSubmit(true);
  };
  const handleEnter = e => {
    if (e.key === 'Enter') {
      if (e.target.name === 'date-of-birth') {
        handleDateEnterPress(e);
      } else {
        validateHandler();
      }
    }
  };
  const handleFormSubmit = e => {
    e.preventDefault();
    validateHandler();
  };
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
            background-only
            status="error"
            show-icon
            data-testid="validate-error-alert"
          >
            <div>{validateErrorMessage}</div>
          </va-alert>
        </div>
      ) : (
        <></>
      )}
      <form className="vads-u-margin-bottom--2p5" onSubmit={handleFormSubmit}>
        {/* @TODO This error wrapper can go away once fixed in DS. Evaluate during next audit */}
        <TextInputErrorWrapper
          error={lastNameErrorMessage && lastNameErrorMessage.length}
        >
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
          />
        </TextInputErrorWrapper>
        {isLorotaSecurityUpdatesEnabled ? (
          <div
            data-testid="dob-input"
            className={`vads-u-margin-top--3 ${
              dobErrorMessage && dobErrorMessage.length
                ? 'vads-u-padding-left--2p5'
                : ''
            }`}
          >
            <VaMemorableDate
              label={t('date-of-birth')}
              onDateBlur={updateField}
              onDateChange={updateField}
              name="date-of-birth"
              value={dob}
              required
              error={dobErrorMessage}
              onKeyDown={handleEnter}
            />
          </div>
        ) : (
          <TextInputErrorWrapper
            error={last4ErrorMessage && last4ErrorMessage.length}
          >
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
              onKeyDown={handleEnter}
            />
          </TextInputErrorWrapper>
        )}
        <button
          type="button"
          onClick={validateHandler}
          className="usa-button usa-button-big vads-u-margin-top--4"
          data-testid="check-in-button"
          disabled={isLoading}
        >
          {' '}
          {isLoading ? (
            <span role="status">{t('loading')}</span>
          ) : (
            <>{t('continue')}</>
          )}
        </button>
      </form>

      {Footer && <Footer />}
    </Wrapper>
  );
}

ValidateDisplay.propTypes = {
  Footer: propTypes.elementType,
  dobInput: propTypes.object,
  header: propTypes.string,
  isLoading: propTypes.bool,
  last4Input: propTypes.object,
  lastNameInput: propTypes.object,
  showValidateError: propTypes.bool,
  subtitle: propTypes.string,
  validateErrorMessage: propTypes.elementType,
  validateHandler: propTypes.func,
};
