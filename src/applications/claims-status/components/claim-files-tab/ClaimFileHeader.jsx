import PropTypes from 'prop-types';
import React from 'react';
import { DemoNotation } from '../../demo';

function ClaimFileHeader({ isOpen }) {
  const headerDescription = isClaimOpen => {
    return isClaimOpen
      ? "You can upload additional evidence or review files you've already uploaded for this claim."
      : 'You can see the files associated with this claim.';
  };
  return (
    <div className="claim-file-header-container">
      <h2 className="tab-header vads-u-margin-y--0">Claim files</h2>
      {isOpen && (
        <DemoNotation
          theme="change"
          title="Files tab description"
          before={
            '"If you need to add evidence, you can do that here. You can also review the files associated with this claim."'
          }
          after={
            '"You can upload additional evidence or review files you\'ve already uploaded for this claim."'
          }
        />
      )}
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
