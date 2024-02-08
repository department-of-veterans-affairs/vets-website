import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  editCNPPaymentInformationToggled,
  saveCNPPaymentInformation as saveCNPPaymentInformationAction,
  editEDUPaymentInformationToggled,
  saveEDUPaymentInformation as saveEDUPaymentInformationAction,
} from '@@profile/actions/paymentInformation';
import {
  cnpDirectDepositAccountInformation,
  cnpDirectDepositIsEligible,
  cnpDirectDepositInformation,
  cnpDirectDepositIsSetUp,
  cnpDirectDepositLoadError,
  cnpDirectDepositUiState as cnpDirectDepositUiStateSelector,
  eduDirectDepositAccountInformation,
  eduDirectDepositInformation,
  eduDirectDepositIsSetUp,
  eduDirectDepositLoadError,
  eduDirectDepositUiState as eduDirectDepositUiStateSelector,
} from '@@profile/selectors';
import UpdateSuccessAlert from '@@vap-svc/components/ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';
import { kebabCase } from 'lodash';
import recordEvent from '~/platform/monitoring/record-event';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';

import { isLOA3 as isLOA3Selector } from '~/platform/user/selectors';
import { usePrevious } from '~/platform/utilities/react-hooks';

import DirectDepositConnectionError from '../alerts/DirectDepositConnectionError';

import BankInfoForm, { makeFormProperties } from './BankInfoForm';

import PaymentInformationEditError from './PaymentInformationEditError';

import prefixUtilityClasses from '~/platform/utilities/prefix-utility-classes';
import { benefitTypes } from '~/applications/personalization/common/constants';

import NotEligible from './alerts/NotEligible';
import { BANK_INFO_UPDATED_ALERT_SETTINGS } from '../../constants';
import { ProfileInfoCard } from '../ProfileInfoCard';

export const BankInfo = ({
  isLOA3,
  isDirectDepositSetUp,
  isEligibleToSetUpDirectDeposit,
  directDepositAccountInfo,
  directDepositServerError,
  directDepositUiState,
  saveBankInformation,
  toggleEditState,
  type,
  typeIsCNP,
  setFormIsDirty,
  setViewingPayments,
  showSuccessMessage,
}) => {
  const formPrefix = type;
  const editBankInfoButton = useRef();
  const editBankInfoForm = useRef();
  const [formData, setFormData] = useState({});
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const wasEditingBankInfo = usePrevious(directDepositUiState.isEditing);

  const isEditingBankInfo = directDepositUiState.isEditing;
  const saveError = directDepositUiState.responseError;

  const { accountNumber, accountType, routingNumber } = makeFormProperties(
    formPrefix,
  );

  const sectionTitle = typeIsCNP
    ? 'Disability compensation and pension benefits'
    : 'Education benefits';

  const sectionTitleId = kebabCase(sectionTitle);

  const focusOnMainHeading = headingId => {
    const mainHeading = document.querySelector(`#${headingId}`);
    if (mainHeading) {
      mainHeading.setAttribute('tabindex', '-1');
      mainHeading.focus();
    }
  };
  // Using computed properties that I got from the `makeFormProperties` call to
  // destructure the form data object. I learned that this was even possible
  // here: https://stackoverflow.com/a/37040344/585275
  const {
    [accountNumber]: formAccountNumber,
    [accountType]: formAccountType,
    [routingNumber]: formRoutingNumber,
  } = formData;
  const isEmptyForm =
    !formAccountNumber && !formAccountType && !formRoutingNumber;

  useEffect(
    () => {
      setFormIsDirty(isEmptyForm);
    },
    [isEmptyForm, setFormIsDirty],
  );

  useEffect(
    () => {
      return () => {
        if (isEditingBankInfo) {
          toggleEditState(false);
        }
      };
    },
    [isEditingBankInfo, toggleEditState],
  );

  // when we enter and exit edit mode...
  useEffect(
    () => {
      if (isEditingBankInfo && !wasEditingBankInfo) {
        focusOnMainHeading(sectionTitleId);
      }
      if (wasEditingBankInfo && !isEditingBankInfo) {
        // clear the form data when exiting edit mode so it's blank when the
        // edit form is shown again
        setFormData({});
        // focus the edit button when we exit edit mode
        editBankInfoButton.current.focus();
      }
    },
    [isEditingBankInfo, wasEditingBankInfo, sectionTitleId],
  );

  const saveBankInfo = () => {
    const fields = {
      financialInstitutionRoutingNumber: formData[routingNumber],
      accountNumber: formData[accountNumber],
      accountType: formData[accountType],
    };
    if (typeIsCNP) {
      // NOTE: You can trigger a save error by sending undefined values in the payload
      saveBankInformation({
        fields,
        isEnrollingInDirectDeposit: isDirectDepositSetUp,
      });
    } else {
      saveBankInformation({ fields });
    }
  };

  const editButtonClasses = [
    'usa-button-primary',
    ...prefixUtilityClasses(['margin--0', 'margin-top--1p5']),
  ];

  const classes = {
    editButton: editButtonClasses.join(' '),
  };

  const closeDDForm = () => {
    if (!isEmptyForm) {
      setShowConfirmCancelModal(true);
      return;
    }

    toggleEditState();
  };

  const benefitTypeShort = typeIsCNP ? 'disability' : 'education';
  const benefitTypeLong = typeIsCNP
    ? 'disability compensation and pension'
    : 'education';

  // When direct deposit is already set up we will show the current bank info
  const bankInfoContent = (
    <div>
      <dl className="vads-u-margin-y--0 vads-u-line-height--6">
        <dt className="sr-only">Bank name:</dt>
        <dd>{directDepositAccountInfo?.financialInstitutionName}</dd>
        <dt className="sr-only">Bank account number:</dt>
        <dd>{directDepositAccountInfo?.accountNumber}</dd>
        <dt className="sr-only">Bank account type:</dt>
        <dd>{`${directDepositAccountInfo?.accountType} account`}</dd>
      </dl>

      <div role="alert" aria-atomic="true">
        <TransitionGroup>
          {!!showSuccessMessage && (
            <CSSTransition
              classNames="form-expanding-group-inner"
              appear
              timeout={{
                appear: BANK_INFO_UPDATED_ALERT_SETTINGS.FADE_SPEED,
                enter: BANK_INFO_UPDATED_ALERT_SETTINGS.FADE_SPEED,
                exit: BANK_INFO_UPDATED_ALERT_SETTINGS.FADE_SPEED,
              }}
            >
              <div data-testid="bankInfoUpdateSuccessAlert">
                <UpdateSuccessAlert />
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
      <button
        type="button"
        className={classes.editButton}
        aria-label={`Edit your direct deposit for ${benefitTypeLong} bank information`}
        ref={editBankInfoButton}
        onClick={() => {
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'edit-link',
            'profile-section': `${type.toLowerCase()}-direct-deposit-information`,
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
    <div>
      <p className="vads-u-margin--0">
        Edit your profile to add your bank information.
      </p>
      <button
        className={classes.editButton}
        type="button"
        data-testid="edit-bank-info-button"
        aria-label="Edit your direct deposit for disability compensation and pension benefits bank information"
        ref={editBankInfoButton}
        onClick={() => {
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'add-link',
            'profile-section': 'cnp-direct-deposit-information',
          });
          toggleEditState();
        }}
      >
        Edit
      </button>
    </div>
  );

  // When editing/setting up direct deposit, we'll show a form that accepts bank
  // account information
  const editingBankInfoContent = (
    <>
      <div
        id={`${type.toLowerCase()}-bank-save-errors`}
        role="alert"
        aria-atomic="true"
      >
        {!!saveError && (
          <PaymentInformationEditError
            className="vads-u-margin-top--0 vads-u-margin-bottom--2"
            responseError={saveError}
          />
        )}
      </div>
      <p className="vads-u-margin-top--0">
        Please enter your bank’s routing and account numbers and your account
        type.
      </p>

      <div
        data-testid={`${formPrefix}-bank-info-form`}
        ref={editBankInfoForm}
        role="group"
        aria-label={`Edit bank account for ${sectionTitle.toLowerCase()}`}
      >
        <BankInfoForm
          formChange={data => setFormData(data)}
          formData={formData}
          formPrefix={formPrefix}
          formSubmit={saveBankInfo}
        >
          <div className="vads-u-margin-bottom--2 vads-u-margin-top--2p5">
            <va-additional-info trigger="Where can I find these numbers?" uswds>
              <img
                src="/img/direct-deposit-check-guide.svg"
                alt="A personal check"
              />

              <p className="vads-u-padding-top--2">
                The bank routing number is the first 9 digits on the bottom left
                corner of a printed check. Your account number is the second set
                of numbers on the bottom of a check, just to the right of the
                bank routing number.
              </p>
              <p className="vads-u-padding-y--2">
                If you don’t have a printed check, you can:
              </p>
              <ul>
                <li>
                  Sign in to your online bank account and check your account
                  details, or
                </li>
                <li>Check your bank statement, or</li>
                <li>Call your bank</li>
              </ul>
            </va-additional-info>
          </div>
          <LoadingButton
            aria-label={`save your bank information for ${benefitTypeLong} benefits`}
            type="submit"
            loadingText="saving bank information"
            className="usa-button-primary vads-u-margin-top--0 medium-screen:vads-u-width--auto"
            isLoading={directDepositUiState.isSaving}
          >
            Save
          </LoadingButton>
          <button
            aria-label={`cancel updating your bank information for ${benefitTypeLong} benefits`}
            type="button"
            disabled={directDepositUiState.isSaving}
            className="usa-button-secondary small-screen:vads-u-margin-top--0"
            onClick={closeDDForm}
            data-qa="cancel-button"
            data-testid={`${formPrefix}-form-cancel-button`}
          >
            Cancel
          </button>
        </BankInfoForm>
      </div>
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
    if (isEligibleToSetUpDirectDeposit) {
      return notSetUpContent;
    }
    setViewingPayments(old => ({ ...old, [type]: false }));

    return <NotEligible benefitType={benefitTypeShort} typeIsCNP={typeIsCNP} />;
  };

  const directDepositData = () => {
    const data = {
      // the table can show multiple states so we set its value with the
      // getBankInfo() helper
      value: getBankInfo(),
    };
    if (isEligibleToSetUpDirectDeposit || isDirectDepositSetUp) {
      data.title = 'Account';
    }
    return [data];
  };

  // Render nothing if the user is not LOA3.
  // This entire component should never be rendered in that case; this just
  // serves as another layer of protection.
  if (!isLOA3) {
    return null;
  }

  if (directDepositServerError) {
    return <DirectDepositConnectionError benefitType={type} />;
  }

  return (
    <>
      <VaModal
        modalTitle="Are you sure?"
        status="warning"
        visible={showConfirmCancelModal}
        onCloseEvent={() => {
          setShowConfirmCancelModal(false);
        }}
        primaryButtonText="Continue Editing"
        onPrimaryButtonClick={() => {
          setShowConfirmCancelModal(false);
        }}
        secondaryButtonText="Cancel"
        onSecondaryButtonClick={() => {
          setShowConfirmCancelModal(false);
          toggleEditState();
        }}
        uswds
      >
        <p>
          You haven’t finished editing and saving the changes to your direct
          deposit information. If you cancel now, we won’t save your changes.
        </p>
      </VaModal>

      <ProfileInfoCard
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
        title={sectionTitle}
        data={directDepositData()}
        namedAnchor={sectionTitleId}
        level={2}
      />
    </>
  );
};

BankInfo.propTypes = {
  directDepositServerError: PropTypes.bool.isRequired,
  isDirectDepositSetUp: PropTypes.bool.isRequired,
  isEligibleToSetUpDirectDeposit: PropTypes.bool.isRequired,
  isLOA3: PropTypes.bool.isRequired,
  saveBankInformation: PropTypes.func.isRequired,
  setFormIsDirty: PropTypes.func.isRequired,
  setViewingPayments: PropTypes.func.isRequired,
  toggleEditState: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  directDepositAccountInfo: PropTypes.shape({
    accountNumber: PropTypes.string,
    accountType: PropTypes.string,
    financialInstitutionName: PropTypes.string,
    financialInstitutionRoutingNumber: PropTypes.string,
  }),
  directDepositUiState: PropTypes.shape({
    isEditing: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    responseError: PropTypes.object,
  }),
  showSuccessMessage: PropTypes.bool,
  typeIsCNP: PropTypes.bool,
};

export const mapStateToProps = (state, ownProps) => {
  const typeIsCNP = ownProps.type === benefitTypes.CNP;

  return {
    typeIsCNP,
    isLOA3: isLOA3Selector(state),
    directDepositAccountInfo: typeIsCNP
      ? cnpDirectDepositAccountInformation(state)
      : eduDirectDepositAccountInformation(state),
    directDepositInfo: typeIsCNP
      ? cnpDirectDepositInformation(state)
      : eduDirectDepositInformation(state),
    isDirectDepositSetUp: typeIsCNP
      ? cnpDirectDepositIsSetUp(state)
      : eduDirectDepositIsSetUp(state),
    directDepositServerError: typeIsCNP
      ? !!cnpDirectDepositLoadError(state)
      : !!eduDirectDepositLoadError(state),
    isEligibleToSetUpDirectDeposit: typeIsCNP
      ? cnpDirectDepositIsEligible(state, true)
      : false,
    directDepositUiState: typeIsCNP
      ? cnpDirectDepositUiStateSelector(state)
      : eduDirectDepositUiStateSelector(state),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const typeIsCNP = ownProps.type === benefitTypes.CNP;

  return {
    ...bindActionCreators(
      {
        saveBankInformation: typeIsCNP
          ? saveCNPPaymentInformationAction
          : saveEDUPaymentInformationAction,
        toggleEditState: typeIsCNP
          ? editCNPPaymentInformationToggled
          : editEDUPaymentInformationToggled,
      },
      dispatch,
    ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BankInfo);
