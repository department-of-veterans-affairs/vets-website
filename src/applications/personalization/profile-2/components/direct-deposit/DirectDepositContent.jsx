import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { isLOA3, isMultifactorEnabled } from 'platform/user/selectors';
import { usePrevious } from 'platform/utilities/react-hooks';

import {
  editModalToggled,
  savePaymentInformation as savePaymentInformationAction,
} from 'applications/personalization/profile360/actions/paymentInformation';
import {
  directDepositAccountInformation,
  directDepositInformation,
  directDepositIsSetUp,
  directDepositUiState as directDepositUiStateSelector,
} from 'applications/personalization/profile360/selectors';

import BankInfoForm from 'applications/personalization/profile360/components/BankInfoForm';
import PaymentInformationEditError from 'applications/personalization/profile360/components/PaymentInformationEditModalError';

import ProfileInfoTable from '../ProfileInfoTable';
import FraudVictimAlert from './FraudVictimAlert';
import AdditionalInformation from './DirectDepositInformation';

import prefixUtilityClasses from 'platform/utilities/prefix-utility-classes';

export const DirectDepositContent = ({
  isAuthorized,
  isDirectDepositSetUp,
  directDepositAccountInfo,
  directDepositUiState,
  saveBankInformation,
  toggleEditState,
}) => {
  const editBankInfoButton = useRef();
  const [formData, setFormData] = useState({});
  const [showSaveSucceededAlert, setShowSaveSucceededAlert] = useState(false);
  const wasEditingBankInfo = usePrevious(directDepositUiState.isEditing);
  const wasSavingBankInfo = usePrevious(directDepositUiState.isSaving);

  const isEditingBankInfo = directDepositUiState.isEditing;
  const isSavingBankInfo = directDepositUiState.isSaving;
  const saveError = directDepositUiState.responseError;

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

  // show the user a success alert after their bank info has saved
  useEffect(
    () => {
      if (wasSavingBankInfo && !isSavingBankInfo && !saveError) {
        setShowSaveSucceededAlert(true);
        setTimeout(() => {
          setShowSaveSucceededAlert(false);
        }, 6000);
      }
    },
    [wasSavingBankInfo, isSavingBankInfo, saveError],
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

  // When direct deposit is already set up we will show the current bank info
  const bankInfoContent = (
    <div className={classes.bankInfo}>
      <dl className="vads-u-margin-y--0 vads-u-line-height--6">
        <dt className="sr-only">Bank name:</dt>
        <dd>{directDepositAccountInfo.financialInstitutionName}</dd>
        <dt className="sr-only">Bank account number:</dt>
        <dd>{directDepositAccountInfo.accountNumber}</dd>
        <dt className="sr-only">Bank account type:</dt>
        <dd>{`${directDepositAccountInfo.accountType} account`}</dd>
      </dl>
      <button
        className={classes.editButton}
        aria-label={'Edit your direct deposit bank information'}
        ref={editBankInfoButton}
        onClick={() => {
          toggleEditState();
        }}
      >
        Edit
      </button>
    </div>
  );

  // When direct deposit is not set up, we will show
  const notSetUpContent = (
    <>
      <button
        onClick={() => {
          toggleEditState();
        }}
      >
        Set up direct deposit
      </button>
    </>
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
        Please provide your bank’s current routing number as well as your
        current account number and type.
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
        onClose={toggleEditState}
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

  const getTableData = () => [
    // top row of the table can show multiple states so we set its value with
    // the getBankInfo() helper
    {
      title: 'Account',
      value: getBankInfo(),
    },
    {
      title: 'Payment history',
      value: (
        <EbenefitsLink path="ebenefits/about/feature?feature=payment-history">
          View your payment history
        </EbenefitsLink>
      ),
    },
  ];

  // Render nothing if the user should not see the Direct Deposit feature.
  // This entire component should never be rendered in that case; this just
  // serves as another layer of protection.
  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <div id="success" role="alert" aria-atomic="true">
        <ReactCSSTransitionGroup
          transitionName="form-expanding-group-inner"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {showSaveSucceededAlert && (
            <AlertBox
              status="success"
              backgroundOnly
              className="vads-u-margin-top--0 vads-u-margin-bottom--2"
            >
              We’ve saved your direct deposit information.
            </AlertBox>
          )}
        </ReactCSSTransitionGroup>
      </div>
      <ProfileInfoTable
        title="Bank information"
        data={getTableData()}
        fieldName="directDeposit"
      />
      <FraudVictimAlert />
      <AdditionalInformation />
    </>
  );
};

DirectDepositContent.propTypes = {
  directDepositAccount: PropTypes.object,
  directDepositAccountInfo: PropTypes.object.isRequired,
  isDirectDepositSetUp: PropTypes.bool.isRequired,
  directDepositUiState: PropTypes.object.isRequired,
};

export const mapStateToProps = state => ({
  isAuthorized: isLOA3(state) && isMultifactorEnabled(state),
  directDepositAccountInfo: directDepositAccountInformation(state),
  directDepositInfo: directDepositInformation(state),
  isDirectDepositSetUp: directDepositIsSetUp(state),
  directDepositUiState: directDepositUiStateSelector(state),
});

const mapDispatchToProps = {
  saveBankInformation: savePaymentInformationAction,
  toggleEditState: editModalToggled,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DirectDepositContent);
