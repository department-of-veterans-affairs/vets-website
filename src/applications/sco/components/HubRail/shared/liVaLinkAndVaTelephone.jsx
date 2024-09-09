import React from 'react';
import PropTypes from 'prop-types';

const LiVaLinkAndVaTelephone = ({
  phoneNumber,
  text,
  isInternational = false,
  isTty = false,
}) => (
  <li className="vads-u-margin-bottom--2 vads-u-margin-top--0">
    {text}
    <br />
    <va-telephone
      contact={phoneNumber}
      international={isInternational}
      tty={isTty}
    />
  </li>
);

LiVaLinkAndVaTelephone.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isInternational: PropTypes.bool,
  isTty: PropTypes.bool,
};

export default LiVaLinkAndVaTelephone;
