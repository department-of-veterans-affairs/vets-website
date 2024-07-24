import React from 'react';
import PropTypes from 'prop-types';

const LiVaLinkAndVaTelephone = ({
  phoneNumber,
  text,
  isInternational = false,
}) => (
  <li className="vads-u-margin-bottom--2 vads-u-margin-top--0">
    <va-link href={`tel:${phoneNumber}`} text={text} />
    <br />
    <va-telephone contact={phoneNumber} international={isInternational} />
  </li>
);

LiVaLinkAndVaTelephone.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isInternational: PropTypes.bool,
};

export default LiVaLinkAndVaTelephone;
