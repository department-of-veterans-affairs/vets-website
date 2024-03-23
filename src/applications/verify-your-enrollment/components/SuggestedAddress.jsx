import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { postMailingAddress, validateAddress } from '../actions';
import Loader from './Loader';
import ButtonsGroup from './Buttons';
import Alert from './Alert';
import NoSuggestedAddress from './NoSuggestedAddress';

const SuggestedAddress = ({
  formData,
  address,
  setBackToEdit,
  handleAddNewClick,
  setAddressToUI,
  goBackToAddressDescription,
  setFormData,
}) => {
  const dispatch = useDispatch();
  const {
    isLoadingValidateAddress,
    addressValidationData,
    addressLoader,
  } = useSelector(state => state.addressValidation);
  const { loading: isLoading, error } = useSelector(
    state => state.updateAddress,
  );

  const [isEnteredAddress, setIsEnteredAddress] = useState('suggested');
  const deliveryPointValidation =
    addressValidationData?.addresses[0]?.addressMetaData
      ?.deliveryPointValidation;
  const confidenceScore =
    addressValidationData?.addresses[0]?.addressMetaData?.confidenceScore;

  const onBackToEditClick = event => {
    handleAddNewClick(event);
    setBackToEdit(true);
    setFormData({});
  };
  const isUSA = isEnteredAddress
    ? formData.countryCodeIso3 === 'USA'
    : address.countryCodeIso3 === 'USA';
  const source = isEnteredAddress ? formData : address;

  const stateAndZip = {
    stateCode: isUSA ? source.stateCode : source.province,
    zipCode: isUSA ? source.zipCode : source.internationalPostalCode,
  };

  const handleChange = event => {
    setIsEnteredAddress(event.target.value);
  };
  const onUpdateClicked = () => {
    try {
      if (isEnteredAddress === 'suggested') {
        dispatch(validateAddress(address, formData?.fullName));
      } else {
        const addressState = {
          ...stateAndZip,
          state: stateAndZip.stateCode,
        };
        dispatch(
          postMailingAddress({
            veteranName: formData.fullName,
            address1: formData.addressLine1,
            address2: formData.addressLine2,
            address3: formData.addressLine3,
            address4: formData.addressLine4,
            Validation: 'true',
            city: formData.city,
            ...addressState,
          }),
        );
        goBackToAddressDescription(true);
        if (!isLoading) {
          setFormData({});
        }
      }
    } catch (err) {
      throw new Error(err);
    }
    if (!error) {
      setAddressToUI({
        street: isEnteredAddress
          ? `${formData.addressLine1} ${formData.addressLine2 || ''}`
          : `${address.addressLine1} ${address.addressLine2 || ''}`,
        city: isEnteredAddress ? formData.city : address.city,
        ...stateAndZip,
      });
    }
  };

  return (
    <div className="address-change-form-container">
      {(isLoadingValidateAddress || addressLoader) && (
        <Loader className="loader" />
      )}
      <p className="vads-u-margin-top--0 vads-u-font-weight--bold">
        Mailing address
      </p>
      <div>
        <NoSuggestedAddress
          deliveryPointValidation={deliveryPointValidation}
          confidenceScore={confidenceScore}
          formData={formData}
          onChange={handleChange}
          setIsEnteredAddress={setIsEnteredAddress}
        />
      </div>
      {deliveryPointValidation === 'CONFIRMED' && (
        <>
          <Alert
            status="warning"
            title="We can’t confirm the address you entered with the U.S. Postal Service."
            message=" Tell us which of these addresses you’d like us to use."
          />

          <div className="usa-radio vads-u-margin-top--2p5">
            <span className="vads-u-font-weight--bold">Entered Addresses:</span>
            <input
              className="usa-radio__input"
              id="entered-address"
              type="radio"
              name="addressSelection"
              value="entered"
              onChange={handleChange}
            />
            <label
              className="usa-radio__label vads-u-margin-top--1"
              htmlFor="entered-address"
            >
              {`${formData.addressLine1} ${formData.addressLine2 || ''}`}
              <br />
              {`${formData.city}, ${formData.stateCode} ${formData.zipCode}`}
            </label>
          </div>
          <div className="usa-radio vads-u-margin-top--2p5">
            <span className="vads-u-font-weight--bold">
              Suggested Addresses:
            </span>
            <input
              className="usa-radio__input"
              id="suggested-address"
              type="radio"
              name="addressSelection"
              value="suggested"
              onChange={handleChange}
              defaultChecked
            />
            <label
              className="usa-radio__label vads-u-margin-top--1"
              htmlFor="suggested-address"
            >
              {`${address.addressLine1} ${address.addressLine2 || ''}`}
              <br />
              {`${address.city}, ${address.stateCode} ${address.zipCode}`}
            </label>
          </div>
        </>
      )}
      <ButtonsGroup
        onPrimaryClick={onUpdateClicked}
        onSecondaryClick={onBackToEditClick}
        primaryLabel={
          deliveryPointValidation === 'CONFIRMED'
            ? 'Update'
            : 'Use this address'
        }
        secondaryLabel="Go back to edit"
      />
    </div>
  );
};

SuggestedAddress.propTypes = {
  address: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  handleAddNewClick: PropTypes.func.isRequired,
  setAddressToUI: PropTypes.func.isRequired,
  setBackToEdit: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  goBackToAddressDescription: PropTypes.func,
  handleCloseForm: PropTypes.func,
};

export default SuggestedAddress;
