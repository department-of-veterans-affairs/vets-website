import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleSuggestedAddressPicked,
  postMailingAddress,
  validateAddress,
} from '../actions';
import Loader from './Loader';
import ButtonsGroup from './Buttons';
import Alert from './Alert';
import NoSuggestedAddress from './NoSuggestedAddress';
import {
  addressLabel,
  noSuggestedAddress,
  prepareAddressData,
} from '../helpers';

const SuggestedAddress = ({
  formData,
  address,
  handleAddNewClick,
  setAddressToUI,
  setFormData,
  setSuggestedAddressPicked,
  suggestedAddressPicked,
  setGoBackToEdit,
  scrollToTopOfForm,
  applicantName,
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

  // This get called when goBackToEdit buton is clicked
  const onBackToEditClick = event => {
    handleAddNewClick(event);
    setGoBackToEdit(true);
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
      dispatch(handleSuggestedAddressPicked(true));
      try {
        dispatch(validateAddress(fields, applicantName));
      } catch (err) {
        throw new Error(err);
      } finally {
        setFormData({});
      }
    } else {
      try {
        await dispatch(
          postMailingAddress({
            veteranName: applicantName,
            address1: formData.addressLine1,
            address2: formData.addressLine2,
            address3: formData.addressLine3,
            address4: formData.addressLine4,
            city: formData.city,
            ...addressState,
          }),
        );
        setAddressToUI({
          street: `${formData.addressLine1} ${formData.addressLine2 || ''}`,
          city: formData.city,
          ...stateAndZip,
        });
      } catch (err) {
        throw new Error(err);
      } finally {
        dispatch({ type: 'RESET_ADDRESS_VALIDATIONS' });
        setFormData({});
      }
    }
    scrollToTopOfForm();
  };

  return (
    <div className="address-change-form-container">
      {(isLoadingValidateAddress || isLoading) && (
        <Loader className="loader" message="updating..." />
      )}
      <h3 className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--sans vads-u-margin-y--0">
        Mailing address
      </h3>
      <div>
        <NoSuggestedAddress
          deliveryPointValidation={deliveryPointValidation}
          formData={formData}
          setChooseAddress={setChooseAddress}
        />
      </div>
      {(!noSuggestedAddress(deliveryPointValidation) ||
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
              {addressLabel(formData)}
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
              {addressLabel(address)}
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
  applicantName: PropTypes.string.isRequired,
  handleAddNewClick: PropTypes.func.isRequired,
  setAddressToUI: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  setGoBackToEdit: PropTypes.func.isRequired,
  address: PropTypes.object,
  formData: PropTypes.object,
  scrollToTopOfForm: PropTypes.func,
  setSuggestedAddressPicked: PropTypes.func,
  suggestedAddressPicked: PropTypes.bool,
};

export default SuggestedAddress;
