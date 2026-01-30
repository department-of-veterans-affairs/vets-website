import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import ContactInformationUpdateSuccessAlert from '@@vap-svc/components/ContactInformationFieldInfo/ContactInformationUpdateSuccessAlert';

import { useDispatch } from 'react-redux';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';
import {
  useFeatureToggle,
  useToggleValue,
} from '~/platform/utilities/feature-toggles';
import { toggleDirectDepositEdit } from '../../actions/directDeposit';
import { DIRECT_DEPOSIT_ALERT_SETTINGS } from '../../constants';
import {
  VETERAN,
  DEPENDENT,
  NEITHER_VETERAN_NOR_DEPENDENT,
  COULD_NOT_DETERMINE_DUE_TO_EXCEPTION,
} from './config/enums';

const NonVeteranUpdateAlert = () => (
  <VaAlert status="warning" visible className="vads-u-margin-bottom--2">
    <h3 slot="headline">
      You can’t update direct deposit information online right now
    </h3>
    <p>
      We’re sorry. Direct deposit updates aren’t working for Veteran spouses and
      dependents right now. We’re working on this issue, but we don’t know when
      we’ll have it fixed.
    </p>
    <p>
      <strong>What you can do now:</strong>
    </p>
    <p>
      Call us at <va-telephone contact="8008271000" /> (TTY: 711) to update your
      direct deposit information by phone. We’re here Monday through Friday,
      8:00 a.m. to 9:00 p.m. ET.
    </p>
    <p className="vads-u-margin-y--0">
      Or you can contact a regional office near you to come in for help person.
      <br />
      <a
        href="https://www.va.gov/find-locations/?page=&facilityType=benefits&serviceType"
        target="blank"
      >
        Find a VA regional office near you (opens in a new tab)
      </a>
    </p>
  </VaAlert>
);

const NonVeteranExceptionUpdateAlert = () => (
  <VaAlert status="error">
    <h2 slot="headline">We couldn’t update your bank information</h2>
    <p className="vads-u-margin-y--0">
      We’re sorry. We couldn’t update your payment information. Please try
      later.
    </p>
  </VaAlert>
);

const AccountWithInfo = forwardRef(
  (
    {
      paymentAccount,
      veteranStatus,
      nonVeteranFeatureFlag,
      showUpdateSuccess,
      toggleEdit,
      recordEventImpl,
    },
    ref,
  ) => {
    return (
      <div>
        <dl className="vads-u-margin-y--0 vads-u-line-height--6 dd-privacy-mask">
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
        {/* If the feature flag limiting to just the Veteran is disabled OR it is the Veteran themselves, allow editing. */}
        {(!nonVeteranFeatureFlag || veteranStatus === VETERAN) && (
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
        )}
      </div>
    );
  },
);

AccountWithInfo.propTypes = {
  nonVeteranFeatureFlag: PropTypes.bool.isRequired,
  paymentAccount: PropTypes.shape({
    name: PropTypes.string,
    accountNumber: PropTypes.string,
    accountType: PropTypes.string,
  }).isRequired,
  showUpdateSuccess: PropTypes.bool.isRequired,
  toggleEdit: PropTypes.func.isRequired,
  veteranStatus: PropTypes.string.isRequired,
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
  (
    { paymentAccount, veteranStatus, showUpdateSuccess, recordEventImpl },
    ref,
  ) => {
    const dispatch = useDispatch();
    const toggleEdit = () => dispatch(toggleDirectDepositEdit());
    const { TOGGLE_NAMES } = useFeatureToggle();
    const nonVeteranFeatureFlag = useToggleValue(
      TOGGLE_NAMES.profileLimitDirectDepositForNonBeneficiaries,
    );
    return (
      <>
        {nonVeteranFeatureFlag &&
          (veteranStatus === DEPENDENT ||
            veteranStatus === NEITHER_VETERAN_NOR_DEPENDENT) && (
            <NonVeteranUpdateAlert />
          )}
        {nonVeteranFeatureFlag &&
          veteranStatus === COULD_NOT_DETERMINE_DUE_TO_EXCEPTION && (
            <NonVeteranExceptionUpdateAlert />
          )}
        {paymentAccount?.accountNumber ? (
          <AccountWithInfo
            paymentAccount={paymentAccount}
            veteranStatus={veteranStatus}
            nonVeteranFeatureFlag={nonVeteranFeatureFlag}
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
        )}
      </>
    );
  },
);

AccountInfoView.propTypes = {
  showUpdateSuccess: PropTypes.bool.isRequired,
  veteranStatus: PropTypes.string.isRequired,
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
