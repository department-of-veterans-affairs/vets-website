import React from 'react';
import Raven from 'raven-js';

// import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

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

const messageTemplate = (idSection) => (
  <div>
    <h3>We’ve received your application</h3>
    <p>Thank you for filing a claim for increased disability compensation.</p>
    {idSection}
    <p>You can check the status of your claim online. Please allow 24 hours for your increased disability claim to show up there.</p>
    <p><a href="/track-claims">Check the status of your claim.</a></p>
    <p>If you don’t see your increased disability claim online after 24 hours, please call Veterans Benefits Assistance at <a href="tel:+18008271000">1-800-827-1000</a>, Monday – Friday, 8:00 a.m. – 9:00 a.m. (ET).</p>
  </div>
);

const successMessage = (claimId) => messageTemplate(
  <div>
    <strong>Claim ID number</strong>
    <div>{claimId}</div>
  </div>
);

/* const checkLaterMessage = (jobId) => messageTemplate(
 *   <div>
 *     <strong>Confirmation number</strong>
 *     <div>{jobId}</div>
 *   </div>
 * );
 *
 * const errorMessage = (jobId) => (
 *   <div>
 *     <h3>Thank you for filing a claim for increased disability compensation.</h3>
 *     <strong>Confirmation number</strong>
 *     <div>{jobId}</div>
 *     <p>We're sorry. Something went wrong on our end when we tried to submit your application. For help, please call the Vets.gov Help Desk at <a href="tel:+18008271000">1-800-827-1000</a>, Monday – Friday, 8:00 a.m. – 9:00 a.m. (ET).</p>
 *   </div>
 * );
 *
 * const pendingMessage = (
 *   <AlertBox
 *     isVisible
 *     status="info"
 *     content="Please wait while we submit your application."/>
 * ); */

export default class ConfirmationPoll extends React.Component {
  static defaultProps = {
    pollRate: 5000
  }

  constructor(props) {
    super(props);

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

    // apiRequest(`/disability_compensation_form/submission_status/${this.props.jobId}`)
    apiRequest('/disability_compensation_form/submission_status/1f67ef1799012b1972d3772c')
      .then((response) => {
        // Check status
        const status = response.data.attributes.transactionStatus;
        if (status !== submissionStatuses.pending) {
          this.setState({
            submissionStatus: status,
            claimId: get('data.attributes.metadata.claimId', response) || null
          });
        } else {
          // Wait for 5 seconds and recurse
          setTimeout(this.poll, this.props.pollRate);
        }
      })
      .catch((response) => {
        // The call to the API failed; show a message or something
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
      case submissionStatuses.retry: {
        // What should we do here?
        return null;
      }
      case submissionStatuses.exhausted: {
        // TODO: What should we do here?
        return (
          <div>
            <p>This is taking a while; check back later.</p>
          </div>
        );
      }
      case submissionStatuses.failed: {
        // TODO: What should we do here?
        return (
          <div>
            <p>There was an error submitting to EVSS. Please try again later</p>
          </div>
        );
      }
      case submissionStatuses.apiFailure: {
        // What should we do here?
        Raven.captureMessage('526_submission_failure', {
          context: {
            statusCode: this.state.failureCode
          }
        });
        return (
          <div>
            <p>Looks like something went wrong. That's a bummer.</p>
          </div>
        );
      }
      default: {
        // pending
        return (
          <div>
            <p>Please wait while we submit your application.</p>
          </div>
        );
      }
    }
  }
}
