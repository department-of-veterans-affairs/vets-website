import React from 'react';
import Raven from 'raven-js';

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

    apiRequest(`disability_compensation_form/submission_status/${this.props.jobId}`)
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
      case submissionStatuses.retry: {
        // What should we do here?
        return <p><strong>This is taking a while.</strong> Please check on the Claims Status tool later.</p>;
      }
      case submissionStatuses.succeeded: {
        return (
          <div>
            <strong>Confirmation number</strong>
            <br/>
            {this.state.claimId}
          </div>
        );
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
