import React from 'react';
import { connect } from 'react-redux';

import get from '../../../../platform/utilities/data/get';
import { apiRequest } from '../../../../platform/utilities/api';

import ConfirmationPage from '../containers/ConfirmationPage';
import { pendingMessage } from '../content/confirmation-poll';

import { submissionStatuses, terminalStatuses } from '../constants';

export class ConfirmationPoll extends React.Component {
  // Using it as a prop for easy testing
  static defaultProps = {
    pollRate: 5000,
  };

  constructor(props) {
    super(props);

    this.state = {
      submissionStatus: submissionStatuses.pending,
      claimId: null,
      failureCode: null,
      longWait: false,
    };
  }

  componentDidMount() {
    // Using __ because it fails the unit test without it; something about enzyme using that property, I'm sure
    this.__isMounted = true;
    this.startTime = Date.now();
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

    apiRequest(
      `/disability_compensation_form/submission_status/${this.props.jobId}`,
      {},
      response => {
        // Don't process the request once it comes back if the component is no longer mounted
        if (!this.__isMounted) {
          return;
        }

        // Check status
        const status = response.data.attributes.transactionStatus;
        if (terminalStatuses.has(status)) {
          this.setState({
            submissionStatus: status,
            claimId: get('data.attributes.metadata.claimId', response) || null,
          });
        } else {
          // Wait for a bit and recurse
          const waitTime =
            status === submissionStatuses.pending
              ? this.props.pollRate
              : this.props.pollRate * 2; // Seems like we don't need to poll as frequently when we get here

          // Force a re-render to update the pending message if necessary
          if (Date.now() - this.startTime >= 30000) {
            this.setState({ longWait: true });
          }
          setTimeout(this.poll, waitTime);
        }
      },
      response => {
        // Don't process the request once it comes back if the component is no longer mounted
        if (!this.__isMounted) {
          return;
        }

        this.setState({
          submissionStatus: submissionStatuses.apiFailure,
          // NOTE: I don't know that it'll always take this shape.
          failureCode: get('errors[0].status', response),
        });
      },
    );
  };

  render() {
    const { submissionStatus, claimId } = this.state;
    if (submissionStatus === submissionStatuses.pending) {
      return pendingMessage(this.state.longWait);
    }

    const { fullName, disabilities, submittedAt, jobId } = this.props;

    return (
      <ConfirmationPage
        submissionStatus={submissionStatus}
        claimId={claimId}
        jobId={jobId}
        fullName={fullName}
        disabilities={disabilities}
        submittedAt={submittedAt}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    fullName: state.user.profile.userFullName,
    disabilities: state.form.data.disabilities,
    submittedAt: state.form.submission.submittedAt,
    jobId: state.form.submission.response.attributes.jobId,
  };
}

export default connect(mapStateToProps)(ConfirmationPoll);
