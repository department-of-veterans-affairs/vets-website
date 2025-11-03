import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationFullyDevelopedClaim = ({ formData }) => {
  // These labels are switched in the form with yesNoReverse, so here they are reversed to match the form
  const labels = {
    Y: 'No, I have some extra information that I’ll submit to VA later.',
    N: 'Yes, I have uploaded all my supporting documents.',
  };

  const fullyDevelopedClaimLabel = formData.standardClaim ? labels.Y : labels.N;

  return (
    <li>
      <h4>Fully developed claim program</h4>
      <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
        <li>
          <div className="vads-u-color--gray">
            Do you want to apply using the Fully Developed Claim program?
          </div>
          <div>{fullyDevelopedClaimLabel}</div>
        </li>
      </ul>
    </li>
  );
};

ConfirmationFullyDevelopedClaim.propTypes = {
  formData: PropTypes.shape({
    standardClaim: PropTypes.bool,
  }).isRequired,
};

export default ConfirmationFullyDevelopedClaim;
