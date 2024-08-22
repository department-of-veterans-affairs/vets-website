import React from 'react';
import PropTypes from 'prop-types';
import { endDate } from '../../utils/helpers';

const WarningIcon = () => (
  <va-icon
    icon="warning"
    size={3}
    class="icon-color--warning vads-u-padding-right--1"
    srtext="Important"
  />
);
const InfoIcon = () => (
  <va-icon
    icon="info"
    size={3}
    class="icon-color--info vads-u-padding-right--1"
    srtext="Informational"
  />
);

const DebtSummaryMessage = ({ IconComponent, children }) => (
  <div className="vads-u-display--flex vads-u-margin-bottom--1p5">
    <IconComponent />
    <p className="vads-u-margin-y--0">{children}</p>
  </div>
);

DebtSummaryMessage.propTypes = {
  IconComponent: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
};

export const debtSummaryText = (diaryCode, dateOfLetter, balance) => {
  const endDateText = endDate(dateOfLetter, diaryCode);

  switch (diaryCode) {
    case '71':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Contact us to verify your military status.
        </DebtSummaryMessage>
      );
    case '655':
    case '817':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Submit a Financial Status Report so that we can make a decision on
          your request.
        </DebtSummaryMessage>
      );
    case '212':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Contact us to update your address.
        </DebtSummaryMessage>
      );
    case '061':
    case '065':
    case '070':
    case '440':
    case '442':
    case '448':
    case '453':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          We’ve paused collection on this debt as you requested.
        </DebtSummaryMessage>
      );
    case '439': // TODO: Date logic TBD
    case '449':
    case '459': // This one is 30 days
    case '100': // TODO: Date Not Listed
    case '102':
    case '130':
    case '140':
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          Pay your balance now or request help by <strong>{endDateText}</strong>
          .
        </DebtSummaryMessage>
      );
    case '109':
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          Pay your {balance} balance now or request help by {endDateText}
          to avoid more interest charges.
        </DebtSummaryMessage>
      );
    case '117':
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          Pay your {balance} past due balance in full or request help before{' '}
          {endDateText}.
        </DebtSummaryMessage>
      );
    case '123':
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          Pay your {balance} past due balance now or request help by{' '}
          {endDateText}.
        </DebtSummaryMessage>
      );
    case '680':
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          Pay your {balance} balance now or request help.{' '}
        </DebtSummaryMessage>
      );
    case '681':
    case '682':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          The U.S. Department of the Treasury is reducing your federal payments
          until your debt is paid.
        </DebtSummaryMessage>
      );
    // case '18': Passthrough status for a CRA referral being made
    case '600':
    case '601':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Continue making monthly payments until your balance is paid.
        </DebtSummaryMessage>
      );
    case '430':
    case '431':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          We’re reducing your education benefits each month until your debt is
          paid.
        </DebtSummaryMessage>
      );
    case '101':
    case '450':
    case '602':
    case '607':
    case '608':
    case '610':
    case '611':
    case '614':
    case '615':
    case '617':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          We’re reducing your benefit payments each month until your debt is
          paid.
        </DebtSummaryMessage>
      );
    case '603': // TODO: Date Not Listed
    case '613':
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          Make a payment on your {balance} balance or request help by{' '}
          {endDateText}.
        </DebtSummaryMessage>
      );
    // case '122': TODO: Passthrough status for a CRA referral being made
    case '080':
    case '850':
    case '852':
    case '860':
    case '855':
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          Contact the U.S. Department of the Treasury’s Debt Management Services
          at <va-telephone contact="8008270648" />, 8:30 a.m. to 6:30 p.m. ET.
          to pay this debt.
        </DebtSummaryMessage>
      );
    case '081': // TODO: No Definition in mockup
    case '500':
    case '510':
    case '503':
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          We’re referring this debt to the U.S. Department of the Treasury
          today.
        </DebtSummaryMessage>
      );
    case '811':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Continue making monthly payments while we review your compromise
          offer.
        </DebtSummaryMessage>
      );
    case '815': // TODO: Date Not Listed
      return (
        <DebtSummaryMessage IconComponent={WarningIcon}>
          Pay your one time payment as part of your compromise agreement by{' '}
          {endDateText}.
        </DebtSummaryMessage>
      );
    case '816':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          We’re processing your compromise offer payment.
        </DebtSummaryMessage>
      );
    case '801':
    case '802':
    case '803':
    case '804':
    case '809':
    case '820':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Continue making monthly payments while we review your waiver request.
        </DebtSummaryMessage>
      );
    // case '818', '819', '830', '842' Omitted
    case '822':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Continue making monthly payments while we review your dispute.
        </DebtSummaryMessage>
      );
    case '825':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Continue making monthly payments while we review your request for a
          hearing.
        </DebtSummaryMessage>
      );
    case '821':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          Continue making monthly payments while we review your Notice of
          Disagreement.
        </DebtSummaryMessage>
      );
    case '481':
    case '482':
    case '483':
    case '484':
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          We’re reviewing your account.
        </DebtSummaryMessage>
      );
    case '002':
    case '005':
    case '032':
    case '609':
    case '321':
    case '400':
    case '420':
    case '421':
    case '422':
    case '627':
    case '425': // ok - defined in spreadsheet
    default:
      return (
        <DebtSummaryMessage IconComponent={InfoIcon}>
          We’re updating your account.
        </DebtSummaryMessage>
      );
  }
};
