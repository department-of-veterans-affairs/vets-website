import PropTypes from 'prop-types';
import React from 'react';

function ClaimFileHeader({ isOpen }) {
  const headerDescription = isClaimOpen => {
    return isClaimOpen
      ? 'If you need to add evidence, you can do that here. You can also see the files associated with this claim.'
      : 'You can see the files associated with this claim.';
  };
  return (
    <div className="claim-file-header-container">
      <h2 className="vads-u-margin-y--0">Claim files</h2>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4 va-introtext">
        {headerDescription(isOpen)}
      </p>
    </div>
  );
}

ClaimFileHeader.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default ClaimFileHeader;
