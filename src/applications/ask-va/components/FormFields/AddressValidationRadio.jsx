import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { URL, envApiUrl } from '../../constants';
import { formatAddress } from '../../utils/helpers';

const AddressValidationRadio = props => {
  const { formData, setFormData } = props;
  const [apiData, setApiData] = useState([]);
  const [loading, isLoading] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState('');

  const handleValueChange = (address, id) => {
    setSelectedAddress(id);
    const addressString = JSON.stringify({
      city: address.city,
      country: address.countryCodeIso3,
      postalCode: address.zipCode,
      state: address.stateCode,
      province: address.stateProvince?.code || '',
      street: address.addressLine1,
      street2: address.addressLine2 || '',
    });

    setFormData({
      ...formData,
      addressValidation: addressString,
    });
  };

  const {
    state,
    street,
    street2,
    city,
    postalCode,
    militaryAddress,
  } = formData.address;

  const { militaryPostOffice, militaryState } = militaryAddress || {};

  /* eslint-disable camelcase */
  const postData = {
    address_line1: street,
    address_line2: street2,
    city: city || militaryPostOffice,
    zip_code: postalCode,
    state_code: state || militaryState,
    country_name: 'United States',
    country_code_iso3: 'USA',
    address_pou: 'RESIDENCE',
    address_type: 'DOMESTIC',
  };

  const options = {
    body: JSON.stringify({ address: { ...postData } }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const getApiData = url => {
    isLoading(true);
    return apiRequest(url, options)
      .then(res => {
        setApiData(res.addresses);
        isLoading(false);
      })
      .catch(() => {
        isLoading(false);
        handleValueChange(formData.address, 'userEntered');
      });
  };

  useEffect(() => {
    getApiData(`${envApiUrl}${URL.ADDRESS_VALIDATION}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      if (apiData.length > 0) {
        handleValueChange(apiData[0].address, '0');
        focusElement('h2');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiData],
  );

  const renderAddressOption = (address, id = 'userEntered') => {
    const hasConfirmedSuggestions = apiData.length > 0;
    const { addressStreet, cityStateZip, addressCountry } = formatAddress(
      address,
    );

    return (
      <div key={id} className="vads-u-margin-bottom--1p5">
        {hasConfirmedSuggestions && (
          <input
            key={id}
            type="radio"
            id={id}
            onChange={() => {
              handleValueChange(address, id);
            }}
            checked={selectedAddress === id}
          />
        )}
        <label
          htmlFor={id}
          className="vads-u-margin-top--2 vads-u-display--flex vads-u-align-items--center"
        >
          <span
            className="dd-privacy-hidden"
            data-dd-action-name="street address"
          >
            {addressStreet}
          </span>
          <span
            className="dd-privacy-hidden vads-u-margin-left--0p5"
            data-dd-action-name="city, state and zip code"
          >
            {cityStateZip}
          </span>
          <span>{addressCountry}</span>
        </label>
      </div>
    );
  };

  // render loading indicator while we fetch
  if (loading) {
    return (
      <va-loading-indicator label="Loading" message="Loading..." set-focus />
    );
  }

  const deliveryPointValidation =
    apiData &&
    apiData.length > 0 &&
    apiData[0].addressMetaData.deliveryPointValidation;

  const shouldShowSuggestions =
    apiData && apiData.length > 0 && deliveryPointValidation === 'CONFIRMED';

  const noRecommendationsAvailable =
    apiData && apiData.length > 0 && deliveryPointValidation !== 'CONFIRMED';

  return (
    <>
      <div role="alert">
        <VaAlert
          className="vads-u-margin-bottom--2 vads-u-margin-top--2 vads-u-padding-bottom--1"
          status="warning"
          visible={shouldShowSuggestions || noRecommendationsAvailable}
        >
          <h4
            id="address-validation-alert-heading"
            slot="headline"
            className="vads-u-font-size--h3"
          >
            {shouldShowSuggestions
              ? `We can’t confirm the address you entered with the U.S. Postal
            Service`
              : `Confirm your address`}
          </h4>
          <p className="vads-u-margin-y--0">
            {shouldShowSuggestions
              ? 'Tell us which address you’d like to use.'
              : "We can't confirm the address you entered with the U.S. Postal Service. Confirm that you want us to use this address as you entered it. Or go back and edit it."}
          </p>
        </VaAlert>
      </div>
      <div>
        <span className="vads-u-font-weight--bold">You entered</span>
        {renderAddressOption(formData.address)}
        {shouldShowSuggestions && (
          <span className="vads-u-font-weight--bold">
            Suggested {apiData.length > 1 ? 'addresses' : 'address'}
          </span>
        )}
        {shouldShowSuggestions &&
          apiData.map((item, index) =>
            renderAddressOption(item.address, String(index)),
          )}
      </div>
    </>
  );
};

AddressValidationRadio.propTypes = {
  formData: PropTypes.object,
  setFormData: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationRadio);
