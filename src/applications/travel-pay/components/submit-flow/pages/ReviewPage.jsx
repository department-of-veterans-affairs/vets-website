import React from 'react';

const ReviewPage = props => {
  const { onSubmit, pageIndex, setPageIndex } = props;

  const onBack = e => {
    e.preventDefault();
    setPageIndex(pageIndex - 1);
  };

  return (
    <>
      <div>
        <h1 className="vad-u-margin-top--0">Review your travel claim</h1>
        <p>Confirm the information is correct before you submit your claim.</p>

        <div className="vads-u-margin-y--2">
          <va-button text="Back" onClick={e => onBack(e)} />
          <va-button text="Submit" onClick={e => onSubmit(e)} />
        </div>
      </div>
    </>
  );
};

export default ReviewPage;
