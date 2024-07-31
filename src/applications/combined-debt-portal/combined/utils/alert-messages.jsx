import React from 'react';
import { ALERT_TYPES, APP_TYPES } from './helpers';

const alertMessage = (alertType, appType) => {
  switch (alertType) {
    case ALERT_TYPES.ALL_ZERO:
      return {
        alertStatus: 'info',
        testID: 'all-zero-alert',
        header: `You don’t have any current VA debt or copay bills`,
        body: (
          <>
            <p>
              Our records show you don’t have any current VA benefit debt and
              you haven’t received a copay bill in the past 6 months.
            </p>
          </>
        ),
        secondHeader: `What to do if you think you have a VA debt or copay bill:`,
        secondBody: (
          <ul>
            <li>
              <strong>For benefit debts</strong>, call the Debt Management
              Center (DMC) at <va-telephone contact="8008270648" /> (
              <va-telephone tty contact="711" />
              ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </li>
            <li>
              <strong>For medical copay bills</strong>, call the VA Health
              Resource Center at <va-telephone contact="8664001238" /> (
              <va-telephone tty contact="711" />
              ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
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
          appType === APP_TYPES.DEBT ? 'debt' : 'copay'
        } records right now`,
        body: (
          <>
            {appType === APP_TYPES.DEBT ? (
              <>
                <p>
                  We’re sorry. Information about{' '}
                  {`${appType === APP_TYPES.DEBT ? 'debts' : 'copays'}`} you
                  might have is unavailable because something went wrong on our
                  end. Please check back soon.
                </p>
                <p>
                  If you continue having trouble viewing information about your{' '}
                  {`${appType === APP_TYPES.DEBT ? 'debts' : 'copays'}`},
                  contact us online through{' '}
                  <a href="https://ask.va.gov">Ask VA</a>.
                </p>
              </>
            ) : (
              <p>
                Please check back soon. If you continue having trouble viewing
                information about your copays, call the VA Health Resource
                Center at <va-telephone contact="8664001238" /> (
                <va-telephone tty contact="711" />
                ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
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
            ? `You don't have any current VA debt`
            : `You haven't received a copay bill in the past 6 months`,
        body:
          appType === APP_TYPES.DEBT ? (
            <p>
              Our records show you don’t have any current debt related to VA
              benefits. If you think this is incorrect, call the Debt Management
              Center (DMC) at <va-telephone contact="8008270648" /> (
              <va-telephone tty contact="711" />
              ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </p>
          ) : (
            <p>
              If you think this is incorrect, contact the VA Health Resource
              Center at <va-telephone contact="8664001238" /> (
              <va-telephone tty contact="711" />
              ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          ),
      };
    default:
    case ALERT_TYPES.ALL_ERROR:
      return {
        alertStatus: 'error',
        testID: 'all-error-alert',
        header: `We can’t access your debt and copay records right now`,
        body: (
          <>
            <p>
              We’re sorry. Information about debts and copays you might have is
              unavailable because something went wrong on our end. Please check
              back soon.
            </p>
          </>
        ),
        secondHeader: `What you can do`,
        secondBody: (
          <>
            <p>
              If you continue having trouble viewing information about your
              current debts and bills, contact us online through{' '}
              <a href="https://ask.va.gov">Ask VA</a>.
            </p>
            <va-link
              href="https://ask.va.gov"
              active
              text="Contact us at Ask VA"
              class="vads-u-margin-top--2"
            />
          </>
        ),
      };
  }
};

export default alertMessage;
