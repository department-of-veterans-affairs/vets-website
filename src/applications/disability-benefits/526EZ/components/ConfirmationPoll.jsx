import React from 'react';
import Raven from 'raven-js';

const statuses = {
  // The status returned by the API
  pending: 'pending',
  retry: 'retry',
  succeeded: 'succeeded',
  failed: 'failed',
  // When the api serves a failure
  apiFailure: 'apiFailure'
};

export class ConfirmationPoll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submissionStatus: statuses.pending,
      confirmationNumber: null,
      failureCode: null,
    };
  }

  componentDidMount() {
    this.poll();
  }

  poll() {
    fetch()
      .then((response) => {
        // Check status
        // TODO: Get where this actually comes from in the response
        if (response.status !== statuses.pending) {
          this.setState({
            submissionStatus: response.status,
            // TODO: Get where this actually comes from in the response
            confirmationNumber: response.confirmationNumber || null
          });
        } else {
          // Wait for 5 seconds and recurse
          setTimeout(this.poll, 5000);
        }
      })
      .catch((response) => {
        // console.log('API call failed:', response);
        // The call to the API failed; show a message or something
        this.setState({
          submissionStatus: statuses.apiFailure,
          // TODO: Make sure this is the right variable
          failureCode: response.code
        });
      });
  }

  render() {
    switch (this.state.submissionStatus) {
      case statuses.retry: {
        // What should we do here?
        return null;
      }
      case statuses.succeeded: {
        return (
          <div>
            <strong>Confirmation number</strong>
            <br/>
            {this.state.confirmationNumber}
          </div>
        );
      }
      case statuses.failed: {
        return null;
      }
      case statuses.apiFailure: {
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
            <strong>Confirmation number goes here</strong>
          </div>
        );
      }
    }
  }
}
