import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../sass/change-of-address-wrapper.scss';
import ChangeOfAddressForm from '../components/ChangeOfAddressForm';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import { scrollToElement } from '../helpers';
import {
  CHANGE_OF_ADDRESS_TITLE,
  ADDRESS_BUTTON_TEXT,
} from '../constants/index';

const ChangeOfAddressWrapper = ({ mailingAddress, loading }) => {
  const [toggleAddressForm, setToggleAddressForm] = useState(false);
  const [formData, setFormData] = useState({});

  const PREFIX = 'GI-Bill-Chapters-';

  const scrollToTopOfForm = () => {
    scrollToElement('Contact information');
  };

  const handleCloseForm = () => {
    setFormData({}); // clear form data
    setToggleAddressForm(false);
    scrollToTopOfForm();
  };

  // called when submitting form
  const saveAddressInfo = () => {
    // commented out until tied in with redux
    // const fields = {
    //     bankname: formData[`${PREFIX}BankName`],
    //     bankPhone: formData[`${PREFIX}BankPhone`],
    //     routingNumber: formData[`${PREFIX}RoutingNumber`],
    //     accountNumber: formData[`${PREFIX}AccountNumber`],
    //     accountType: formData[`${PREFIX}AccountType`],

    // };
    handleCloseForm(); // close addressForm form
    // add redux logic here when API is available
  };

  const addressDescription = () => {
    return (
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
      </div>
    );
  };

  const handleAddNewClick = () => {
    // toggle show form true
    setToggleAddressForm(true);
    scrollToTopOfForm();
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
            {loading ? (
              <va-loading-indicator
                label="Loading"
                message="Loading mailing address..."
              />
            ) : (
              <>
                {addressDescription()}
                <va-button
                  id="VYE-mailing-address-button"
                  onClick={handleAddNewClick}
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

            <ChangeOfAddressForm
              addressFormData={formData}
              formChange={addressData => updateAddressData(addressData)}
              formPrefix={PREFIX}
              formSubmit={saveAddressInfo}
            >
              <LoadingButton
                aria-label="save your bank information for GI Bill benefits"
                type="submit"
                loadingText="saving bank information"
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
