import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { connect } from 'react-redux';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import recordEvent from '~/platform/monitoring/record-event';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { mfa } from '~/platform/user/authentication/utilities';

import {
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled,
} from '~/platform/user/selectors';
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

import BankInfoForm from './BankInfoForm';

import PaymentInformationEditError from './PaymentInformationEditModalError';
import ProfileInfoTable from '../ProfileInfoTable';

import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';

export const DirectDepositCNP = ({
  isLOA3,
  isDirectDepositSetUp,
  is2faEnabled,
  directDepositAccountInfo,
  directDepositUiState,
  saveBankInformation,
  toggleEditState,
}) => {
  const editBankInfoButton = useRef();
  const [formData, setFormData] = useState({});
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const wasEditingBankInfo = usePrevious(directDepositUiState.isEditing);

  const isEditingBankInfo = directDepositUiState.isEditing;
  const saveError = directDepositUiState.responseError;

  const { accountNumber, accountType, routingNumber } = formData;
  const isEmptyForm = !accountNumber && !accountType && !routingNumber;

  const showSetup2FactorAuthentication = isLOA3 && !is2faEnabled;

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

  const saveBankInfo = () => {
    // NOTE: You can trigger a save error by sending undefined values in the payload
    const payload = {
      financialInstitutionName: 'Hidden form field',
      financialInstitutionRoutingNumber: formData.routingNumber,
      accountNumber: formData.accountNumber,
      accountType: formData.accountType,
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
        aria-label={'Edit your direct deposit bank information'}
        ref={editBankInfoButton}
        onClick={() => {
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'edit-link',
            'profile-section': 'direct-deposit-information',
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
          'profile-section': 'direct-deposit-information',
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
            responseError={saveError}
            className="vads-u-margin-top--0 vads-u-margin-bottom--2"
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
        formSubmit={saveBankInfo}
        isSaving={directDepositUiState.isSaving}
        onClose={closeDDForm}
        cancelButtonClasses={['va-button-link', 'vads-u-margin-left--1']}
      />
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

  const directDepositData = [
    // the table can show multiple states so we set its value with the
    // getBankInfo() helper
    {
      title: 'Account',
      value: getBankInfo(),
    },
  ];

  const mfaHandler = isAuthenticatedWithSSO => {
    recordEvent({ event: 'multifactor-link-clicked' });
    mfa(isAuthenticatedWithSSO ? 'v1' : 'v0');
  };

  // Render nothing if the user is not LOA3.
  // This entire component should never be rendered in that case; this just
  // serves as another layer of protection.
  if (!isLOA3) {
    return null;
  }

  if (showSetup2FactorAuthentication) {
    return (
      <AlertBox
        className="vads-u-margin-bottom--2"
        headline="You’ll need to set up 2-factor authentication before you can edit your direct deposit information."
        content={
          <>
            <p>
              We require this to help protect your bank account information and
              prevent fraud.
            </p>
            <p>
              Authentication gives you an extra layer of security by letting you
              into your account only after you've signed in with a password and
              a 6-digit code sent directly to your mobile or home phone. This
              helps to make sure that no one but you can access your account -
              even if they get your password.
            </p>
            <button
              type="button"
              className="usa-button-primary va-button-primary"
              onClick={() => mfaHandler(isAuthenticatedWithSSOe)}
            >
              Set up 2-factor authentication
            </button>
          </>
        }
        status="continue"
        isVisible
      />
    );
  } else {
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
        <ProfileInfoTable
          className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
          title="Disability compensation and pension benefits"
          data={directDepositData}
        />
      </>
    );
  }
};

DirectDepositCNP.propTypes = {
  isLOA3: PropTypes.bool.isRequired,
  is2faEnabled: PropTypes.bool.isRequired,
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
  is2faEnabled: isMultifactorEnabled(state),
  isAuthenticatedWithSSOe: isAuthenticatedWithSSOe(state),
});

const mapDispatchToProps = {
  saveBankInformation: savePaymentInformationAction,
  toggleEditState: editCNPPaymentInformationToggled,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DirectDepositCNP);
