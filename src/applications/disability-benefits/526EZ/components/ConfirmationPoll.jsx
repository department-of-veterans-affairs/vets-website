import React from 'react';
import Raven from 'raven-js';

import { apiRequest } from '../../../../platform/utilities/api';

export const submissionStatuses = {
  // The status returned by the API
  pending: 'pending',
  retry: 'retry',
  succeeded: 'succeeded',
  failed: 'failed',
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
      confirmationNumber: null,
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

    apiRequest('')
      .then((response) => {
        // Check status
        // TODO: Get where this actually comes from in the response
        if (response.status !== submissionStatuses.pending) {
          this.setState({
            submissionStatus: response.status,
            // TODO: Get where this actually comes from in the response
            confirmationNumber: response.confirmationNumber || null
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
          failureCode: response.errors[0].status
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
            {this.state.confirmationNumber}
          </div>
        );
      }
      case submissionStatuses.failed: {
        // What should we do here?
        return null;
      }
      case submissionStatuses.apiFailure: {
        // What should we do here?
        Raven.captureMessage('526_submission_failure', {
          context: {
            statusCode: this.state.failureCode
          }
        });
        return null;
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
