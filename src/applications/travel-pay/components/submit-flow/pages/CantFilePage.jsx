import React from 'react';

const CantFilePage = ({ pageIndex, setPageIndex, setCantFile }) => {
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

export default CantFilePage;
