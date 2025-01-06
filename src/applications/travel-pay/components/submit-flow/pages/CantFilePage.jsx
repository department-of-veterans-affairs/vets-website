import PropTypes from 'prop-types';
import React from 'react';

const CantFilePage = ({ pageIndex, setCantFile, setPageIndex }) => {
  const onBack = e => {
    e.preventDefault();
    setCantFile(false);
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
  setCantFile: PropTypes.func,
  setPageIndex: PropTypes.func,
};

export default CantFilePage;
