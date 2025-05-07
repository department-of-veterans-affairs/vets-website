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
    'Please wait while we check to see if you have an existing Intent to File.',
    'looking for an intent to file',
  );

export const ItfCreateSpinner = () =>
  showLoading(
    'Please wait while we create your Intent to File.',
    'creating an intent to file',
  );

export const itfMessage = ({ headline, content, status }) => (
  <va-alert visible status={status}>
    <h2 slot="headline">{headline}</h2>
    {content}
  </va-alert>
);

export const ItfCreatedAlert = ({ itfType, expirationDateFormatted }) =>
  itfMessage({
    status: 'success',
    headline: `Your intent to file a ${itfType} application`,
    content: (
      <>
        <div>
          We automatically recorded your intent to file. If you’re approved,
          we’ll use your intent to file date as your potential start date for
          potential benefits.
        </div>
        <p>
          <span>
            Submit your application by{' '}
            <strong>{expirationDateFormatted}</strong>. If you’re not ready to
            submit your application by then, don’t worry. You can start a new
            application, and we’ll record a new benefits start date.
          </span>
        </p>
      </>
    ),
  });

ItfCreatedAlert.propTypes = {
  expirationDateFormatted: PropTypes.string.isRequired,
  itfType: PropTypes.string.isRequired,
};

export const ItfFoundAlert = ({ itfType, expirationDateFormatted }) =>
  itfMessage({
    status: 'success',
    headline: 'We’ve recorded your intent to file',
    content: (
      <>
        <div>
          {`We’ve found your intent to file a ${itfType} application in our records.`}
        </div>
        <p>
          <span>
            Submit your application by{' '}
            <strong>{expirationDateFormatted}</strong>. If you don’t submit your
            application by that date and you still want to apply, you can start
            a new application. And, we’ll set a new benefits start date.
          </span>
        </p>
        <va-link
          external
          href="/resources/your-intent-to-file-a-va-claim/"
          text="Learn more about intent to file"
        />
      </>
    ),
  });

ItfFoundAlert.propTypes = {
  expirationDateFormatted: PropTypes.string.isRequired,
  itfType: PropTypes.string.isRequired,
};

export const ItfFailedAlert = ({ itfType }) =>
  itfMessage({
    status: 'warning',
    headline: `You may want to confirm your intent to file for ${itfType} benefits`,
    content: (
      <>
        <div>
          We tried to check for your intent to file in our records, but there
          was a problem with our system. You can still work on your application.
        </div>
        <p>
          Submitting your intent to file a Veterans {itfType} application is
          optional, but may help you get more benefits, depending on your
          situation.
        </p>
        <p>
          To submit or confirm your intent to file, we recommend calling{' '}
          <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
      </>
    ),
  });

ItfFailedAlert.propTypes = {
  itfType: PropTypes.string.isRequired,
};
