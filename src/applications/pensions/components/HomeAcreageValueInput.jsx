import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import ProgressButton from '~/platform/forms-system/src/js/components/ProgressButton';

import { isValidCurrency } from '../validation';

const validateCurrency = (value, setError) => {
  if (value === '') {
    setError('');
  } else if (!isValidCurrency(value)) {
    setError('Please enter a valid dollar amount');
  } else {
    setError('');
  }
};

const HomeAcreageValueInput = props => {
  const {
    goBack,
    goForward,
    onReviewPage = false,
    setFormData,
    updatePage,
  } = props;

  const formData = useSelector(state => state.form.data);
  const currentHomeAcreageValue = formData.homeAcreageValue;
  const MAXIMUM_ACRE_VALUE = 999999999;

  const [homeAcreageValue, setHomeAcreageValue] = useState({
    value: currentHomeAcreageValue || '',
    dirty: false,
  });
  const [error, setError] = useState(null);

  useEffect(
    () => {
      validateCurrency(homeAcreageValue.value, setError);
    },
    [homeAcreageValue],
  );

  const handleInputChange = event => {
    setHomeAcreageValue({ value: event.target.value, dirty: true });
  };

  const updateFormData = event => {
    event.preventDefault();

    const inputValue = homeAcreageValue.value;

    if (inputValue === '') {
      const updatedFormData = { ...formData };
      delete updatedFormData.homeAcreageValue;
      setFormData(updatedFormData);
      goForward(formData);
      return;
    }

    if (!isValidCurrency(inputValue)) {
      setError('Please enter a valid dollar amount');
      return;
    }

    let numericValue;

    if (typeof inputValue === 'string') {
      numericValue = parseFloat(inputValue.replace(/,/g, ''));

      if (Number.isNaN(numericValue)) {
        setError('Please enter a valid dollar amount');
        return;
      }
    } else {
      numericValue = inputValue;
    }

    if (numericValue > MAXIMUM_ACRE_VALUE) {
      setError('Please enter an amount less than $999,999,999');
      return;
    }

    setFormData({
      ...formData,
      homeAcreageValue: numericValue,
    });

    goForward(formData);
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = (
    <ProgressButton
      submitButton
      onButtonClick={e => {
        updateFormData(e);
        updatePage(e);
      }}
      buttonText="Update page"
      buttonClass="usa-button-primary"
      ariaLabel="Update Home acreage value page"
    />
  );

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
            Income and assets
          </h3>
        </legend>
        <va-number-input
          currency
          label="What’s the value of the land that’s more than 2 acres?"
          hint="Don’t include the value of the residence or the first 2 acres"
          inputmode="numeric"
          id="home-acreage-value"
          name="home-acreage-value"
          onInput={handleInputChange}
          value={homeAcreageValue.value}
          min={0}
          max={MAXIMUM_ACRE_VALUE}
          width="xl"
          error={error}
        />
        {onReviewPage ? updateButton : navButtons}
      </fieldset>
    </form>
  );
};

HomeAcreageValueInput.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
};

const mapStateToProps = ({ form }) => ({
  formData: form.data,
  homeAcreageValue: form.data.homeAcreageValue,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeAcreageValueInput);
