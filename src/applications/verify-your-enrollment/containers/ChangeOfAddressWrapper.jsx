import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../sass/change-of-address-wrapper.scss';
import { useDispatch, useSelector } from 'react-redux';
import ChangeOfAddressForm from '../components/ChangeOfAddressForm';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import { objectHaNoUndefinedValues, scrollToElement } from '../helpers';
import {
  CHANGE_OF_ADDRESS_TITLE,
  ADDRESS_BUTTON_TEXT,
} from '../constants/index';
import { validateAddress } from '../actions';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import SuggestedAddress from '../components/SuggestedAddress';

const ChangeOfAddressWrapper = ({ mailingAddress, loading, applicantName }) => {
  const { loading: isLoading, error, data: response } = useSelector(
    state => state.updateAddress,
  );
  const {
    addressValidationData,
    validationError,
    isLoadingValidateAddress,
  } = useSelector(state => state.addressValidation);
  const address = addressValidationData?.addresses[0]?.address;
  const confidenceScore =
    addressValidationData?.addresses[0]?.addressMetaData?.confidenceScore;

  const [toggleAddressForm, setToggleAddressForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [isavlaidate, setIsvalidate] = useState(false);
  const [newAddress, setNewAddress] = useState({});
  const dispatch = useDispatch();
  const PREFIX = 'GI-Bill-Chapters-';

  const scrollToTopOfForm = () => {
    scrollToElement('Contact information');
  };

  useEffect(
    () => {
      setNewAddress(mailingAddress);
    },
    [mailingAddress],
  );
  const handleCloseForm = useCallback(
    () => {
      setFormData({});
      if (confidenceScore === 100 && response) {
        const isUSA = address.countryCodeIso3 === 'USA';
        const stateAndZip = {
          stateCode: isUSA ? address.stateCode : address.province,
          zipCode: isUSA ? address.zipCode : address.internationalPostalCode,
        };
        setNewAddress({
          street: `${address.addressLine1} ${address.addressLine2 || ''}`,
          city: address.city,
          ...stateAndZip,
        });
      }
      sessionStorage.setItem('address', JSON.stringify(address));
      setToggleAddressForm(false);
      scrollToTopOfForm();
    },
    [confidenceScore, response, address],
  );

  // called when submitting form
  const saveAddressInfo = async () => {
    let stateAndZip = {};
    if (formData.countryCodeIso3 === 'USA') {
      stateAndZip = {
        stateCode: formData.stateCode,
        zipCode: formData.zipCode,
      };
    } else {
      stateAndZip = {
        stateCode: formData.province,
        zipCode: formData.internationalPostalCode,
      };
    }
    const fields = {
      address: {
        veteranName: formData.fullName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        addressLine3: formData.addressLine3,
        addressLine4: formData.addressLine4,
        addressPou: 'CORRESPONDENCE',
        addressType: 'DOMESTIC',
        countryCodeIso3: formData.countryCodeIso3,
        city: formData.city,
        ...stateAndZip,
      },
    };
    try {
      dispatch(validateAddress(fields, formData.fullName));
    } catch (err) {
      throw new Error(err);
    }
    if (validationError) {
      setEditFormData({});
    }
  };
  useEffect(
    () => {
      if (!isLoading && !isLoadingValidateAddress) {
        handleCloseForm();
        setIsvalidate(false);
      }
    },
    [handleCloseForm, isLoading, isLoadingValidateAddress],
  );
  const setAddressToUI = value => {
    if (response) {
      setNewAddress(value);
    }
  };
  useEffect(
    () => {
      setEditFormData({});
    },
    [error, response, validationError],
  );
  const addressDescription = () => {
    return (
      <>
        {loading ? (
          <va-loading-indicator
            label="Loading"
            message="Loading mailing address..."
          />
        ) : (
          <div className="vads-u-margin-bottom--1">
            {(error || validationError) && (
              <Alert
                status="error"
                message="Sorry, something went wrong. Please try again Later"
              />
            )}
            {response?.ok && (
              <Alert
                status="success"
                message="Your Address has been successfully updated."
              />
            )}
            <p className="vads-u-margin-top--0 vads-u-font-weight--bold">
              Mailing address
            </p>
            <p>
              {objectHaNoUndefinedValues(newAddress) && (
                <>
                  <span className="vads-u-display--block">
                    {`${newAddress?.street}`}
                  </span>
                  <span className="vads-u-display--block">
                    {`${newAddress?.city}, ${newAddress?.stateCode} ${
                      newAddress?.zipCode
                    }`}
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </>
    );
  };

  const handleAddNewClick = event => {
    event?.preventDefault();
    setToggleAddressForm(true);
    scrollToTopOfForm();
    setFormData({});
    dispatch({ type: 'RESET_ERROR' });
  };
  const updateAddressData = data => {
    const tempData = { ...data };
    if (tempData?.['view:livesOnMilitaryBase']) {
      tempData.countryCodeIso3 = 'USA';
    }
    if (!tempData?.['view:livesOnMilitaryBase']) {
      if (
        tempData?.city === 'APO' ||
        tempData?.city === 'FPO' ||
        tempData?.city === 'DPO'
      ) {
        tempData.city = '';
      }

      if (
        tempData?.stateCode === 'AA' ||
        tempData?.stateCode === 'AE' ||
        tempData?.stateCode === 'AP'
      ) {
        tempData.stateCode = '';
      }
    }

    setFormData(tempData);
    setEditFormData(tempData);
  };

  return (
    <div id={CHANGE_OF_ADDRESS_TITLE}>
      <p className="vads-u-font-size--h2 vads-u-font-family--serif vads-u-font-weight--bold">
        {CHANGE_OF_ADDRESS_TITLE}
      </p>
      <div
        className="vads-u-border-color--gray-lighter
            vads-u-color-gray-dark
            vads-u-display--flex
            vads-u-flex-direction--column
            vads-u-padding-x--2
            vads-u-padding-y--1p5
            medium-screen:vads-u-padding--4
            vads-u-border--1px"
      >
        {!toggleAddressForm && (
          <>
            {confidenceScore < 100 || isavlaidate ? (
              <SuggestedAddress
                formData={editFormData}
                address={JSON.parse(sessionStorage.getItem('address'))}
                handleAddNewClick={event => handleAddNewClick(event)}
                setFormData={setFormData}
                setAddressToUI={setAddressToUI}
                setIsvalidate={setIsvalidate}
                isavlaidate={isavlaidate}
              />
            ) : (
              <>
                {addressDescription()}
                <va-button
                  id="VYE-mailing-address-button"
                  onClick={event => handleAddNewClick(event)}
                  text={ADDRESS_BUTTON_TEXT}
                />
              </>
            )}

            <va-alert
              close-btn-aria-label="Close notification"
              status="info"
              visible
              background-only
              class="vads-u-margin-y--2"
            >
              <p className="vye-alert-absolute-title-position">
                This address is only used for payments for Montgomery GI Bill®
                Benefits.
              </p>
              <p>
                To change your address for other VA services, edit your{' '}
                <a href="https://www.va.gov/profile/personal-information">
                  VA Profile.
                </a>
              </p>
            </va-alert>
            {/* {bankInfoHelpText} */}
          </>
        )}
        {toggleAddressForm && (
          <div className="address-change-form-container">
            <p className="vads-u-font-weight--bold">Change mailing address</p>
            {(isLoadingValidateAddress || isLoading) && (
              <Loader className="loader" />
            )}
            <ChangeOfAddressForm
              applicantName={applicantName}
              addressFormData={formData}
              formChange={addressData => updateAddressData(addressData)}
              formPrefix={PREFIX}
              formSubmit={saveAddressInfo}
              formData={editFormData}
            >
              <LoadingButton
                aria-label="save your Mailing address for GI Bill benefits"
                type="submit"
                loadingText="saving Mailling address"
                className="usa-button-primary vads-u-margin-top--0 address-submit-btn-auto-width"
              >
                Save
              </LoadingButton>
              <va-button
                text="Cancel"
                secondary
                label="cancel updating your bank information for GI Bill benefits"
                onClick={() => {
                  setEditFormData({});
                  handleCloseForm();
                }}
                data-qa="cancel-button"
                data-testid={`${PREFIX}form-cancel-button`}
              />
            </ChangeOfAddressForm>
          </div>
        )}
      </div>
    </div>
  );
};
ChangeOfAddressWrapper.propTypes = {
  applicantName: PropTypes.string,
  loading: PropTypes.bool,
  mailingAddress: PropTypes.object,
};
export default ChangeOfAddressWrapper;
