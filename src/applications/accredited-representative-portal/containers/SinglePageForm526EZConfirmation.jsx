import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';

const getConfirmationAttributes = submission => {
  if (!submission) {
    return {};
  }

  const data = submission.data || submission;
  const attributes = data?.attributes || {};

  return {
    confirmationNumber:
      attributes.confirmationNumber ||
      attributes.claimId ||
      attributes.referenceNumber ||
      data?.id,
    submittedAt:
      attributes.submittedAt ||
      attributes.submissionTimestamp ||
      attributes.createdAt,
  };
};

const formatDateTime = isoString => {
  if (!isoString) {
    return null;
  }
  try {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  } catch (e) {
    return null;
  }
};

const SinglePageForm526EZConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const submission = location.state?.submission || null;
  const payload = location.state?.payload || null;

  useEffect(() => {
    if (!submission) {
      navigate('/submissions', { replace: true });
      return;
    }
    focusElement('h1');
  }, [submission, navigate]);

  if (!submission) {
    return null;
  }

  const { confirmationNumber, submittedAt } = getConfirmationAttributes(
    submission,
  );
  const formattedDate = formatDateTime(submittedAt);

  const veteranName =
    payload?.veteran?.fullName?.first && payload?.veteran?.fullName?.last
      ? `${payload.veteran.fullName.first} ${payload.veteran.fullName.last}`
      : 'the Veteran';

  const disabilities =
    payload?.form526?.form526?.disabilities || payload?.form526?.disabilities;

  return (
    <div className="vads-l-grid-container vads-u-padding-y--4 single-page-form-526ez-confirmation">
      <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--3">
        VA Form 21-526EZ submission received
      </h1>

      <va-alert status="success" uswds visible>
        <h2 slot="headline" className="vads-u-font-size--h4 vads-u-margin--0">
          We received the disability compensation claim
        </h2>
        <p className="vads-u-margin-y--0">
          We’re working on the claim you filed for {veteranName}.
        </p>
        {confirmationNumber && (
          <p className="vads-u-margin-y--0">
            <strong>Confirmation number:</strong> {confirmationNumber}
          </p>
        )}
        {formattedDate && (
          <p className="vads-u-margin-y--0">
            <strong>Submitted on:</strong> {formattedDate}
          </p>
        )}
      </va-alert>

      {Array.isArray(disabilities) && disabilities.length > 0 && (
        <section className="vads-u-margin-top--4">
          <h2 className="vads-u-font-size--h4">Claimed conditions</h2>
          <ul className="vads-u-padding-left--3">
            {disabilities.map((disability, index) => (
              <li key={disability.name || index} className="vads-u-margin-bottom--1">
                <strong>{disability.name || disability.condition}</strong>
                {disability.disabilityActionType && (
                  <span className="vads-u-display--block vads-u-color--gray-dark">
                    Action: {disability.disabilityActionType}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="vads-u-margin-top--4">
        <h2 className="vads-u-font-size--h4">What to expect next</h2>
        <ul className="vads-u-padding-left--3">
          <li>
            We’ll send a confirmation email to the representative email address
            on file.
          </li>
          <li>
            We’ll review the claim details and reach out if we need more
            information.
          </li>
          <li>
            You can check the status or download the submission receipt from the
            submissions list.
          </li>
        </ul>
      </section>

      <div className="vads-u-margin-top--4 vads-u-display--flex vads-u-flex-wrap--wrap">
        <va-button
          text="View all submissions"
          onClick={() => navigate('/submissions', { replace: true })}
          class="vads-u-margin-right--2 vads-u-margin-bottom--2"
        />
        <va-button
          text="Submit another 21-526EZ"
          onClick={() => navigate('/complete-form/21-526EZ', { replace: true })}
          class="vads-u-margin-bottom--2"
        />
      </div>
    </div>
  );
};

export default SinglePageForm526EZConfirmation;
