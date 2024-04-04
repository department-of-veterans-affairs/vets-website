import React, { useRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import UpdateSuccessAlert from '@@vap-svc/components/ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';

import { useDispatch } from 'react-redux';
import { toggleDirectDepositEdit } from '../../actions/directDeposit';
import recordEvent from '~/platform/monitoring/record-event';
import { DIRECT_DEPOSIT_ALERT_SETTINGS } from '../../constants';

const AccountWithInfo = ({
  paymentAccount,
  showUpdateSuccess,
  editButtonRef,
  toggleEdit,
}) => {
  return (
    <div>
      <dl className="vads-u-margin-y--0 vads-u-line-height--6">
        <dt className="sr-only">Bank name:</dt>
        <dd>{paymentAccount?.name}</dd>
        <dt className="sr-only">Bank account number:</dt>
        <dd>{paymentAccount?.accountNumber}</dd>
        <dt className="sr-only">Bank account type:</dt>
        <dd>{`${paymentAccount?.accountType} account`}</dd>
      </dl>

      <div role="alert" aria-atomic="true">
        <TransitionGroup>
          {!!showUpdateSuccess && (
            <CSSTransition
              classNames="form-expanding-group-inner"
              appear
              timeout={{
                appear: DIRECT_DEPOSIT_ALERT_SETTINGS.FADE_SPEED,
                enter: DIRECT_DEPOSIT_ALERT_SETTINGS.FADE_SPEED,
                exit: DIRECT_DEPOSIT_ALERT_SETTINGS.FADE_SPEED,
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
        className="vads-u-margin--0 vads-u-margin-top--1p5"
        aria-label="Edit your direct deposit bank information"
        ref={editButtonRef}
        onClick={() => {
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'edit-link',
            'profile-section': `direct-deposit-information`,
          });
          toggleEdit();
        }}
      >
        Edit
      </button>
    </div>
  );
};

const NoAccountInfo = ({ editButtonRef, toggleEdit }) => {
  return (
    <div>
      <p className="vads-u-margin--0">
        Edit your profile to add your bank information.
      </p>
      <button
        className="vads-u-margin--0 vads-u-margin-top--1p5"
        type="button"
        data-testid="edit-bank-info-button"
        aria-label="Edit your direct deposit bank information"
        ref={editButtonRef}
        onClick={() => {
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'add-link',
            'profile-section': 'direct-deposit-information',
          });
          toggleEdit();
        }}
      >
        Edit
      </button>
    </div>
  );
};

export const AccountInfoView = ({ paymentAccount, showUpdateSuccess }) => {
  const editButtonRef = useRef();
  const dispatch = useDispatch();
  const toggleEdit = () => dispatch(toggleDirectDepositEdit());
  return paymentAccount?.accountNumber ? (
    <AccountWithInfo
      paymentAccount={paymentAccount}
      showUpdateSuccess={showUpdateSuccess}
      editButtonRef={editButtonRef}
      toggleEdit={toggleEdit}
    />
  ) : (
    <NoAccountInfo editButtonRef={editButtonRef} toggleEdit={toggleEdit} />
  );
};
