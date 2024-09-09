import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import '../sass/change-of-direct-deposit-wrapper.scss';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import ChangeOfDirectDepositForm from '../components/ChangeOfDirectDepositForm';

import { hasFormChanged, scrollToElement } from '../helpers';
import {
  CHANGE_OF_DIRECT_DEPOSIT_TITLE,
  DIRECT_DEPOSIT_BUTTON_TEXT,
} from '../constants/index';
import { updateBankInfo } from '../actions';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import AlertModal from '../components/AlertModal';

const ChangeOfDirectDepositWrapper = ({ applicantName }) => {
  const prefix = 'GI-Bill-Chapters-';
  const [toggleDirectDepositForm, setToggleDirectDepositForm] = useState(false);
  const [formData, setFormData] = useState();
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, data: response } = useSelector(
    state => state.bankInfo,
  );

  const scrollToTopOfForm = () => {
    scrollToElement('Direct deposit information');
  };

  const handleCloseForm = useCallback(() => {
    setFormData({}); // clear form data
    setToggleDirectDepositForm(false);
    setShowModal(false);
    scrollToTopOfForm();
  }, []);

  const onCancelButtonClick = () => {
    if (hasFormChanged(formData, applicantName)) {
      setShowModal(true);
    } else {
      handleCloseForm();
    }
  };
  // called when submitting form
  const saveBankInfo = () => {
    // commented out until tied in with redu
    const fields = {
      phone: formData[`${prefix}phone`],
      // phone2: formData[`${prefix}phone`],
      fullName: applicantName,
      email: formData[`${prefix}email`],
      acctType: formData[`${prefix}AccountType`].toLowerCase(),
      routingNo: formData[`${prefix}RoutingNumber`],
      acctNo: formData[`${prefix}AccountNumber`],
      bankName: formData[`${prefix}BankName`],
      bankPhone: formData[`${prefix}BankPhone`],
    };
    dispatch(updateBankInfo(fields));
  };

  useEffect(
    () => {
      if (!loading && (response || error)) {
        handleCloseForm();
      } else {
        window.scrollTo(0, 0);
      }
    },
    [error, handleCloseForm, loading, response],
  );
  const directDepositDescription = (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
      <p>
        Please enter your bank’s routing and account numbers and your account
        type.
      </p>
      <img
        src="/img/direct-deposit-check-guide.svg"
        alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
      />
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
    scrollToTopOfForm();
  };

  return (
    <div id={CHANGE_OF_DIRECT_DEPOSIT_TITLE}>
      <h2 className="vads-u-font-family--serif vads-u-margin-y--4">
        {CHANGE_OF_DIRECT_DEPOSIT_TITLE}
      </h2>
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
            {error && (
              <Alert
                status="error"
                message="Sorry, something went wrong. Please try again Later"
              />
            )}
            {response?.ok && (
              <Alert
                status="success"
                title="New account added"
                message="We’ve updated your direct deposit information for Montgomery GI Bill benefits."
              />
            )}
            <va-button
              id="VYE-add-new-account-button"
              onClick={handleAddNewClick}
              text={DIRECT_DEPOSIT_BUTTON_TEXT}
            />
            <div>
              <p>
                <span className="vads-u-font-weight--bold">Note: </span>
                Any updates you make here will affect your Montgomery GI Bill
                benefits only.{' '}
              </p>
              <va-link
                href="/change-direct-deposit/"
                text="Learn how to update your direct deposit account for other VA benefits"
              />
              <div className="vads-u-margin-top--3">{bankInfoHelpText}</div>
            </div>
          </>
        )}
        {toggleDirectDepositForm && (
          <div className="direct-deposit-form-container">
            <h3 className="vads-u-line-height--4 vads-u-font-size--base vads-u-font-family--serif vads-u-margin-y--0">
              Add new account
            </h3>
            {directDepositDescription}
            {loading && <Loader className="loader" />}
            <ChangeOfDirectDepositForm
              defaultName={applicantName}
              formData={formData ?? {}}
              formChange={data => setFormData(data)}
              formPrefix={prefix}
              formSubmit={saveBankInfo}
            >
              <AlertModal
                showModal={showModal}
                setShowModal={setShowModal}
                cancelEditClick={handleCloseForm}
                formType="direct deposit"
              />
              <div className="button-container">
                <LoadingButton
                  aria-label="save your bank information for GI Bill® benefits"
                  type="submit"
                  loadingText="saving bank information"
                  className="usa-button-primary vads-u-margin-top--0 ach-submit-btn-auto-width"
                >
                  Save
                </LoadingButton>
                <va-button
                  text="Cancel"
                  secondary
                  label="cancel updating your bank information for GI Bill® benefits"
                  onClick={onCancelButtonClick}
                  data-qa="cancel-button"
                  data-testid={`${prefix}form-cancel-button`}
                />
              </div>
            </ChangeOfDirectDepositForm>
          </div>
        )}
      </div>
    </div>
  );
};
ChangeOfDirectDepositWrapper.propTypes = {
  applicantName: PropTypes.string,
};
export default ChangeOfDirectDepositWrapper;
