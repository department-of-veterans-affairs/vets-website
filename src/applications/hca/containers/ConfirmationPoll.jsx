import React from 'react';
import { connect } from 'react-redux';

import get from 'platform/utilities/data/get';
import { apiRequest } from 'platform/utilities/api';

import ConfirmationPage from '../components/ConfirmationPage';
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

    apiRequest(`/health_care_applications/${this.props.id}`)
      .then(response => {
        // Don't process the request once it comes back if the component is no longer mounted
        if (!this.__isMounted) {
          return;
        }

        // Check status
        const status = response.data.attributes.status;
        if (terminalStatuses.has(status)) {
          this.setState({
            submissionStatus: status,
            claimId: get('data.attributes.claimId', response) || null,
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
      })
      .catch(response => {
        // Don't process the request once it comes back if the component is no longer mounted
        if (!this.__isMounted) {
          return;
        }

        this.setState({
          submissionStatus: submissionStatuses.apiFailure,
          // NOTE: I don't know that it'll always take this shape.
          failureCode: get('errors[0].status', response),
        });
      });
  };

  render() {
    const { submissionStatus, claimId } = this.state;
    if (submissionStatus === submissionStatuses.pending) {
      return pendingMessage(this.state.longWait);
    }

    const { name, submittedAt, id, response, email } = this.props;

    return (
      <ConfirmationPage
        submissionStatus={submissionStatus}
        claimId={claimId}
        id={id}
        name={name}
        submittedAt={submittedAt}
        response={response}
        email={email}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    submittedAt: state.form.submission.submittedAt,
    id: state.form.submission.response.id,
    email: state.form.data.email,
    name: state.form.data.veteranFullName,
    response: state.form.submission.response,
  };
}

export default connect(mapStateToProps)(ConfirmationPoll);
