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

      <h2 className="vads-u-font-size--h3">{content['confirm-page-title']}</h2>
      <p className="vads-u-margin-bottom--0">
        {content['confirm-page-description']}
      </p>

      <hr className="vads-u-margin-y--4" />

      <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
        {content['confirm-app-title']}
      </h2>
      <dl className="vads-u-margin-bottom--0">
        <div className="vads-u-margin-bottom--2">
          <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
            {content['confirm-app-list-name']}
          </dt>
          <dd className="ezr-veteran-fullname">{name}</dd>
        </div>
        {timestamp ? (
          <div className="ezr-application-date">
            <dt className="vads-u-font-family--serif vads-u-font-weight--bold">
              {content['confirm-app-list-date']}
            </dt>
            <dd>{moment(timestamp).format('MMM D, YYYY')}</dd>
          </div>
        ) : null}
      </dl>

      <hr className="vads-u-margin-top--4 vads-u-margin-bottom--0" />
    </>
  );
};

ConfirmationPrintView.propTypes = {
  name: PropTypes.object,
  timestamp: PropTypes.string,
};

export default ConfirmationPrintView;
