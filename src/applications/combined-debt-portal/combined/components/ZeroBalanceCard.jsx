import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { APP_TYPES } from '../utils/helpers';

const ZeroBalanceCard = ({ appType }) => {
  const cardTitle =
    appType === APP_TYPES.DEBT
      ? `You don't have any current VA debt`
      : `You haven't received a copay bill in the past 6 months`;

  const cardContent =
    appType === APP_TYPES.DEBT ? (
      <p className="vads-u-margin-y--0">
        If you think this is incorrect, call the Debt Management Center (DMC) at{' '}
        <va-telephone contact={CONTACTS.DMC} /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
    ) : (
      <p className="vads-u-margin-y--0">
        If you think this is incorrect, contact the VA Health Resource Center at{' '}
        <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
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
