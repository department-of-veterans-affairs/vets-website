import React from 'react';
import Raven from 'raven-js';
import sinon from 'sinon';

// import { apiRequest } from '../../../../platform/utilities/api';

const statuses = {
  // The status returned by the API
  pending: 'pending',
  retry: 'retry',
  succeeded: 'succeeded',
  failed: 'failed',
  // When the api serves a failure
  apiFailure: 'apiFailure'
};

const pendingResponse = Promise.resolve({ status: statuses.pending });
// const successResponse = Promise.resolve({
//   status: statuses.succeeded,
//   confirmationNumber: '123abc'
// });
const failureResponse = Promise.resolve({ status: statuses.failed });

const apiRequest = sinon.stub();
apiRequest.onCall(0).returns(pendingResponse);
apiRequest.onCall(1).returns(failureResponse);

export default class ConfirmationPoll extends React.Component {
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

  poll = () => {
    apiRequest('')
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
        // The call to the API failed; show a message or something
        this.setState({
          submissionStatus: statuses.apiFailure,
          // NOTE: I don't know that it'll always take this shape.
          failureCode: response.errors[0].status
        });
      });
  }

  render() {
    switch (this.state.submissionStatus) {
      case statuses.retry: {
        // What should we do here?
        return <p><strong>This is taking a while.</strong> Please check on the Claims Status tool later.</p>;
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
        // What should we do here?
        return null;
      }
      case statuses.apiFailure: {
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
