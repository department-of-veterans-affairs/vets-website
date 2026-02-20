// components/ClaimantDetailRow.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ClaimantDetailRow = ({ label, value }) => (
  <div className="vads-u-display--flex vads-u-width--full vads-u-padding-y--3 vads-u-border-bottom--1px vads-u-border-color--base-light">
    <dt className="vads-u-width--40 vads-u-font-weight--bold vads-u-margin--0 vads-u-padding-right--3">
      {label}
    </dt>
    <dd className="vads-u-width--60 vads-u-margin--0">{value ?? '—'}</dd>
  </div>
);

ClaimantDetailRow.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node,
};

export default ClaimantDetailRow;
