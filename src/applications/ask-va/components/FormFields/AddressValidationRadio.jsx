import React, { useEffect, useState } from 'react';
// import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
// import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { ServerErrorAlert } from '../../config/helpers';
// import { URL } from '../../constants';
import { formatAddress } from '../../helpers';
import { candidateAddresses } from '../../config/chapters/personalInformation/mockValidationResponse';

const AddressValidationRadio = props => {
  const { formData, setFormData } = props;
  const [apiData, setApiData] = useState([]);
  // const [loading, isLoading] = useState(false);
  const [error, hasError] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState('');

  const handleValueChange = (address, id) => {
    setSelectedAddress(id);
    const addressString = JSON.stringify({
      city: address.city,
      country: address.country.iso3Code || address.country,
      postalCode: address.postalCode || address.zipCode5,
      state: address.state || address.stateProvince?.code,
      province: address.stateProvince?.code || '',
      street: address.street || address.addressLine1,
      street2: address.street2 || address.addressLine2,
    });

    setFormData({
      ...formData,
      addressConfirmation: addressString,
    });
  };

  useEffect(() => {
    // TODO: Add apiRequest to get data from api when available
    if (candidateAddresses.length > 0) {
      setApiData(candidateAddresses);
      handleValueChange(candidateAddresses[0], '0');
    } else {
      // change when api it added
      hasError(false);
    }
    focusElement('#address-validation-alert-heading');
  }, []);

  const renderAddressOption = (address, id = 'userEntered') => {
    const hasConfirmedSuggestions = apiData.length > 0;
    const { addressStreet, cityStateZip, addressCountry } = formatAddress(
      address,
    );

    return (
      <div key={id} className="vads-u-margin-bottom--1p5">
        {hasConfirmedSuggestions && (
          <input
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
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-bottom--0p5">
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="street address"
            >
              {addressStreet}
            </span>
            <span
              className="dd-privacy-hidden"
              data-dd-action-name="city, state and zip code"
            >
              {cityStateZip}
            </span>
            <span>{addressCountry}</span>
          </div>
        </label>
      </div>
    );
  };

  // render loading indicator while we fetch
  // if (loading) {
  //   return (
  //     <va-loading-indicator label="Loading" message="Loading..." set-focus />
  //   );
  // }

  const shouldShowSuggestions = apiData.length > 0;

  return !error ? (
    <>
      <div role="alert">
        {/* TODO: When API is in place. Remove alert if one address is found */}
        <VaAlert
          className="vads-u-margin-bottom--1 vads-u-margin-top--0"
          status="warning"
          visible
          uswds
        >
          <h4 id="address-validation-alert-heading" slot="headline">
            We can’t confirm the address you entered with the U.S. Postal
            Service
          </h4>
          <p>Tell us which addresses you’d like to use.</p>
        </VaAlert>
      </div>
      <div>
        <span className="vads-u-font-weight--bold">You entered:</span>
        {renderAddressOption(formData.address)}
        <span className="vads-u-font-weight--bold">Suggested Addresses:</span>
        {shouldShowSuggestions ? (
          apiData.map((address, index) =>
            renderAddressOption(address, String(index)),
          )
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </>
  ) : (
    <ServerErrorAlert />
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
