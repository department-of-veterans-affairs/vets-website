import React, { useEffect, useState } from 'react';
import {
  VaButtonPair,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

import { scrollToTop } from '../utilities/scroll-to-top';
import { ROUTES } from '../constants';
import {
  updateEditMode,
  updateZipCode,
  updateZipValidationServiceError,
} from '../actions';
import { validateZip } from '../api';

const ZipCodePage = ({
  editMode,
  pastMode,
  router,
  toggleEditMode,
  updateZipCodeField,
  updateZipValError,
  year,
  zipCode,
}) => {
  const [formError, setFormError] = useState(false);

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

      waitForRenderThenFocus('h1');
      scrollToTop();
    },
    [pastMode, router, year],
  );

  const onContinueClick = async () => {
    // Zip meets input criteria
    if (inputValid(zipCode)) {
      setFormError(false);

      // Check zip against VES database
      const response = await validateZip(zipCode);

      // Service issue
      // Status codes only returned for not-ok responses
      if (response?.status || !response) {
        updateZipValError(true);
      } else {
        updateZipValError(false);

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
    setFormError(false);
    updateZipValError(false);
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
      <h1>Donec id elit vitae sapien finibus sagittis?</h1>
      <form>
        <VaNumberInput
          className="input-size-3"
          data-testid="il-zipCode"
          error={
            (formError && 'Please enter a valid 5 digit zip code.') || null
          }
          hint="Zip code hint text"
          id="zipCode"
          inputmode="numeric"
          label="Zip code"
          max={99999}
          min={0}
          name="zipCode"
          onBlur={onBlurInput}
          onInput={onZipInput}
          required
          value={zipCode || ''}
        />
        <VaButtonPair
          data-testid="il-buttonPair"
          onPrimaryClick={onContinueClick}
          onSecondaryClick={onBackClick}
          continue
        />
      </form>
    </>
  );
};

const mapStateToProps = state => ({
  editMode: state?.incomeLimits?.editMode,
  pastMode: state?.incomeLimits?.pastMode,
  year: state?.incomeLimits?.form?.year,
  zipCode: state?.incomeLimits?.form?.zipCode,
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ZipCodePage);
