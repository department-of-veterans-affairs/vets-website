import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../sass/change-of-address-wrapper.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import ChangeOfAddressForm from '../components/ChangeOfAddressForm';
import {
  compareAddressObjects,
  hasFormChanged,
  objectHasNoUndefinedValues,
  prepareAddressData,
  scrollToElement,
} from '../helper';
import {
  CHANGE_OF_ADDRESS_TITLE,
  ADDRESS_BUTTON_TEXT,
} from '../constants/index';
import { handleSuggestedAddressPicked, validateAddress } from '../actions';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import SuggestedAddress from '../components/SuggestedAddress';
import AlertModal from '../components/AlertModal';
import { useData } from '../hooks/useData';

const ChangeOfAddressWrapper = ({ loading, applicantName }) => {
  const { latestAddress: mailingAddress } = useData();
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
  const addressType =
    addressValidationData?.addresses[0]?.addressMetaData?.addressType;
  const [toggleAddressForm, setToggleAddressForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [beforeDditFormData, setBeforeEditFormData] = useState({});
  const [suggestedAddressPicked, setSuggestedAddressPicked] = useState(false);
  const [newAddress, setNewAddress] = useState({});
  const [goBackToEdit, setGoBackToEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const PREFIX = 'GI-Bill-Chapters-';
  const location = useLocation();
  const scrollToTopOfForm = () => {
    scrollToElement('Contact information');
  };

  // This Effcet to defalut setNewAddress to mailingAddress
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
    setBeforeEditFormData(formData);
    if (Object.keys(formData).length === 0) {
      Object.assign(formData, editFormData);
    }

    const addressData = prepareAddressData(formData);
    const fields = {
      address: addressData,
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

  // This Effcet to close form after loading is done
  useEffect(
    () => {
      if (!isLoading && !isLoadingValidateAddress) {
        handleCloseForm();
        setSuggestedAddressPicked(false);
      }
    },
    [handleCloseForm, isLoading, isLoadingValidateAddress],
  );
  const setAddressToUI = value => {
    setNewAddress(value);
  };

  // This effect to reset setEditFormData and remove address from sessionStorage
  // When there is error, resonse or validationError
  useEffect(
    () => {
      setEditFormData({});
      sessionStorage.removeItem('address');
      dispatch({ type: 'RESET_ADDRESS_VALIDATIONS' });
      dispatch(handleSuggestedAddressPicked(false));
    },
    [dispatch, error, response, validationError],
  );

  useEffect(
    () => {
      dispatch({ type: 'RESET_ADDRESS_VALIDATIONS' });
    },
    [dispatch, location.pathname],
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
                message="We’re sorry. We can’t update your information right now. We’re working to fix this problem. Please try again later."
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
              {objectHasNoUndefinedValues(newAddress) && (
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
    setFormData({});
    setToggleAddressForm(true);
    scrollToTopOfForm();
    dispatch({ type: 'RESET_ERROR' });
    setGoBackToEdit(false);
  };
  const cancelEditClick = () => {
    setShowModal(false);
    setEditFormData({});
    dispatch({ type: 'RESET_ADDRESS_VALIDATIONS' });
    handleCloseForm();
  };
  const onCancleButtonClicked = () => {
    if (
      (hasFormChanged(formData, applicantName) && !goBackToEdit) ||
      (goBackToEdit && compareAddressObjects(editFormData, beforeDditFormData))
    ) {
      setShowModal(true);
    } else {
      cancelEditClick();
    }
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
            {suggestedAddressPicked ||
            confidenceScore < (addressType === 'International' ? 96 : 100) ? (
              <SuggestedAddress
                formData={editFormData}
                address={JSON.parse(sessionStorage.getItem('address'))}
                handleAddNewClick={event => handleAddNewClick(event)}
                setFormData={setFormData}
                setAddressToUI={setAddressToUI}
                setSuggestedAddressPicked={setSuggestedAddressPicked}
                suggestedAddressPicked={suggestedAddressPicked}
                setGoBackToEdit={setGoBackToEdit}
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
              <Loader className="loader" message="updating..." />
            )}
            <AlertModal
              showModal={showModal}
              setShowModal={setShowModal}
              cancelEditClick={cancelEditClick}
              formType=" mailing address"
            />

            <ChangeOfAddressForm
              applicantName={applicantName}
              addressFormData={formData}
              formChange={addressData => updateAddressData(addressData)}
              formPrefix={PREFIX}
              formSubmit={saveAddressInfo}
              formData={editFormData}
            >
              <div className="button-container">
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
                  onClick={onCancleButtonClicked}
                  data-qa="cancel-button"
                  data-testid={`${PREFIX}form-cancel-button`}
                />
              </div>
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
