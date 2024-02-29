import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const ConfirmationPrintView = ({ name, timestamp }) => {
  return (
    <>
      <img
        src="/img/design/logo/logo-black-and-white.png"
        className="vagov-logo vads-u-max-width--100 vads-u-margin-bottom--4"
        alt=""
      />

      <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--0">
        Apply for health care
      </h1>
      <div>Form 10-10EZ</div>

      <h2 className="vads-u-font-size--h3">
        Thank you for completing your application for health care
      </h2>
      <p className="vads-u-margin-bottom--0">
        Once we’ve successfully received your application, we’ll contact you to
        tell you what happens next in the application process.
      </p>

      <hr className="vads-u-margin-y--4" />

      <h3 className="vads-u-margin-top--0">Your application information</h3>
      <h4>For Veteran</h4>
      <p
        className="hca-veteran-fullname dd-privacy-mask"
        data-dd-action-name="Veteran name"
      >
        {name}
      </p>

      {timestamp ? (
        <>
          <h4>Date you applied</h4>
          <p
            className="hca-application-date dd-privacy-mask vads-u-margin-bottom--0"
            data-dd-action-name="application date"
          >
            {moment(timestamp).format('MMM D, YYYY')}
          </p>
        </>
      ) : null}

      <hr className="vads-u-margin-top--4 vads-u-margin-bottom--0" />
    </>
  );
};

ConfirmationPrintView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.string,
};

export default ConfirmationPrintView;
