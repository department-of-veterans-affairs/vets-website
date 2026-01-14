import React from 'react';
import PropTypes from 'prop-types';

export default function NoClaims({ recordType = 'records' }) {
  return <p>We don't have any {recordType} for you in our system</p>;
}

NoClaims.propTypes = {
  recordType: PropTypes.string,
};
