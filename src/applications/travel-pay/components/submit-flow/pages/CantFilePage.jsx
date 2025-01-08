import React from 'react';
import PropTypes from 'prop-types';

const CantFilePage = ({
  pageIndex,
  setIsUnsupportedClaimType,
  setPageIndex,
}) => {
  const onBack = e => {
    e.preventDefault();
    setIsUnsupportedClaimType(false);
    setPageIndex(pageIndex);
  };

  return (
    <div>
      <h1 tabIndex="-1">
        We can’t file this type of travel reimbursement claim
      </h1>
      <va-button
        class="vads-u-margin-y--2"
        text="Back"
        onClick={e => onBack(e)}
      />
    </div>
  );
};

CantFilePage.propTypes = {
  pageIndex: PropTypes.number,
  setIsUnsupportedClaimType: PropTypes.func,
  setPageIndex: PropTypes.func,
};

export default CantFilePage;
