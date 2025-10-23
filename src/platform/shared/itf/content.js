import React from 'react';
import { Link, withRouter } from 'react-router';
import PropTypes from 'prop-types';

/**
 * Wraps ITF content
 * @param {Element} content - loading indicator or alert
 * @returns {Element}
 */
export const WrapContent = ({ content }) => (
  <div className="itf-wrapper">{content}</div>
);
WrapContent.propTypes = {
  content: PropTypes.element.isRequired,
};

/**
 * Wraps ITF content when it's overriding the page content
 * @param {Element} content - loading indicator or alert
 * @param {Function} setMessageDismissed - useState function to dismiss ITF page
 * @param {String} baseUrl - base URL for the application (starts with '/')
 * @param {Object} router - React router object
 * @returns {Element}
 */
export const WrapPage = ({ content, setMessageDismissed, baseUrl, router }) => {
  const goHome = () => {
    router.push(`${baseUrl}/introduction`);
  };
  const dismissMessage = () => {
    setMessageDismissed(true);
  };
  return (
    <div className="itf-wrapper vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
      <div className="usa-content">
        {content}
        <Link
          className="back-link vads-u-margin-right--2"
          to={`${baseUrl}/introduction`}
          onClick={goHome}
        >
          Back
        </Link>
        <va-button
          class="vads-u-margin-top--2"
          continue
          onClick={dismissMessage}
        />
      </div>
    </div>
  );
};
WrapPage.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setMessageDismissed: PropTypes.func.isRequired,
};

export const WrapPageWithButtons = withRouter(WrapPage);

export const showLoading = (message, label) => (
  <va-loading-indicator set-focus message={message} label={label} />
);

export const ItfSearchSpinner = () =>
  showLoading(
    'Checking if you have an existing intent to file...',
    'looking for an intent to file',
  );

export const ItfCreateSpinner = () =>
  showLoading('Recording your intent to file...', 'creating an intent to file');

export const itfMessage = ({ headline, content, status }) => (
  <va-alert visible status={status}>
    <h2 slot="headline">{headline}</h2>
    {content}
  </va-alert>
);

export const ItfCreatedAlert = ({
  creationDateFormatted,
  expirationDateFormatted,
}) =>
  itfMessage({
    status: 'success',
    headline: `We recorded your intent to file`,
    content: (
      <>
        <p>Your intent to file date is {creationDateFormatted}.</p>
        <p>
          <span>
            Submit your saved application by{' '}
            <strong>{expirationDateFormatted}</strong> to keep your intent to
            file date. If you don’t submit your application by this date, you
            can start a new application. But you may have a later effective date
            for benefits.
          </span>
        </p>
      </>
    ),
  });

ItfCreatedAlert.propTypes = {
  creationDateFormatted: PropTypes.string.isRequired,
  expirationDateFormatted: PropTypes.string.isRequired,
};

export const ItfFoundAlert = ({
  itfType,
  creationDateFormatted,
  expirationDateFormatted,
}) =>
  itfMessage({
    status: 'success',
    headline: 'We have your intent to file',
    content: (
      <>
        <div>
          We have your intent to file a {itfType} application in our records.
          Your intent to file date is {creationDateFormatted}.
        </div>
        <p>
          <span>
            Submit your saved application by{' '}
            <strong>{expirationDateFormatted}</strong> to keep your intent to
            file date. If you don’t submit your application by this date, you
            can start a new application. But you may have a later effective date
            for benefits.
          </span>
        </p>
      </>
    ),
  });

ItfFoundAlert.propTypes = {
  creationDateFormatted: PropTypes.string.isRequired,
  expirationDateFormatted: PropTypes.string.isRequired,
  itfType: PropTypes.string.isRequired,
};

export const ItfFailedAlert = ({ itfType }) =>
  itfMessage({
    status: 'warning',
    headline: `You can call to confirm your intent to file`,
    content: (
      <>
        <div>
          <p>
            We’re sorry. We can’t find a record of your intent to file a
            Veterans <span className="capitalize">{itfType}</span> application
            right now.
          </p>
        </div>
        <va-additional-info trigger="What’s an intent to file?">
          <div>
            Your intent to file tells us that you plan to submit an application.
            We use your intent to file date to help set a start date (or
            effective date) for your benefits. If we approve your claim, you may
            be able to get retroactive payments for the time between your intent
            to file date and the date we approve your claim.
          </div>
        </va-additional-info>
        <p>
          Call us at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />) to confirm your intent to file.
          We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. We can
          also help you submit a new intent to file if you need one.
        </p>
        <p>You can still work on this application online.</p>
      </>
    ),
  });

ItfFailedAlert.propTypes = {
  itfType: PropTypes.string.isRequired,
};
