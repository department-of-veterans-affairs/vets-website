import React from 'react';
import PropTypes from 'prop-types';
import { APP_TYPES, dmcPhoneContent } from '../utils/helpers';
import { phoneContent } from '../utils/copayAlertContent';

const ZeroBalanceCard = ({ appType }) => {
  const cardTitle =
    appType === APP_TYPES.DEBT
      ? `You don't have any outstanding overpayments`
      : `You don't have any copay bills`;

  const cardContent =
    appType === APP_TYPES.DEBT ? (
      <p className="vads-u-margin-y--0">
        If you think this is incorrect, call the Debt Management Center at{' '}
        {dmcPhoneContent()}
      </p>
    ) : (
      <>
        <p>
          You can’t check copay balances at this time because our records show
          that you haven’t received a copay bill in the past 6 months.
        </p>
        <p>
          If you think this is incorrect, contact the VA Health Resource Center.
          We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
        </p>
        {phoneContent()}
      </>
    );

  return (
    <va-card
      show-shadow
      class="vads-u-padding--3 vads-u-margin-bottom--3"
      data-testid={`balance-card-zero-${
        appType === APP_TYPES.DEBT ? 'debt' : 'copay'
      }`}
    >
      <h2
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h3"
        data-testid="card-title"
      >
        {cardTitle}
      </h2>
      {cardContent}
    </va-card>
  );
};

ZeroBalanceCard.propTypes = {
  appType: PropTypes.string,
};

export default ZeroBalanceCard;
