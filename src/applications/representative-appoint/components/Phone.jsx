import React from 'react';
import PropTypes from 'prop-types';

export default function Phone({ contact, extension, recordClick }) {
  return (
    <>
      <div className="vads-u-margin-top--1p5 vads-u-display--flex">
        <va-icon icon="phone" size="3" />
        <div className="vads-u-margin-left--1">
          <va-telephone
            contact={contact}
            extension={extension}
            onClick={recordClick}
            disable-analytics
          />
        </div>
      </div>
    </>
  );
}

Phone.propTypes = {
  contact: PropTypes.string.isRequired,
  recordClick: PropTypes.func.isRequired,
  extension: PropTypes.string,
};
