import React from 'react';
import Raven from 'raven-js';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import get from '../../../../platform/utilities/data/get';

import { apiRequest } from '../../../../platform/utilities/api';

export const submissionStatuses = {
  // Statuses returned by the API
  pending: 'submitted', // Submitted to EVSS, waiting response
  retry: 'retrying',
  succeeded: 'received', // Submitted to EVSS, received response
  exhausted: 'exhausted', // EVSS is down or something; ran out of retries
  failed: 'non_retryable_error', // EVSS responded with some error
  // When the api serves a failure
  apiFailure: 'apiFailure'
};

const terminalStatuses = [
  submissionStatuses.succeeded,
  submissionStatuses.exhausted,
  submissionStatuses.failed
];

const successMessage = (claimId) => (
  <div>
    <p>Thank you for filing a claim for increased disability compensation.</p>
    <strong>Claim ID number</strong>
    <div>{claimId}</div>
    <p>You can check the status of your claim online. Please allow 24 hours for your increased disability claim to show up there.</p>
    <p><a href="/track-claims">Check the status of your claim.</a></p>
    <p>If you don’t see your increased disability claim online after 24 hours, please call Veterans Benefits Assistance at <a href="tel:+18008271000">1-800-827-1000</a>, Monday – Friday, 8:00 a.m. – 9:00 a.m. (ET).</p>
  </div>
);

const checkLaterMessage = (jobId) => (
  <div>
    <p>Thank you for filing a claim for increased disability compensation.</p>
    <strong>Confirmation number</strong>
    <div>{jobId}</div>
    <p>You can check the status of your claim online. Please allow 24 hours for your increased disability claim to show up there.</p>
    <p><a href="/track-claims">Check the status of your claim.</a></p>
    <p>If you don’t see your increased disability claim online after 24 hours, please call Vets.gov Help Desk at <a href="tel:+18555747286">1-855-574-7286</a>, Monday – Friday, 8:00 a.m. – 9:00 a.m. (ET).</p>
  </div>
);

const errorMessage = (jobId) => (
  <div>
    <p>We're sorry. Something went wrong on our end when we tried to submit your application. For help, please call the Vets.gov Help Desk at <a href="tel:+18555747286">1-855-574-7286</a>, Monday – Friday, 8:00 a.m. – 9:00 a.m. (ET).</p>
    <strong>Confirmation number</strong>
    <div>{jobId}</div>
  </div>
);

const pendingMessage = (
  <AlertBox
    isVisible
    status="info"
    content="Please wait while we submit your application."/>
);

export default class ConfirmationPoll extends React.Component {
  static defaultProps = {
    pollRate: 5000
  }

  constructor(props) {
    super(props);

    this.__pollCount = 0;
    this.state = {
      submissionStatus: submissionStatuses.pending,
      claimId: null,
      failureCode: null,
    };
  }

  componentDidMount() {
    this.__isMounted = true;
    this.poll();
  }

  componentWillUnmount() {
    this.__isMounted = false;
  }

  poll = () => {
    // Don't continue to request after the component is unmounted
    if (!this.__isMounted) {
      return;
    }

    this.__pollCount++;

    // apiRequest(`/disability_compensation_form/submission_status/${this.props.jobId}`)
    apiRequest('/disability_compensation_form/submission_status/1f67ef1799012b1972d3772c')
      .then((response) => {
        // Check status
        const status = response.data.attributes.transactionStatus;
        if (terminalStatuses.includes(status)) {
          this.setState({
            submissionStatus: status,
            claimId: get('data.attributes.metadata.claimId', response) || null
          });
        } else {
          // Wait for a bit and recurse
          const waitTime = status === submissionStatuses.pending
            ? this.props.pollRate
            : this.props.pollRate * 2; // Seems like we don't need to poll as frequently when we get here
          setTimeout(this.poll, waitTime);
        }
      })
      .catch((response) => {
        // The call to the API failed
        Raven.captureMessage('526_submission_status_poll_failure', {
          context: {
            jobId: this.props.jobId,
            statusCode: this.state.failureCode
          }
        });

        this.setState({
          submissionStatus: submissionStatuses.apiFailure,
          // NOTE: I don't know that it'll always take this shape.
          failureCode: get('errors[0].status', response)
        });
      });
  }

  render() {
    switch (this.state.submissionStatus) {
      case submissionStatuses.succeeded:
        return successMessage(this.state.claimId);
      case submissionStatuses.retry:
      case submissionStatuses.exhausted:
      case submissionStatuses.apiFailure:
        return checkLaterMessage(this.props.jobId);
      case submissionStatuses.failed:
        return errorMessage(this.props.jobId);
      default:
        // pending
        return pendingMessage(this.__pollCount);
    }
  }
}
