import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import ContactInformationUpdateSuccessAlert from '@@vap-svc/components/ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';

import { useDispatch } from 'react-redux';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';
import { toggleDirectDepositEdit } from '../../actions/directDeposit';
import { DIRECT_DEPOSIT_ALERT_SETTINGS } from '../../constants';

const AccountWithInfo = forwardRef(
  ({ paymentAccount, showUpdateSuccess, toggleEdit, recordEventImpl }, ref) => {
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
                  <ContactInformationUpdateSuccessAlert fieldName="direct-deposit" />
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
        <VaButton
          id="edit-bank-info-button"
          data-testid="edit-bank-info-button"
          data-field-name="direct-deposit"
          text="Edit"
          className="vads-u-margin--0 vads-u-margin-top--1p5 vads-u-width--full"
          aria-label="Edit your direct deposit bank information"
          ref={ref}
          onClick={() => {
            recordEventImpl({
              event: 'profile-navigation',
              'profile-action': 'edit-link',
              'profile-section': `direct-deposit-information`,
            });
            toggleEdit();
          }}
        />
      </div>
    );
  },
);

AccountWithInfo.propTypes = {
  paymentAccount: PropTypes.shape({
    name: PropTypes.string,
    accountNumber: PropTypes.string,
    accountType: PropTypes.string,
  }).isRequired,
  showUpdateSuccess: PropTypes.bool.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  recordEventImpl: PropTypes.func,
};

AccountWithInfo.defaultProps = {
  recordEventImpl: recordEvent,
};

const NoAccountInfo = forwardRef(({ toggleEdit, recordEventImpl }, ref) => {
  return (
    <div>
      <p className="vads-u-margin--0">
        Edit your profile to add your bank information.
      </p>
      <VaButton
        className="vads-u-margin--0 vads-u-margin-top--1p5 vads-u-width--full"
        text="Edit"
        data-testid="edit-bank-info-button"
        aria-label="Edit your direct deposit bank information"
        ref={ref}
        onClick={() => {
          recordEventImpl({
            event: 'profile-navigation',
            'profile-action': 'add-link',
            'profile-section': 'direct-deposit-information',
          });
          toggleEdit();
        }}
      />
    </div>
  );
});

NoAccountInfo.propTypes = {
  toggleEdit: PropTypes.func.isRequired,
  recordEventImpl: PropTypes.func,
};

NoAccountInfo.defaultProps = {
  recordEventImpl: recordEvent,
};

export const AccountInfoView = forwardRef(
  ({ paymentAccount, showUpdateSuccess, recordEventImpl }, ref) => {
    const dispatch = useDispatch();
    const toggleEdit = () => dispatch(toggleDirectDepositEdit());
    return paymentAccount?.accountNumber ? (
      <AccountWithInfo
        paymentAccount={paymentAccount}
        showUpdateSuccess={showUpdateSuccess}
        ref={ref}
        toggleEdit={toggleEdit}
        recordEventImpl={recordEventImpl}
      />
    ) : (
      <NoAccountInfo
        ref={ref}
        toggleEdit={toggleEdit}
        recordEventImpl={recordEventImpl}
      />
    );
  },
);

AccountInfoView.propTypes = {
  showUpdateSuccess: PropTypes.bool.isRequired,
  paymentAccount: PropTypes.shape({
    name: PropTypes.string,
    accountNumber: PropTypes.string,
    accountType: PropTypes.string,
  }),
  recordEventImpl: PropTypes.func,
};

AccountInfoView.defaultProps = {
  recordEventImpl: recordEvent,
};
