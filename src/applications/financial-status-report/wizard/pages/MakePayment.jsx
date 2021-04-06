import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { PAGE_NAMES } from '../constants';

const MakePayment = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert': 'make a payment on a debt',
    });
  }, []);

  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, this isn’t the form you need.
      </p>
      <p className="vads-u-margin-bottom--0">
        <strong>
          You can make payments on VA disability compensation, pension, or
          education debts online, by phone, or by mail.
        </strong>
      </p>
      <p className="vads-u-margin-top--1">
        <a
          href="/manage-va-debt"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-alert-link-click',
              'howToWizard-alert-link-click-label':
                'Find out how to manage your debt',
            });
          }}
        >
          Find out how to manage your debt
        </a>
      </p>
      <p>
        Be sure to make a payment or request help within{' '}
        <strong>30 days</strong> of when you receive your first debt letter from
        us. This will help you avoid late fees, interest, or other collection
        action.
      </p>
    </div>
  );
};

export default {
  name: PAGE_NAMES.payment,
  component: MakePayment,
};
