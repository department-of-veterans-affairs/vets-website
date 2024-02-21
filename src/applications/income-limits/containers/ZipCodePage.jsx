import React, { useEffect, useState } from 'react';
import {
  VaButtonPair,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { getPreviousYear } from '../utilities/utils';
import { ROUTES } from '../constants';
import {
  updateEditMode,
  updateZipCode,
  updateZipValidationServiceError,
} from '../actions';
import { validateZip } from '../api';
import { customizeTitle } from '../utilities/customize-title';

const ZipCodePage = ({
  editMode,
  pastMode,
  router,
  toggleEditMode,
  updateZipCodeField,
  updateZipValError,
  year,
  zipCode,
  zipValidationServiceError,
}) => {
  const [formError, setFormError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const determineH1 = () => {
    return pastMode && year
      ? `What was your zip code in ${year - 1}?`
      : `What was your zip code last year?`;
  };

  useEffect(() => {
    document.title = customizeTitle(determineH1());
  });

  // Checks that a zip was entered and is numbers only and has length of 5
  const inputValid = zip => {
    return zipCode && zip.match(/^[0-9]+$/) && zip.length === 5;
  };

  useEffect(
    () => {
      // If pastMode is null, the home screen hasn't been used yet
      let shouldRedirectToHome = pastMode === null;

      if (pastMode) {
        shouldRedirectToHome = !year;
      }

      if (shouldRedirectToHome) {
        router.push(ROUTES.HOME);
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      waitForRenderThenFocus('h1');
    },
    [pastMode, router, year],
  );

  const onContinueClick = async () => {
    // Zip meets input criteria
    if (inputValid(zipCode)) {
      setSubmitting(true);
      setFormError(false);

      // Check zip against VES database
      const response = await validateZip(zipCode);
      setSubmitting(false);

      // Service issue
      // Status codes only returned for not-ok responses
      if (response?.status || !response) {
        updateZipValError(true);
      } else {
        updateZipValError(false);
        setSubmitting(false);

        // eslint-disable-next-line camelcase
        const zipIsValid = response?.zip_is_valid;

        if (zipIsValid) {
          // All is good, go to next page
          if (editMode) {
            toggleEditMode(false);
            router.push(ROUTES.REVIEW);
          } else {
            router.push(ROUTES.DEPENDENTS);
          }
        } else {
          // No service error, but not a valid zip
          setFormError(true);
        }
      }
    } else {
      // Zip does not meet input criteria
      setFormError(true);
    }
  };

  const onBlurInput = () => {
    if (inputValid(zipCode)) {
      setFormError(false);
    }
  };

  const onZipInput = event => {
    if (formError || zipValidationServiceError) {
      setFormError(false);
      updateZipValError(false);
    }

    updateZipCodeField(event.target.value);
  };

  const onBackClick = () => {
    if (editMode) {
      toggleEditMode(false);
    }

    if (pastMode) {
      router.push(ROUTES.YEAR);
    } else {
      router.push(ROUTES.HOME);
    }
  };

  return (
    <>
      <h1>{determineH1()}</h1>
      <form>
        <VaNumberInput
          className="input-size-3"
          data-testid="il-zipCode"
          error={
            (formError && 'Please enter a valid 5 digit zip code.') || null
          }
          hint={`Enter the zip code for where you lived for all or most of ${getPreviousYear(
            pastMode,
            year,
          )}.`}
          id="zipCode"
          inputmode="numeric"
          label="Zip code"
          max={99999}
          min={0}
          name="zipCode"
          onBlur={onBlurInput}
          onInput={onZipInput}
          required
          uswds
          value={zipCode || ''}
        />
        {!submitting && (
          <VaButtonPair
            class="vads-u-margin-top--1"
            data-testid="il-buttonPair"
            onPrimaryClick={onContinueClick}
            onSecondaryClick={onBackClick}
            continue
            uswds
          />
        )}
        {submitting && (
          <va-loading-indicator
            data-testid="il-loading-indicator"
            set-focus
            message="Reviewing your information..."
          />
        )}
      </form>
    </>
  );
};

const mapStateToProps = state => ({
  editMode: state?.incomeLimits?.editMode,
  pastMode: state?.incomeLimits?.pastMode,
  year: state?.incomeLimits?.form?.year,
  zipCode: state?.incomeLimits?.form?.zipCode,
  zipValidationServiceError: state?.incomeLimits?.zipValidationServiceError,
});

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
  updateZipCodeField: updateZipCode,
  updateZipValError: updateZipValidationServiceError,
};

ZipCodePage.propTypes = {
  editMode: PropTypes.bool.isRequired,
  pastMode: PropTypes.bool.isRequired,
  updateZipCodeField: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  toggleEditMode: PropTypes.func,
  updateZipValError: PropTypes.func,
  year: PropTypes.string,
  zipCode: PropTypes.string,
  zipValidationServiceError: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ZipCodePage);
