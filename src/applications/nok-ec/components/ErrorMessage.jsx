import React from 'react';

const ErrorMessage = ({ headline, children }) => {
  return (
    <va-alert aria-atomic="true" aria-live="assertive" status="error">
      <h3 className="vads-u-font-size--h3" slot="headline">
        {headline}
      </h3>
      <div className="vads-u-font-size--base">{children}</div>
    </va-alert>
  );
};

ErrorMessage.defaultProps = {
  headline: "We're sorry. We've run into a problem",
  children: 'Something went wrong on our end. Please try again later.',
};

export default ErrorMessage;
