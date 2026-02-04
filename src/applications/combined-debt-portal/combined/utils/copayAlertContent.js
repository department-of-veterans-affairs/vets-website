import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { currency, calcDueDate, formatDate } from './helpers';

export const phoneContent = () => {
  return (
    <>
      <p className="vads-u-font-weight--bold">
        <va-icon icon="phone" size="3" />{' '}
        <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (TTY:{' '}
        <va-telephone contact={CONTACTS[711]} />)
      </p>
    </>
  );
};

export const getCopayAlertContent = (copay, type) => {
  const statementDate = formatDate(copay?.pSStatementDateOutput);

  switch (type) {
    case 'no-health-care':
      return {
        headerText: 'You’re not enrolled in VA health care',
        status: 'warning',
        showLinks: false,
        testId: 'copay-no-health-care-alert',
        bodyText: (
          <>
            <p>
              You can’t check copay balances at this time because our records
              show that you’re not enrolled in VA health care.
            </p>
            <p>
              <va-link-action
                href="https://va.gov/health-care/how-to-apply/"
                text="Find out how to apply for VA health care benefits"
                type="primary"
              />
            </p>
            <p>
              If you think this is incorrect, call our toll-free hotline Monday
              through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
            <p className="vads-u-font-weight--bold">
              <va-icon icon="phone" size="3" />{' '}
              <va-telephone contact={CONTACTS['222_VETS']} />
            </p>
          </>
        ),
      };
    case 'status':
      return {
        headerText: `Pay your ${currency(
          copay?.pHAmtDue,
        )} balance or request help now`,
        status: 'warning',
        showLinks: true,
        testId: 'copay-status-alert',
        bodyText: (
          <p>
            To avoid late fees or collection action on your bill, you must pay
            your full balance or request financial help before
            <span className="vads-u-margin-left--0p5">
              {calcDueDate(copay?.pSStatementDateOutput, 30)}
            </span>
            .
          </p>
        ),
      };
    case 'no-history':
      return {
        headerText: `You haven’t received a copay bill in the past 6 months`,
        status: 'warning',
        showLinks: false,
        testId: 'no-copay-history-alert',
        bodyText: (
          <>
            <p>
              You can’t check copay balances at this time because our records
              show that you haven’t received a copay bill in the past 6 months.
            </p>
            <p>
              If you think this is incorrect, contact the VA Health Resource
              Center. We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.
              ET.
            </p>
            <p>
              <span className="no-wrap">
                <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />
              </span>
              . (TTY: <va-telephone contact={CONTACTS[711]} />
            </p>
          </>
        ),
      };
    case 'past-due-balance':
      return {
        headerText: `Your balance may be overdue`,
        status: 'warning',
        showLinks: true,
        testId: 'copay-past-due-alert',
        showCallResourceCenter: true,
        bodyText: (
          <p>
            Your balance on
            <time
              dateTime={statementDate}
              className="vads-u-margin-x--0p5 vads-u-font-weight--bold"
            >
              {statementDate}
            </time>
            was <strong>{currency(copay?.pHAmtDue)}</strong>. If you paid your
            full balance, you don’t need to do anything else at this time.
          </p>
        ),
      };
    case 'zero-balance':
      return {
        headerText: `You don’t need to make a payment at this time`,
        status: 'info',
        showLinks: false,
        showCallResourceCenter: false,
        testId: 'copay-zero-balance-alert',
        bodyText: (
          <>
            <p>
              Your balance is $0 and was updated on
              <time dateTime={statementDate} className="vads-u-margin-x--0p5">
                {statementDate}
              </time>
              . You can
              <a href="#statement-list" className="vads-u-margin--0p5">
                download your previous statements
              </a>
            </p>
            <p>
              If you receive new charges, we’ll send you a statement in the mail
              and update your balance. Learn more about
              <a href="#need-help" className="vads-u-margin--0p5">
                what to do if you have questions about your balance
              </a>
              .
            </p>
          </>
        ),
      };
    case 'error':
      return {
        headerText: `We can’t access your current copay balances right now`,
        status: 'error',
        showLinks: false,
        testId: 'copay-error-alert',
        bodyText: (
          <>
            <p>
              We’re sorry. Something went wrong on our end. Check back soon.
            </p>
            <h3 className="vads-u-font-size--h4">What you can do</h3>
            <p>
              <strong className="vads-u-margin-right--0p5">
                For questions about your payment or relief options,
              </strong>
              call the VA Health Resource Center. We’re here Monday through
              Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
            {phoneContent()}
          </>
        ),
      };
    default:
      return {
        headerText: `We’re reviewing your account`,
        status: 'info',
        showLinks: false,
        testId: 'copay-default-alert',
        bodyText: (
          <p className="vads-u-margin-bottom--0">
            You don’t need to do anything at this time.
          </p>
        ),
      };
  }
};
