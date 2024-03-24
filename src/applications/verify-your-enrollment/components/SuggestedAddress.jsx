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
  handleAddNewClick,
  setAddressToUI,
  setFormData,
}) => {
  const dispatch = useDispatch();
  const { isLoadingValidateAddress, addressValidationData } = useSelector(
    state => state.addressValidation,
  );
  const { loading: isLoading } = useSelector(state => state.updateAddress);

  const [isEnteredAddress, setIsEnteredAddress] = useState('suggested');
  const deliveryPointValidation =
    addressValidationData?.addresses[0]?.addressMetaData
      ?.deliveryPointValidation;
  const confidenceScore =
    addressValidationData?.addresses[0]?.addressMetaData?.confidenceScore;

  const onBackToEditClick = event => {
    handleAddNewClick(event);
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
  const onUpdateClicked = async () => {
    const addressState = {
      ...stateAndZip,
      state: stateAndZip.stateCode,
    };
    if (isEnteredAddress === 'suggested') {
      try {
        await dispatch(validateAddress(address, formData?.fullName));
        dispatch({ type: 'RESER_ADDRESS_VALIDATIONS' });
        setFormData({});
      } catch (err) {
        setFormData({});
        throw new Error(err);
      }
    } else {
      try {
        await dispatch(
          postMailingAddress({
            veteranName: formData.fullName,
            address1: formData.addressLine1,
            address2: formData.addressLine2,
            address3: formData.addressLine3,
            address4: formData.addressLine4,
            city: formData.city,
            ...addressState,
          }),
        );
        dispatch({ type: 'RESER_ADDRESS_VALIDATIONS' });
        setFormData({});
      } catch (err) {
        setFormData({});
        throw new Error(err);
      }
      setAddressToUI({
        street: `${formData.addressLine1} ${formData.addressLine2 || ''}`,
        city: formData.city,
        ...stateAndZip,
      });
    }
  };
  return (
    <div className="address-change-form-container">
      {(isLoadingValidateAddress || isLoading) && <Loader className="loader" />}
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
  setFormData: PropTypes.func.isRequired,
  handleCloseForm: PropTypes.func,
};

export default SuggestedAddress;
