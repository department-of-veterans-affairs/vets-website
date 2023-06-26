import React, { useEffect, useState } from 'react';
import {
  VaButtonPair,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';

import { scrollToTop } from '../utilities/scroll-to-top';
import { ROUTES } from '../constants';
import { updateEditMode, updateZipCode } from '../actions';

const ZipCodePage = ({
  editMode,
  pastMode,
  router,
  toggleEditMode,
  updateZipCodeField,
  zipCode,
}) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const zipCodeValid = zip => {
    return zip.match(/^[0-9]+$/) && zip.length === 5;
  };

  const validZip = zipCode && zipCodeValid(zipCode);

  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

  const onContinueClick = () => {
    setSubmitted(true);

    if (!validZip) {
      setError(true);
    } else if (editMode) {
      setError(false);
      toggleEditMode(false);
      router.push(ROUTES.REVIEW);
    } else {
      setError(false);
      router.push(ROUTES.DEPENDENTS);
    }
  };

  const onBlurInput = () => {
    if (validZip) {
      setError(false);
    }
  };

  const onZipInput = event => {
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
            (submitted && error && 'Please enter a 5 digit zip code') || null
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
  zipCode: state?.incomeLimits?.form?.zipCode,
});

const mapDispatchToProps = {
  toggleEditMode: updateEditMode,
  updateZipCodeField: updateZipCode,
};

ZipCodePage.propTypes = {
  editMode: PropTypes.bool.isRequired,
  pastMode: PropTypes.bool.isRequired,
  updateZipCodeField: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  toggleEditMode: PropTypes.func,
  zipCode: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ZipCodePage);
