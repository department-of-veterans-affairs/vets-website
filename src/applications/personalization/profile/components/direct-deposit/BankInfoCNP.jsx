import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { connect } from 'react-redux';

import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import recordEvent from '~/platform/monitoring/record-event';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

import { isLOA3 as isLOA3Selector } from '~/platform/user/selectors';
import { usePrevious } from '~/platform/utilities/react-hooks';

import {
  editCNPPaymentInformationToggled,
  saveCNPPaymentInformation as savePaymentInformationAction,
} from '@@profile/actions/paymentInformation';
import {
  cnpDirectDepositAccountInformation,
  cnpDirectDepositInformation,
  cnpDirectDepositIsSetUp,
  cnpDirectDepositUiState as directDepositUiStateSelector,
} from '@@profile/selectors';

import BankInfoForm, { makeFormProperties } from './BankInfoForm';

import PaymentInformationEditError from './PaymentInformationEditError';
import ProfileInfoTable from '../ProfileInfoTable';

import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';

export const BankInfoCNP = ({
  isLOA3,
  isDirectDepositSetUp,
  directDepositAccountInfo,
  directDepositUiState,
  saveBankInformation,
  toggleEditState,
}) => {
  const formPrefix = 'CNP';
  const editBankInfoButton = useRef();
  const [formData, setFormData] = useState({});
  const [showSaveSucceededAlert, setShowSaveSucceededAlert] = useState(false);
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const wasEditingBankInfo = usePrevious(directDepositUiState.isEditing);
  const wasSavingBankInfo = usePrevious(directDepositUiState.isSaving);

  const isEditingBankInfo = directDepositUiState.isEditing;
  const isSavingBankInfo = directDepositUiState.isSaving;
  const saveError = directDepositUiState.responseError;

  const bankInfoUpdatedAlertSettings = {
    FADE_SPEED: window.Cypress ? 1 : 500,
    TIMEOUT: window.Cypress ? 500 : 6000,
  };

  const { accountNumber, accountType, routingNumber } = makeFormProperties(
    formPrefix,
  );

  const {
    [accountNumber]: formAccountNumber,
    [accountType]: formAccountType,
    [routingNumber]: formRoutingNumber,
  } = formData;
  const isEmptyForm =
    !formAccountNumber && !formAccountType && !formRoutingNumber;

  const removeBankInfoUpdatedAlert = React.useCallback(
    () => {
      setTimeout(() => {
        setShowSaveSucceededAlert(false);
      }, bankInfoUpdatedAlertSettings.TIMEOUT);
    },
    [bankInfoUpdatedAlertSettings],
  );
  // when we enter and exit edit mode...
  useEffect(
    () => {
      if (wasEditingBankInfo && !isEditingBankInfo) {
        // clear the form data when exiting edit mode so it's blank when the
        // edit form is shown again
        setFormData({});
        // focus the edit button when we exit edit mode
        editBankInfoButton.current.focus();
      }
    },
    [isEditingBankInfo, wasEditingBankInfo],
  );

  useEffect(
    () => {
      // Show alert when navigating away
      if (!isEmptyForm) {
        window.onbeforeunload = () => true;
        return;
      }

      window.onbeforeunload = undefined;
    },
    [isEmptyForm],
  );

  // show the user a success alert after their bank info has saved
  useEffect(
    () => {
      if (wasSavingBankInfo && !isSavingBankInfo && !saveError) {
        setShowSaveSucceededAlert(true);
        removeBankInfoUpdatedAlert();
      }
    },
    [
      wasSavingBankInfo,
      isSavingBankInfo,
      saveError,
      removeBankInfoUpdatedAlert,
    ],
  );

  const saveBankInfo = () => {
    // NOTE: You can trigger a save error by sending undefined values in the payload
    const payload = {
      financialInstitutionName: 'Hidden form field',
      financialInstitutionRoutingNumber: formData[routingNumber],
      accountNumber: formData[accountNumber],
      accountType: formData[accountType],
    };
    saveBankInformation(payload, isDirectDepositSetUp);
  };

  const bankInfoClasses = prefixUtilityClasses(
    [
      'display--flex',
      'align-items--flex-start',
      'flex-direction--row',
      'justify-content--space-between',
    ],
    'medium',
  );

  const editButtonClasses = [
    'va-button-link',
    ...prefixUtilityClasses(['margin-top--1p5']),
  ];

  const editButtonClassesMedium = prefixUtilityClasses(
    ['flex--auto', 'margin-top--0'],
    'medium',
  );

  const classes = {
    bankInfo: [...bankInfoClasses].join(' '),
    editButton: [...editButtonClasses, ...editButtonClassesMedium].join(' '),
  };

  const closeDDForm = () => {
    if (!isEmptyForm) {
      setShowConfirmCancelModal(true);
      return;
    }

    toggleEditState();
  };

  // When direct deposit is already set up we will show the current bank info
  const bankInfoContent = (
    <div className={classes.bankInfo}>
      <dl className="vads-u-margin-y--0 vads-u-line-height--6">
        <dt className="sr-only">Bank name:</dt>
        <dd>{directDepositAccountInfo?.financialInstitutionName}</dd>
        <dt className="sr-only">Bank account number:</dt>
        <dd>{directDepositAccountInfo?.accountNumber}</dd>
        <dt className="sr-only">Bank account type:</dt>
        <dd>{`${directDepositAccountInfo?.accountType} account`}</dd>
      </dl>
      <button
        className={classes.editButton}
        aria-label={
          'Edit your direct deposit for disability compensation and pension benefits bank information'
        }
        ref={editBankInfoButton}
        onClick={() => {
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'edit-link',
            'profile-section': `cnp-direct-deposit-information`,
          });
          toggleEditState();
        }}
      >
        Edit
      </button>
    </div>
  );

  // When direct deposit is not set up, we will show
  const notSetUpContent = (
    <button
      className="va-button-link"
      ref={editBankInfoButton}
      onClick={() => {
        recordEvent({
          event: 'profile-navigation',
          'profile-action': 'add-link',
          'profile-section': `cnp-direct-deposit-information`,
        });
        toggleEditState();
      }}
    >
      Please add your bank information
    </button>
  );

  // When editing/setting up direct deposit, we'll show a form that accepts bank
  // account information
  const editingBankInfoContent = (
    <>
      <div id="errors" role="alert" aria-atomic="true">
        {!!saveError && (
          <PaymentInformationEditError
            className="vads-u-margin-top--0 vads-u-margin-bottom--2"
            level={4}
            responseError={saveError}
          />
        )}
      </div>
      <p className="vads-u-margin-top--0">
        Please enter your bank’s routing and account numbers and your account
        type.
      </p>
      <div className="vads-u-margin-bottom--2">
        <AdditionalInfo triggerText="Where can I find these numbers?">
          <img
            src="/img/direct-deposit-check-guide.png"
            alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
          />
        </AdditionalInfo>
      </div>
      <BankInfoForm
        formChange={data => setFormData(data)}
        formData={formData}
        formPrefix={formPrefix}
        formSubmit={saveBankInfo}
      >
        <LoadingButton
          aria-label="update your bank information for compensation and pension benefits"
          type="submit"
          loadingText="saving bank information"
          className="usa-button-primary vads-u-margin-top--0 vads-u-width--full small-screen:vads-u-width--auto"
          isLoading={directDepositUiState.isSaving}
        >
          Update
        </LoadingButton>
        <button
          aria-label="cancel updating your bank information for compensation and pension benefits"
          type="button"
          disabled={directDepositUiState.isSaving}
          className="va-button-link vads-u-margin-left--1"
          onClick={closeDDForm}
          data-qa="cancel-button"
        >
          Cancel
        </button>
      </BankInfoForm>
    </>
  );

  // Helper that determines which data to show in the top row of the table
  const getBankInfo = () => {
    if (directDepositUiState.isEditing) {
      return editingBankInfoContent;
    }
    if (isDirectDepositSetUp) {
      return bankInfoContent;
    }
    return notSetUpContent;
  };

  const directDepositData = () => {
    const data = [
      // top row of the table can show multiple states so we set its value with
      // the getBankInfo() helper
      {
        title: 'Account',
        value: getBankInfo(),
      },
    ];
    if (isDirectDepositSetUp) {
      data.push({
        title: 'Payment history',
        value: (
          <a
            href="/va-payment-history/payments/"
            onClick={() =>
              recordEvent({
                event: 'profile-navigation',
                'profile-action': 'view-link',
                'profile-section': 'view-payment-history',
              })
            }
          >
            View your payment history
          </a>
        ),
      });
    }
    return data;
  };

  // Render nothing if the user is not LOA3.
  // This entire component should never be rendered in that case; this just
  // serves as another layer of protection.
  if (!isLOA3) {
    return null;
  }

  return (
    <>
      <Modal
        title={'Are you sure?'}
        status="warning"
        visible={showConfirmCancelModal}
        onClose={() => {
          setShowConfirmCancelModal(false);
        }}
      >
        <p>
          {' '}
          {`You haven’t finished editing your direct deposit information. If you cancel, your in-progress work won’t be saved.`}
        </p>
        <button
          className="usa-button-secondary"
          onClick={() => {
            setShowConfirmCancelModal(false);
          }}
        >
          Continue Editing
        </button>
        <button
          onClick={() => {
            setShowConfirmCancelModal(false);
            toggleEditState();
          }}
        >
          Cancel
        </button>
      </Modal>
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={!isEmptyForm}
      />
      <div id="success" role="alert" aria-atomic="true">
        <ReactCSSTransitionGroup
          transitionName="form-expanding-group-inner"
          transitionAppear
          transitionAppearTimeout={bankInfoUpdatedAlertSettings.FADE_SPEED}
          transitionEnterTimeout={bankInfoUpdatedAlertSettings.FADE_SPEED}
          transitionLeaveTimeout={bankInfoUpdatedAlertSettings.FADE_SPEED}
        >
          {showSaveSucceededAlert && (
            <div data-testid="bankInfoUpdateSuccessAlert">
              <AlertBox
                status="success"
                backgroundOnly
                className="vads-u-margin-top--0 vads-u-margin-bottom--2"
                scrollOnShow
              >
                We’ve updated your bank account information for your{' '}
                <strong>compensation and pension benefits</strong>
              </AlertBox>
            </div>
          )}
        </ReactCSSTransitionGroup>
      </div>
      <ProfileInfoTable
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
        title="Disability compensation and pension benefits"
        data={directDepositData()}
      />
    </>
  );
};

BankInfoCNP.propTypes = {
  isLOA3: PropTypes.bool.isRequired,
  directDepositAccountInfo: PropTypes.shape({
    accountNumber: PropTypes.string.isRequired,
    accountType: PropTypes.string.isRequired,
    financialInstitutionName: PropTypes.string,
    financialInstitutionRoutingNumber: PropTypes.string.isRequired,
  }),
  isDirectDepositSetUp: PropTypes.bool.isRequired,
  directDepositUiState: PropTypes.shape({
    isEditing: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    responseError: PropTypes.string,
  }),
  saveBankInformation: PropTypes.func.isRequired,
  toggleEditState: PropTypes.func.isRequired,
};

export const mapStateToProps = state => ({
  isLOA3: isLOA3Selector(state),
  directDepositAccountInfo: cnpDirectDepositAccountInformation(state),
  directDepositInfo: cnpDirectDepositInformation(state),
  isDirectDepositSetUp: cnpDirectDepositIsSetUp(state),
  directDepositUiState: directDepositUiStateSelector(state),
});

const mapDispatchToProps = {
  saveBankInformation: savePaymentInformationAction,
  toggleEditState: editCNPPaymentInformationToggled,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BankInfoCNP);
