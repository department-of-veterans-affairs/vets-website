import React, { useState, useEffect } from 'react';
import '../sass/change-of-direct-deposit-wrapper.scss';
import ChangeOfDirectDepositForm from '../components/ChangeOfDirectDepositForm';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

import { scrollToElement } from '../helpers';
import {
  CHANGE_OF_DIRECT_DEPOSIT_TITLE,
  SMALL_SCREEN,
} from '../constants/index';

const ChangeOfDirectDepositWrapper = () => {
  const [toggleDirectDepositForm, setToggleDirectDepositForm] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [formData, setFormData] = useState({});

  const PREFIX = 'GI-Bill-Chapters-';

  const handleCloseForm = () => {
    setFormData({}); // clear form data
    setToggleDirectDepositForm(false);
  };

  // called when submitting form
  const saveBankInfo = () => {
    // commented out until tied in with redux
    // const fields = {
    //     bankname: formData[`${PREFIX}BankName`],
    //     bankPhone: formData[`${PREFIX}BankPhone`],
    //     routingNumber: formData[`${PREFIX}RoutingNumber`],
    //     accountNumber: formData[`${PREFIX}AccountNumber`],
    //     accountType: formData[`${PREFIX}AccountType`],

    // };
    handleCloseForm(); // close directDeposit form
    // add redux logic here when API is available
  };

  const directDepositDescription = (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
      <p>
        Please enter your bank’s routing and account numbers and your account
        type.
      </p>
      {screenWidth > SMALL_SCREEN && (
        <img
          src="/img/direct-deposit-check-guide.svg"
          alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
        />
      )}
    </div>
  );

  const gaBankInfoHelpText = () => {
    window.dataLayer.push({
      event: 'VYE-change-of-direct-deposit-help-text-clicked',
      'help-text-label': 'What if I don’t have a bank account?',
    });
  };

  const bankInfoHelpText = (
    <va-additional-info
      trigger="What if I don’t have a bank account?"
      onClick={gaBankInfoHelpText}
    >
      <span>
        <p>
          The{' '}
          <a href="https://veteransbenefitsbanking.org/">
            Veterans Benefits Banking Program (VBBP)
          </a>{' '}
          provides a list of Veteran-friendly banks and credit unions. They’ll
          work with you to set up an account, or help you qualify for an
          account, so you can use direct deposit. To get started, call one of
          the participating banks or credit unions listed on the VBBP website.
          Be sure to mention the Veterans Benefits Banking Program.
        </p>
        <p>
          Note: Federal regulation, found in 31 C.F.R. § 208.3 provides that,
          subject to section 208.4, “all Federal payments made by an agency
          shall be made by electronic funds transfer” (EFT).
        </p>
      </span>
    </va-additional-info>
  );

  const handleAddNewClick = () => {
    // toggle show form true
    setToggleDirectDepositForm(true);
  };

  // set innerWidth of screen to screenWidth state
  // this state handles when to show the check image
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //   scroll to top of div when edit page is canceled or saved
  useEffect(
    () => {
      if (!toggleDirectDepositForm) {
        scrollToElement('Direct deposit information');
        // const element = document.getElementById('Direct deposit information');
        // if (element) {
        //   element.scrollIntoView({ behavior: 'smooth' });
        // }
      }
    },
    [toggleDirectDepositForm],
  );

  return (
    <div id={CHANGE_OF_DIRECT_DEPOSIT_TITLE}>
      <p className="vads-u-font-size--h2 vads-u-font-weight--bold">
        {CHANGE_OF_DIRECT_DEPOSIT_TITLE}
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
        {!toggleDirectDepositForm && (
          <>
            <va-button
              id="VYE-add-new-account-button"
              onClick={handleAddNewClick}
              text="Add new account"
            />
            <va-alert
              close-btn-aria-label="Close notification"
              status="info"
              visible
              background-only
              class="vads-u-margin-y--2"
            >
              <h2 id="VYE-change-of-direct-deposit" slot="headline">
                Change of Direct Deposit for Veryify Your Enrollment
              </h2>
              <div>
                <span className="vads-u-margin-y--0">
                  <p>
                    This direct deposit information is only used for payments
                    for Montgomery GI Bill Benefits
                  </p>
                  <p>
                    To change your direct deposit information for other VA
                    services, edit your{' '}
                    <a href="https://www.va.gov/profile/personal-information">
                      VA Profile.
                    </a>
                  </p>
                </span>
              </div>
            </va-alert>
            {bankInfoHelpText}
          </>
        )}
        {toggleDirectDepositForm && (
          <div className="direct-deposit-form-container">
            <p className="vads-u-font-weight--bold">Add new account</p>
            {directDepositDescription}
            <ChangeOfDirectDepositForm
              formData={formData}
              formChange={data => setFormData(data)}
              formPrefix={PREFIX}
              formSubmit={saveBankInfo}
            >
              <LoadingButton
                aria-label="save your bank information for GI Bill benefits"
                type="submit"
                loadingText="saving bank information"
                className="usa-button-primary vads-u-margin-top--0 ach-submit-btn-auto-width"
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
            </ChangeOfDirectDepositForm>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeOfDirectDepositWrapper;
