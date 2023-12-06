import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import content from '../../locales/en/content.json';

const ConfirmationPrintView = ({ name, timestamp }) => {
  return (
    <>
      <img
        src="/img/design/logo/logo-black-and-white.png"
        className="vagov-logo vads-u-max-width--100 vads-u-margin-bottom--4"
        alt=""
      />

      <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--0">
        {content['form-title']}
      </h1>
      <div>{content['form-subtitle']}</div>

      <h2 className="vads-u-font-size--h3">
        {content['confirm-success-title']}
      </h2>
      <p>{content['confirm-success-review-message']}</p>
      <p className="vads-u-margin-bottom--0">
        {content['confirm-success-changes-message']}
      </p>

      <hr className="vads-u-margin-y--4" />

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        {content['confirm-app-title']}
      </h2>

      <h3 className="vads-u-font-size--h4">
        {content['confirm-app-list-name']}
      </h3>
      <p
        className="ezr-veteran-fullname dd-privacy-mask"
        data-dd-action-name="Full name"
      >
        {name}
      </p>

      {timestamp ? (
        <>
          <h3 className="vads-u-font-size--h4">
            {content['confirm-app-list-date']}
          </h3>
          <p className="ezr-application-date">
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
