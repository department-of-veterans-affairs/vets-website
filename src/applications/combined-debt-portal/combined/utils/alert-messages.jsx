import React from 'react';
import {
  ALERT_TYPES,
  APP_TYPES,
  dmcPhoneContent,
  healthResourceCenterPhoneContent,
} from './helpers';

const alertMessage = (alertType, appType) => {
  switch (alertType) {
    case ALERT_TYPES.ALL_ZERO:
      return {
        alertStatus: 'info',
        testID: 'all-zero-alert',
        header: `You don’t have any outstanding overpayments or copay bills`,
        body: (
          <>
            <p>
              Our records show you don’t have any outstanding overpayments
              related to VA benefits and you haven’t received a copay bill in
              the past 6 months.
            </p>
          </>
        ),
        secondHeader: `What to do if you think you have an overpayment or copay bill:`,
        secondBody: (
          <ul>
            <li>
              <strong>For benefit debts</strong>, call the Debt Management
              Center at {dmcPhoneContent()}
            </li>
            <li>
              <strong>For medical copay bills</strong>, call the VA Health
              Resource Center at {healthResourceCenterPhoneContent()}
            </li>
          </ul>
        ),
      };
    case ALERT_TYPES.ERROR:
      return {
        alertStatus: 'error',
        testID: `error-${appType === APP_TYPES.DEBT ? 'debt' : 'copay'}-alert`,
        appType,
        header: `We can’t access your ${
          appType === APP_TYPES.DEBT ? 'overpayment' : 'copay'
        } records right now`,
        body: (
          <p>We’re sorry. Something went wrong on our end. Check back soon.</p>
        ),
        secondBody: (
          <>
            {appType === APP_TYPES.DEBT ? (
              <p>
                If you need help now, contact us online through{' '}
                <a href="https://ask.va.gov">Ask VA</a> or call the Debt
                Management Center at {dmcPhoneContent()}
              </p>
            ) : (
              <p>
                If you need help now, call the VA Health Resource Center at{' '}
                {healthResourceCenterPhoneContent()}
              </p>
            )}
          </>
        ),
      };
    case ALERT_TYPES.ZERO:
      return {
        alertStatus: 'info',
        testID: `zero-${appType === APP_TYPES.DEBT ? 'debt' : 'copay'}-alert`,
        appType,
        header:
          appType === APP_TYPES.DEBT
            ? `You don't have any outstanding overpayments`
            : `You haven't received a copay bill in the past 6 months`,
        body:
          appType === APP_TYPES.DEBT ? (
            <p>
              Our records show you don’t have any outstanding overpayments
              related to VA benefits. If you think this is incorrect, call the
              Debt Management Center (DMC) at {dmcPhoneContent()}
            </p>
          ) : (
            <p>
              If you think this is incorrect, contact the VA Health Resource
              Center at {healthResourceCenterPhoneContent()}
            </p>
          ),
      };
    default:
    case ALERT_TYPES.ALL_ERROR:
      return {
        alertStatus: 'error',
        testID: 'all-error-alert',
        header: `We can’t access your overpayment and copay records right now`,
        body: (
          <p>We’re sorry. Something went wrong on our end. Check back soon.</p>
        ),
        secondBody: (
          <>
            <p>
              If you continue having trouble viewing information about your
              outstanding overpayments and copays, contact us online through{' '}
              <a href="https://ask.va.gov">Ask VA</a>.
            </p>
            <p>
              If you need immediate assistance with overpayment debt, call the
              Debt Management Center at {dmcPhoneContent()}
            </p>
            <p>
              If you need immediate assistance with copay bills, call the VA
              Health Resource Center at {healthResourceCenterPhoneContent()}
            </p>
            <p className="vads-u-margin-bottom--0">
              <va-link
                active
                text="Contact us at Ask VA"
                url="https://ask.va.gov"
              />
            </p>
          </>
        ),
      };
  }
};

export default alertMessage;
