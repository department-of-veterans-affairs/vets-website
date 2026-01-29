import React from 'react';
import PropTypes from 'prop-types';

/**
 * RepConfirmationPage - Confirmation page after successful submission
 *
 * Displays confirmation information after the representative successfully
 * submits a 526EZ claim on behalf of a veteran.
 */
const RepConfirmationPage = ({ form }) => {
  const { submission, data } = form;
  const { response } = submission || {};
  const veteranName = data?.fullName;

  const nameParts = [
    veteranName?.first || '',
    veteranName?.middle || '',
    veteranName?.last || '',
  ]
    .filter(Boolean)
    .join(' ');
  const fullName = nameParts || 'the veteran';

  return (
    <div className="confirmation-page">
      <va-alert status="success" uswds>
        <h2 slot="headline">
          You've successfully submitted a disability compensation claim
        </h2>
        <p>
          The claim for <strong>{fullName}</strong> has been submitted.
        </p>
      </va-alert>

      <div className="inset vads-u-margin-top--4">
        <h3 className="vads-u-margin-top--0">
          Disability Compensation Claim{' '}
          <span className="vads-u-font-weight--normal">(Form 21-526EZ)</span>
        </h3>

        {response?.claimId && (
          <p>
            <strong>Claim ID:</strong> {response.claimId}
          </p>
        )}

        <p>
          <strong>Date submitted:</strong>{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <h3 className="vads-u-margin-top--4">What happens next?</h3>
      <p>
        VA will review the claim and contact the veteran if more information is
        needed. The veteran can check the status of their claim online at
        VA.gov.
      </p>

      <va-link href="/track-claims" text="Check claim status" />
    </div>
  );
};

RepConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: PropTypes.shape({
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
      }),
    }),
    submission: PropTypes.shape({
      response: PropTypes.shape({
        claimId: PropTypes.string,
      }),
    }),
  }),
};

export default RepConfirmationPage;
