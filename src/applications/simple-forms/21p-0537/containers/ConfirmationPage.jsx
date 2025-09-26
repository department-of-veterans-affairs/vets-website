import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { format } from 'date-fns';

function ConfirmationPage({ form }) {
  const { submission = {}, data = {} } = form || {};
  const submitDate = submission?.timestamp
    ? format(new Date(submission.timestamp), 'MMMM d, yyyy')
    : format(new Date(), 'MMMM d, yyyy');

  return (
    <div className="confirmation-page">
      <va-alert status="success" uswds>
        <h2 slot="headline">
          We've received your marital status questionnaire
        </h2>
      </va-alert>

      <div className="inset">
        <h3>Your submission information</h3>
        <p>
          <strong>Date submitted:</strong> {submitDate}
        </p>
        {submission?.confirmationId && (
          <p>
            <strong>Confirmation number:</strong> {submission.confirmationId}
          </p>
        )}
        <p>
          <strong>Form submitted:</strong> VA Form 21P-0537 (Marital Status
          Questionnaire)
        </p>
      </div>

      <h3>What happens next?</h3>
      <p>
        We'll review your response to verify your continued eligibility for DIC
        benefits.
      </p>

      {data?.hasRemarried === false ? (
        <p>
          Since you indicated that you have not remarried, your DIC benefits
          should continue without interruption. We'll contact you if we need any
          additional information.
        </p>
      ) : (
        <>
          <p>
            Since you indicated that you have remarried, we'll review your
            information to determine your continued eligibility for DIC benefits
            based on:
          </p>
          <ul>
            <li>Your age at the time of remarriage</li>
            <li>Whether the remarriage has been terminated</li>
          </ul>
          <p>
            We'll send you a letter with our determination. If we determine that
            you're no longer eligible for DIC benefits, the letter will explain
            your appeal rights.
          </p>
        </>
      )}

      <h3>How to contact us if you have questions</h3>
      <p>
        If you have questions about your DIC benefits or this form submission:
      </p>
      <ul>
        <li>
          <strong>Call us:</strong> 1-877-294-6380 (TTY: 711)
          <br />
          Monday through Friday, 8:00 a.m. to 9:00 p.m. ET
        </li>
        <li>
          <strong>Submit an inquiry online:</strong>{' '}
          <a
            href="https://iris.va.gov"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://iris.va.gov
          </a>
        </li>
      </ul>

      <div className="help-footer-box">
        <h3>Need a copy of your submission?</h3>
        <p>
          You can print this confirmation page for your records. If you need a
          copy of your submitted form, please contact us using the information
          above and reference your confirmation number.
        </p>
        <va-button text="Print this page" onClick={() => window.print()} />
      </div>

      <p>
        <a href="/">Go back to VA.gov</a>
      </p>
    </div>
  );
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      hasRemarried: PropTypes.bool,
    }),
    submission: PropTypes.shape({
      confirmationId: PropTypes.string,
      timestamp: PropTypes.string,
    }),
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
