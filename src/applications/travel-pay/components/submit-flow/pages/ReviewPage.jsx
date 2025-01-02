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

        <h2 className="vads-u-margin-top--2">Claims</h2>
        <hr className="vads-u-margin-y--0" />
        <h3 className=" vad-u-margin-top--0">What you’re claiming</h3>
        <p>Mileage-only reimbursement for your appointment at </p>

        <h2 className="vads-u-margin-top--3">Travel method</h2>
        <hr className="vads-u-margin-y--0" />
        <h3 className=" vad-u-margin-top--0">How you traveled</h3>
        <p>In your own vehicle</p>

        <h2 className="vads-u-margin-top--3">Starting address</h2>
        <hr className="vads-u-margin-y--0" />
        <h3 className="vad-u-margin-top--0">Where you traveled from</h3>

        <va-card background>
          <h3 className="vad-u-margin-bottom--2">
            Beneficiary travel agreement
          </h3>
          <p>
            <strong>Penalty statement:</strong> There are severe criminal and
            civil penalties, including a fine, imprisonment, or both, for
            knowingly submitting a false, fictitious, or fraudulent claim.
          </p>
          <p>
            By submitting this claim, you agree to the beneficiary travel
            agreement.
          </p>
        </va-card>

        <div className="vads-u-margin-y--2">
          <va-button text="Back" onClick={e => onBack(e)} />
          <va-button text="Submit" onClick={e => onSubmit(e)} />
        </div>
      </div>
    </>
  );
};

export default ReviewPage;
