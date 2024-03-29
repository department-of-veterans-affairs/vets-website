import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { postMailingAddress, validateAddress } from '../actions';
import Loader from './Loader';
import ButtonsGroup from './Buttons';
import Alert from './Alert';
import NoSuggestedAddress from './NoSuggestedAddress';
import { prepareAddressData } from '../helpers';

const SuggestedAddress = ({
  formData,
  address,
  handleAddNewClick,
  setAddressToUI,
  setFormData,
  setSuggestedAddressPicked,
  suggestedAddressPicked,
}) => {
  const dispatch = useDispatch();
  const { isLoadingValidateAddress, addressValidationData } = useSelector(
    state => state.addressValidation,
  );
  const { loading: isLoading } = useSelector(state => state.updateAddress);

  const [chooseAddress, setChooseAddress] = useState('suggested');
  const deliveryPointValidation =
    addressValidationData?.addresses[0]?.addressMetaData
      ?.deliveryPointValidation;
  const confidenceScore =
    addressValidationData?.addresses[0]?.addressMetaData?.confidenceScore;

  // This get called when goBackToEdit buton is clicked
  const onBackToEditClick = event => {
    handleAddNewClick(event);
  };
  const isUSA = chooseAddress
    ? formData.countryCodeIso3 === 'USA'
    : address.countryCodeIso3 === 'USA';
  const source = chooseAddress ? formData : address;

  const stateAndZip = {
    stateCode: isUSA ? source.stateCode : source.province,
    zipCode: isUSA ? source.zipCode : source.internationalPostalCode,
  };
  const handleChange = event => {
    setChooseAddress(event.target.value);
  };

  // get calls when suggested address or entered address is selected
  const onUpdateClicked = async () => {
    const addressState = {
      ...stateAndZip,
      state: stateAndZip.stateCode,
    };
    const addressData = prepareAddressData(address);
    const fields = {
      address: addressData,
    };
    if (chooseAddress === 'suggested') {
      setSuggestedAddressPicked(true);
      try {
        dispatch(validateAddress(fields, formData?.fullName));
      } catch (err) {
        throw new Error(err);
      } finally {
        setFormData({});
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
      } catch (err) {
        throw new Error(err);
      } finally {
        dispatch({ type: 'RESET_ADDRESS_VALIDATIONS' });
        setFormData({});
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
      {(isLoadingValidateAddress || isLoading) && (
        <Loader className="loader" message="updating..." />
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
          setChooseAddress={setChooseAddress}
        />
      </div>
      {((deliveryPointValidation !== undefined &&
        deliveryPointValidation === 'CONFIRMED') ||
        suggestedAddressPicked) && (
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
              {`${formData?.addressLine1} ${formData?.addressLine2 || ''}`}
              <br />
              {`${formData?.city}, ${formData?.stateCode} ${formData?.zipCode}`}
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
              {`${address?.addressLine1} ${address?.addressLine2 || ''}`}
              <br />
              {`${address?.city}, ${address?.stateCode} ${address?.zipCode}`}
            </label>
          </div>
        </>
      )}
      <ButtonsGroup
        onPrimaryClick={onUpdateClicked}
        onSecondaryClick={onBackToEditClick}
        primaryLabel={
          (deliveryPointValidation !== undefined &&
            deliveryPointValidation === 'CONFIRMED') ||
          suggestedAddressPicked
            ? 'Update'
            : 'Use this address'
        }
        secondaryLabel="Go back to edit"
      />
    </div>
  );
};

SuggestedAddress.propTypes = {
  handleAddNewClick: PropTypes.func.isRequired,
  setAddressToUI: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  address: PropTypes.object,
  formData: PropTypes.object,
  setSuggestedAddressPicked: PropTypes.func,
  suggestedAddressPicked: PropTypes.bool,
};

export default SuggestedAddress;
