import React from 'react';

const OutsideDROption = () => {
  return (
    <>
      <h2 className="vads-u-margin-top--3" data-testid="outside-dr-option">
        Options outside of decision reviews
      </h2>
      <p>
        These options are outside VA’s decision review process and may be a good
        fit in certain situations.
      </p>
      <va-card class="vads-u-display--block vads-u-margin-top--3">
        <h3 className="vads-u-margin-top--0">
          US Court of Appeals for Veterans Claims
        </h3>
        <p>
          This is a legal appeal outside of the VA and may be a good fit for an
          appeal of a Board decision.
        </p>
        <p>
          <strong>Note:</strong> This option is available only if it has been
          fewer than 120 days since your decision date.{' '}
        </p>
        <va-link
          external
          href="https://www.uscourts.cavc.gov/"
          text="How to file an appeal on the US Court of Appeals website"
        />
      </va-card>
    </>
  );
};

export default OutsideDROption;
