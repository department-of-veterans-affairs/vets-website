/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const ConfirmationPrintView = ({ name, timestamp }) => {
  console.log('Print Props:', { name, timestamp });

  return (
    <>
      <img
        src="/img/design/logo/logo-black-and-white.png"
        className="vagov-logo"
        alt=""
      />

      <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--0">
        Apply for the Program of Comprehensive Assistance for Family Caregivers
      </h1>
      <div>Form 10-10CG</div>

      <h2 className="vads-u-font-size--h3">
        Thank you for completing your application
      </h2>
      <p>
        Once we’ve successfully received your application, we’ll contact you to
        tell you what happens next in the application processs.
      </p>

      <hr />

      <h2 className="vads-u-font-size--h3">Your application information</h2>
      <dl>
        <div>
          <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
            Veteran’s name
          </dt>
          <dd>
            {name.first} {name.middle} {name.last} {name.suffix}
          </dd>
        </div>
        {!!timestamp && (
          <div>
            <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
              Date you applied
            </dt>
            <dd>{moment(timestamp).format('MMM D, YYYY')}</dd>
          </div>
        )}
      </dl>

      <hr />
    </>
  );
};

ConfirmationPrintView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.string,
};

export default ConfirmationPrintView;
