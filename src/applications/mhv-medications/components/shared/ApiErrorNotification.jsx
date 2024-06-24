import React from 'react';
import PropTypes from 'prop-types';

const ApiErrorNotification = ({ errorType, content, children }) => {
  return (
    <va-alert status="error" setFocus aria-live="polite" role="alert" uswds>
      <h2
        className="vads-u-margin--0 vads-u-font-size--h3"
        data-testid="no-medications-list"
      >
        {`We can’t ${errorType} your ${content} right now`}
      </h2>
      <p>We’re sorry. There’s a problem with our system. Check back later.</p>
      {!children ? (
        <>
          <p>
            <strong>If you need to request a refill now,</strong> call your VA
            pharmacy. You can find the pharmacy phone number on your
            prescription label or on your VA health facility’s webpage.
          </p>
          <a href="/find-locations/?page=1&facilityType=health">
            Find your VA health facility
          </a>
        </>
      ) : (
        children
      )}
    </va-alert>
  );
};

ApiErrorNotification.propTypes = {
  children: PropTypes.node,
  content: PropTypes.string,
  errorType: PropTypes.string,
};

export default ApiErrorNotification;
