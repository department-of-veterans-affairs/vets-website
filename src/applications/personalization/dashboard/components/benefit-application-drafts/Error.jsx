import React from 'react';

const Error = () => {
  const content = (
    <>
      <h3 slot="headline" className="vads-u-margin-top--0">
        We can’t access your benefit applications and forms right now
      </h3>
      <p className="vads-u-margin-bottom--0">
        We’re sorry. We’re working to fix this problem. Check back later.
      </p>
    </>
  );

  return (
    <div
      className="vads-u-width--full vads-u-margin-bottom--3"
      data-testid="benefit-application-error"
    >
      <va-alert status="warning">{content}</va-alert>
    </div>
  );
};

export default Error;
