import React from 'react';
import PropTypes from 'prop-types';
import { APP_TYPES } from '../utils/helpers';

const ZeroBalanceCard = ({ appType }) => {
  const cardTitle =
    appType === APP_TYPES.DEBT
      ? `You don't have any current VA debt`
      : `You haven't received a copay bill in the past 6 months`;

  const cardContent =
    appType === APP_TYPES.DEBT ? (
      <p clasName="vads-u-margin-y--0">
        If you think this is incorrect, call the Debt Management Center (DMC) at{' '}
        <va-telephone contact="8008270648" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
    ) : (
      <p clasName="vads-u-margin-y--0">
        If you think this is incorrect, contact the VA Health Resource Center at{' '}
        <va-telephone contact="8664001238" /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    );

  return (
    <va-card
      show-shadow
      class="vads-u-padding--3 vads-u-margin-bottom--3"
      data-testid={`balance-card-zero-${
        appType === APP_TYPES.DEBT ? 'debt' : 'copay'
      }`}
    >
      <h3
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5"
        data-testid="card-title"
      >
        {cardTitle}
      </h3>
      {cardContent}
    </va-card>
  );
};

ZeroBalanceCard.propTypes = {
  appType: PropTypes.string,
};

export default ZeroBalanceCard;
