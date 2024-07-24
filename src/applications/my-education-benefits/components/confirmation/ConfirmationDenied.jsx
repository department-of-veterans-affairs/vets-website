import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LETTER_URL } from '../../constants';
import LoadingIndicator from '../LoadingIndicator';
import FormFooter from '../FormFooter';

const ConfirmationDenied = ({
  claimantName,
  confirmationDate,
  confirmationError,
  confirmationLoading,
  printPage,
  sendConfirmation,
  userEmail,
  userFirstName,
}) => {
  useEffect(
    () => {
      sendConfirmation({
        claimStatus: 'DENIED',
        email: userEmail,
        firstName: userFirstName,
      });
    },
    [sendConfirmation, userEmail, userFirstName],
  );

  if (confirmationLoading) {
    return <LoadingIndicator message="Sending confirmation email..." />;
  }

  if (confirmationError) {
    return (
      <div>Error sending confirmation email: {confirmationError.message}</div>
    );
  }
  return (
    <div className="meb-confirmation-page meb-confirmation-page_denied">
      <va-alert status="info">
        <h3 slot="headline">You’re not eligible for this benefit</h3>
        <p>
          Unfortunately, based on the information you provided and Department of
          Defense records, we have determined you are not eligible for the
          Post-9/11 GI Bill program at this time.
        </p>
        <p>
          Your denial letter, which explains why you are ineligible, is now
          available. A physical copy will also be mailed to your mailing
          address.{' '}
        </p>
        <a
          type="button"
          className="usa-button meb-print"
          href={LETTER_URL}
          download
        >
          Download your letter
        </a>
      </va-alert>

      <div className="feature">
        <h3>Application for VA education benefits (Form 22-1990)</h3>
        {claimantName.trim() ? <p>For {claimantName}</p> : <></>}
        <dl>
          <dt>Date received</dt>
          <dd>{confirmationDate}</dd>
        </dl>
        <va-button
          uswds
          className="usa-button meb-print"
          text="Print this page"
          onClick={printPage}
        />
      </div>

      <h2>What happens next?</h2>
      <ul>
        <li>
          Download a copy of your{' '}
          <a href={LETTER_URL} download>
            Denial Letter
          </a>
        </li>
        <li>
          We will review your eligibility for other VA education benefit
          programs.
        </li>
        <li>
          You will be notified if you are eligible for other VA education
          benefits.
        </li>
        <li>There is no further action required by you at this time.</li>
      </ul>

      <a className="vads-c-action-link--green" href="/my-va/">
        Go to your My VA dashboard
      </a>

      <FormFooter />
    </div>
  );
};

ConfirmationDenied.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  printPage: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
  confirmationError: PropTypes.bool,
  confirmationLoading: PropTypes.bool,
};

ConfirmationDenied.defaultProps = {
  confirmationError: null,
  confirmationLoading: false,
};

export default ConfirmationDenied;
