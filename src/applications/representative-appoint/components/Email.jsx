import React from 'react';
import PropTypes from 'prop-types';

export default function Email({ email, recordClick }) {
  return (
    <>
      <div className="vads-u-margin-top--1p5 vads-u-display--flex">
        <va-icon icon="mail" size="3" />
        <a
          href={`mailto:${email}`}
          onClick={recordClick()}
          className="vads-u-margin-left--1"
        >
          {email}
        </a>
      </div>
    </>
  );
}

Email.propTypes = {
  email: PropTypes.string.isRequired,
  recordClick: PropTypes.func.isRequired,
};
