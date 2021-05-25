import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const NotFoundError = ({ error }) => (
  <div className="row vads-u-margin-bottom--5">
    <AlertBox status="error" headline={error.title} content={error.detail} />
  </div>
);

const UnAuthError = ({ error }) => (
  <div className="row vads-u-margin-bottom--5">
    <AlertBox status="error" headline={error.title} content={error.detail} />
  </div>
);

const ServerError = ({ error }) => (
  <div className="row vads-u-margin-bottom--5">
    <AlertBox
      status="error"
      headline="We're sorry. Something went wrong on our end."
      content={
        <>
          <p>
            You can't submit a Financial Status Report (5655) because something
            went wrong on our end.
          </p>
          {error?.meta && <p>Error: {error.meta.exception}</p>}
        </>
      }
    />
  </div>
);

const ErrorMessage = ({ errorCode }) => {
  const [error] = errorCode.errors ?? [];

  switch (error.code) {
    case '411':
      return <NotFoundError error={error} />;
    case '401':
      return <UnAuthError error={error} />;
    default:
      return <ServerError error={error} />;
  }
};

const mapStateToProps = ({ fsr }) => ({
  errorCode: fsr.errorCode,
});

export default connect(mapStateToProps)(ErrorMessage);
