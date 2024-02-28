import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../sass/change-of-address-wrapper.scss';
import { useDispatch, useSelector } from 'react-redux';
import ChangeOfAddressForm from '../components/ChangeOfAddressForm';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import { scrollToElement } from '../helpers';
import {
  CHANGE_OF_ADDRESS_TITLE,
  ADDRESS_BUTTON_TEXT,
} from '../constants/index';
import { postMailingAddress } from '../actions';
import Alert from '../components/Alert';
import Loader from '../components/Loader';

const ChangeOfAddressWrapper = ({ mailingAddress, loading }) => {
  const [toggleAddressForm, setToggleAddressForm] = useState(false);
  const [formData, setFormData] = useState({});
  const { loading: isLoading, error, data: response } = useSelector(
    state => state.updateAddress,
  );
  // const [updateAddress, setUpdatedAdress] = useState(mailingAddress);
  const dispatch = useDispatch();
  const PREFIX = 'GI-Bill-Chapters-';

  const scrollToTopOfForm = () => {
    scrollToElement('Contact information');
  };

  const handleCloseForm = useCallback(() => {
    setFormData({}); // clear form data
    setToggleAddressForm(false);
    scrollToTopOfForm();
  }, []);

  // called when submitting form
  const saveAddressInfo = () => {
    // commented out until tied in with redux
    let stateAndZip = {};
    if (formData.countryCodeIso3 === 'USA') {
      stateAndZip = {
        state: formData.stateCode,
        zipCode: formData.zipCode,
      };
    } else {
      stateAndZip = {
        state: formData.province,
        zipCode: formData.internationalPostalCode,
      };
    }

    const fields = {
      veteranName: formData.fullName,
      address1: formData.addressLine1,
      address2: formData.addressLine2,
      address3: formData.addressLine3,
      address4: formData.addressLine4,
      city: formData.city,
      ...stateAndZip,
    };
    dispatch(postMailingAddress(fields));
    // setUpdatedAdress(formData);
  };
  useEffect(
    () => {
      if (!isLoading) {
        handleCloseForm();
      }
    },
    [handleCloseForm, isLoading],
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
            <p className="vads-u-margin-top--0 vads-u-font-weight--bold">
              Mailing address
            </p>
            <p>
              <span className="vads-u-display--block">
                {`${mailingAddress.street}`}
              </span>
              <span className="vads-u-display--block">
                {`${mailingAddress.city}, ${mailingAddress.state} ${
                  mailingAddress.zip
                }`}
              </span>
            </p>
            {error && (
              <Alert
                status="error"
                message="Sorry, something went wrong. Please try agian Later"
              />
            )}
            {response?.ok && (
              <Alert
                status="success"
                message="Your Address has been successfully updated."
              />
            )}
          </div>
        )}
      </>
    );
  };

  const handleAddNewClick = event => {
    event.preventDefault();
    if (!loading) {
      setToggleAddressForm(prevState => !prevState);
      scrollToTopOfForm();
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
            {addressDescription()}
            <va-button
              id="VYE-mailing-address-button"
              onClick={event => handleAddNewClick(event)}
              text={ADDRESS_BUTTON_TEXT}
            />

            <va-alert
              close-btn-aria-label="Close notification"
              status="info"
              visible
              background-only
              class="vads-u-margin-y--2"
            >
              <h2 id="VYE-change-of-mailing-address" slot="headline">
                Change of Mailing Address for Veryify Your Enrollment
              </h2>
              <div>
                <span className="vads-u-margin-y--0">
                  <p>
                    This address is only used for payments for Montgomery GI
                    Bill® Benefits.
                  </p>
                  <p>
                    To change your address for other VA services, edit your{' '}
                    <a href="https://www.va.gov/profile/personal-information">
                      VA Profile.
                    </a>
                  </p>
                </span>
              </div>
            </va-alert>
            {/* {bankInfoHelpText} */}
          </>
        )}
        {toggleAddressForm && (
          <div className="address-change-form-container">
            <p className="vads-u-font-weight--bold">Change mailing address</p>
            {isLoading && <Loader className="loader" />}
            <ChangeOfAddressForm
              addressFormData={formData}
              formChange={addressData => updateAddressData(addressData)}
              formPrefix={PREFIX}
              formSubmit={saveAddressInfo}
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
  loading: PropTypes.bool,
  mailingAddress: PropTypes.object,
};
export default ChangeOfAddressWrapper;
