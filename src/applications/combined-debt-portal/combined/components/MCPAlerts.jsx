import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { currency, calcDueDate, formatDate } from '../utils/helpers';

const Alert = ({ children }) => children;

Alert.Error = () => (
  <va-alert status="error" data-testid="error-alert">
    <h2 slot="headline">
      We can’t access your current copay balances right now
    </h2>
    <p>
      We’re sorry. Something went wrong on our end. You won’t be able to access
      information about your copay balances at this time.
    </p>
    <h2 className="vads-u-font-size--h4">What you can do</h2>
    <p>
      <strong className="vads-u-margin-right--0p5">
        For questions about your payment or relief options,
      </strong>
      contact us at{' '}
      <span className="no-wrap">
        <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />
      </span>{' '}
      (TTY: <va-telephone contact={CONTACTS[711]} />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
    <p>
      <strong className="vads-u-margin-right--0p5">
        For questions about your treatment or your charges,
      </strong>
      contact the VA health care facility where you received care.
    </p>
    <a href="https://www.va.gov/find-locations">
      Find the contact information for your facility
    </a>
  </va-alert>
);

Alert.PastDueOTTP = ({ copay }) => {
  const statementDate = formatDate(copay?.pSStatementDateOutput);

  return (
    <va-alert status="warning" data-testid="past-due-balance-alert">
      <h2 slot="headline">Your balance may be overdue</h2>
      <p>
        Your balance due on
        <time
          dateTime={statementDate}
          className="vads-u-margin-x--0p5 vads-u-font-weight--bold"
        >
          {statementDate}
        </time>
        was <strong>{currency(copay?.pHAmtDue)}</strong>. If you paid your full
        balance, you don’t need to do anything else at this time.
      </p>
      <p>
        <Link
          className="vads-u-font-weight--bold"
          to={`/copay-balances/${copay.id}/resolve`}
          data-testid={`resolve-link-${copay.id}`}
          onClick={() => {
            recordEvent({ event: 'cta-link-click-copay-balance-card' });
          }}
        >
          Pay your balance, request financial help, or dispute this bill
          <va-icon
            icon="navigate_next"
            size={2}
            class="cdp-link-icon--active"
          />
        </Link>
      </p>
    </va-alert>
  );
};

Alert.PastDueOTTP.propTypes = {
  copay: PropTypes.shape({
    id: PropTypes.string,
    pSStatementDateOutput: PropTypes.string,
    pHAmtDue: PropTypes.number,
  }),
};

Alert.PastDue = ({ copay }) => {
  const statementDate = formatDate(copay?.pSStatementDateOutput);

  return (
    <va-alert status="warning" data-testid="past-due-balance-alert">
      <h2 slot="headline">Your balance may be overdue</h2>
      <p>
        Your balance on
        <time dateTime={statementDate} className="vads-u-margin-x--0p5">
          {statementDate}
        </time>
        was {currency(copay?.pHAmtDue)}. If you paid your full balance, you
        don’t need to do anything else at this time.
      </p>
      <p>
        <strong className="vads-u-margin-right--0p5">
          If you haven’t either paid your full balance or requested financial
          help,
        </strong>
        contact us at{' '}
        <span className="no-wrap">
          <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />
        </span>{' '}
        (TTY: <va-telephone contact={CONTACTS[711]} />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </va-alert>
  );
};

Alert.PastDue.propTypes = {
  copay: PropTypes.shape({
    pSStatementDateOutput: PropTypes.string,
    pHAmtDue: PropTypes.number,
  }),
};

Alert.ZeroBalance = ({ copay }) => {
  const statementDate = formatDate(copay?.pSStatementDateOutput);

  return (
    <va-alert status="info" data-testid="zero-balance-alert">
      <h2 slot="headline">You don’t need to make a payment at this time</h2>
      <p>
        Your balance is $0 and was updated on
        <time dateTime={statementDate} className="vads-u-margin-x--0p5">
          {statementDate}
        </time>
        . You can
        <a href="#download-statements" className="vads-u-margin--0p5">
          download your previous statements
        </a>
        below.
      </p>
      <p>
        If you receive new charges, we’ll send you a statement in the mail and
        update your balance. Learn more about
        <a href="#balance-questions" className="vads-u-margin--0p5">
          what to do if you have questions about your balance
        </a>
        .
      </p>
    </va-alert>
  );
};

Alert.ZeroBalance.propTypes = {
  copay: PropTypes.shape({
    pSStatementDateOutput: PropTypes.string,
  }),
};

Alert.NoHealthcare = () => (
  <va-alert status="warning" data-testid="no-healthcare-alert">
    <h2 slot="headline">You’re not enrolled in VA health care</h2>
    <p>
      You can’t check copay balances at this time because our records show that
      you’re not enrolled in VA health care.
      <a
        href="https://va.gov/health-care/how-to-apply/"
        className="vads-u-margin-left--0p5"
      >
        Find out how to apply for VA health care benefits
      </a>
      .
    </p>
    <p>
      If you think this is incorrect, call our toll-free hotline at{' '}
      <span className="no-wrap">
        <va-telephone contact={CONTACTS['222_VETS']} />
      </span>
      , Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

Alert.NoHistory = () => (
  <va-alert status="info" data-testid="no-history-alert">
    <h2 slot="headline">
      You haven’t received a copay bill in the past 6 months
    </h2>
    <p>
      You can’t check copay balances at this time because our records show that
      you haven’t received a copay bill in the past 6 months.
    </p>
    <p>
      If you think this is incorrect, contact the VA Health Resource Center at{' '}
      <span className="no-wrap">
        <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />
      </span>
      . (TTY: <va-telephone contact={CONTACTS[711]} />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

Alert.StatusOTTP = ({ copay }) => (
  <va-alert background-only status="warning" data-testid="status-alert">
    <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
      {/* using vads-u-margin-left here causes the word "before" 
      to wrap to the next line so we need a {' '} space here */}
      Pay your {currency(copay?.pHAmtDue)} balance or request help now
    </h2>
    <p>
      To avoid late fees or collection action on your bill, you must pay your
      full balance or request financial help before
      <span className="vads-u-margin-left--0p5">
        {calcDueDate(copay?.pSStatementDateOutput, 30)}
      </span>
      .
    </p>
    <p>
      <Link
        className="vads-u-font-weight--bold"
        to={`/copay-balances/${copay.id}/resolve`}
        data-testid={`resolve-link-${copay.id}`}
        onClick={() => {
          recordEvent({ event: 'cta-link-click-copay-balance-card' });
        }}
      >
        Pay your balance, request financial help, or dispute this bill
        <va-icon icon="navigate_next" size={2} class="cdp-link-icon--active" />
      </Link>
    </p>
  </va-alert>
);

Alert.StatusOTTP.propTypes = {
  copay: PropTypes.shape({
    id: PropTypes.string,
    pSStatementDateOutput: PropTypes.string,
    pHAmtDue: PropTypes.number,
  }),
};

Alert.Status = ({ copay }) => (
  <va-alert background-only status="warning" data-testid="status-alert">
    <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
      {/* using vads-u-margin-left here causes the word "before" 
      to wrap to the next line so we need a {' '} space here */}
      Pay your {currency(copay?.pHAmtDue)} balance or request help before{' '}
      <span className="vads-u-line-height--4 no-wrap">
        {calcDueDate(copay?.pSStatementDateOutput, 30)}
      </span>
    </h2>
    <p>
      To avoid late fees or collection action on your bill, you must pay your
      full balance or request financial help before
      <span className="vads-u-margin-left--0p5">
        {calcDueDate(copay?.pSStatementDateOutput, 30)}
      </span>
      .
    </p>
    <p>
      <a className="vads-c-action-link--blue" href="#how-to-pay">
        Pay your copay bill
      </a>
    </p>
    <p>
      <a
        aria-label="Request help with your debt"
        className="vads-c-action-link--blue"
        data-testid="link-request-help"
        href="/manage-va-debt/request-debt-help-form-5655"
        onClick={() => {
          recordEvent({ event: 'cta-link-click-debt-request-help' });
        }}
      >
        Request help with your bill
      </a>
    </p>
    <h3 className="vads-u-font-size--h4">
      What if I’ve already requested financial help with my bill?
    </h3>
    <p>
      You may need to continue making payments while we review your request.
      Call us at{' '}
      <span className="no-wrap">
        <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />
      </span>
      , Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
    </p>
  </va-alert>
);

Alert.Status.propTypes = {
  copay: PropTypes.shape({
    pSStatementDateOutput: PropTypes.string,
    pHAmtDue: PropTypes.number,
  }),
};

const Alerts = ({ type, copay, error }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const showCDPOneThingPerPage = useToggleValue(
    TOGGLE_NAMES.showCDPOneThingPerPage,
  );

  switch (type) {
    case 'status':
      return showCDPOneThingPerPage ? (
        <Alert.StatusOTTP copay={copay} />
      ) : (
        <Alert.Status copay={copay} />
      );
    case 'no-health-care':
      recordEvent({
        event: 'visible-alert-box',
        'alert-box-type': 'warning',
        'alert-box-heading': 'You’re not enrolled in VA health care',
      });
      return <Alert.NoHealthcare />;
    case 'no-history':
      recordEvent({
        event: 'visible-alert-box',
        'alert-box-type': 'info',
        'alert-box-heading':
          'You haven’t received a copay bill in the past 6 months',
      });
      return <Alert.NoHistory />;
    case 'zero-balance':
      recordEvent({
        event: 'visible-alert-box',
        'alert-box-type': 'info',
        'alert-box-heading': 'You don’t need to make a payment at this time',
      });
      return <Alert.ZeroBalance copay={copay} />;
    case 'past-due-balance':
      recordEvent({
        event: 'visible-alert-box',
        'alert-box-type': 'info',
        'alert-box-heading': 'Your balance may be overdue',
      });
      return showCDPOneThingPerPage ? (
        <Alert.PastDueOTTP copay={copay} />
      ) : (
        <Alert.PastDue copay={copay} />
      );
    default:
      recordEvent({
        event: 'visible-alert-box',
        'alert-box-type': 'error',
        'alert-box-heading':
          'We can’t access your current copay balances right now',
        'error-key': error?.status || '',
      });
      return <Alert.Error />;
  }
};

Alerts.propTypes = {
  copay: PropTypes.shape({
    pSStatementDate: PropTypes.string,
    pHAmtDue: PropTypes.number,
    id: PropTypes.string,
  }),
  error: PropTypes.string,
  type: PropTypes.string,
};

export default Alerts;
