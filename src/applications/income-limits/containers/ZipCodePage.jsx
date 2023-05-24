import React, { useState } from 'react';
import {
  VaButtonPair,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from '../constants';
import { updateZipCode } from '../actions';

const ZipCodePage = ({ router, updateZipCodeField, zipCode }) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const zipCodeValid = zip => {
    return zip.match(/^[0-9]+$/) && zip.length === 5;
  };

  const validZip = zipCode && zipCodeValid(zipCode);

  const onContinueClick = () => {
    setSubmitted(true);

    if (!validZip) {
      setError(true);
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
    router.push('/');
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
  zipCode: state?.incomeLimits?.form?.zipCode,
});

const mapDispatchToProps = {
  updateZipCodeField: updateZipCode,
};

ZipCodePage.propTypes = {
  updateZipCodeField: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }),
  zipCode: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ZipCodePage);
