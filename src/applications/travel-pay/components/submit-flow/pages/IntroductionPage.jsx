import React from 'react';

const IntroductionPage = props => {
  const { onNext } = props;
  return (
    <div>
      <h1 tabIndex="-1">File a travel reimbursement claim</h1>
      <va-link-action
        onClick={e => onNext(e)}
        href="javascript0:void"
        text="File a mileage only claim"
      />
    </div>
  );
};

export default IntroductionPage;
