import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import ConfirmationPage from '../containers/ConfirmationPage';
import { pendingMessage } from '../content/confirmation-poll';

import { submissionStatuses, terminalStatuses } from '../constants';
import { isBDD } from '../utils';

export class ConfirmationPoll extends React.Component {
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
    )
      .then(response => {
        // Don't process the request once it comes back if the component is no longer mounted
        if (!this.__isMounted) {
          return;
        }

        // Check status
        const { status } = response.data.attributes;
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
          if (Date.now() - this.startTime >= this.props.longWaitTime) {
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

        if (Date.now() - this.startTime < this.props.delayFailure) {
          // Page may return 404 immediately
          setTimeout(this.poll, this.props.pollRate);
        } else {
          this.setState({
            submissionStatus: submissionStatuses.apiFailure,
            // NOTE: I don't know that it'll always take this shape.
            failureCode: get('errors[0].status', response),
          });
        }
      });
  };

  render() {
    const { submissionStatus, claimId } = this.state;
    if (submissionStatus === submissionStatuses.pending) {
      setTimeout(() => focusElement('.loading-indicator-container'));
      return pendingMessage(this.state.longWait);
    }

    const {
      fullName,
      disabilities,
      submittedAt,
      jobId,
      isSubmittingBDD,
    } = this.props;

    setTimeout(() => focusElement('h2'));
    return (
      <ConfirmationPage
        submissionStatus={submissionStatus}
        claimId={claimId}
        jobId={jobId}
        fullName={fullName}
        disabilities={disabilities}
        submittedAt={submittedAt}
        isSubmittingBDD={isSubmittingBDD}
      />
    );
  }
}

export const selectAllDisabilityNames = createSelector(
  state => state.form.data.ratedDisabilities,
  state => state.form.data.newDisabilities,
  (ratedDisabilities = [], newDisabilities = []) =>
    ratedDisabilities
      .filter(disability => disability['view:selected'])
      .concat(newDisabilities)
      .map(disability => disability.name || disability.condition),
);

function mapStateToProps(state) {
  return {
    fullName: state.user.profile.userFullName,
    disabilities: selectAllDisabilityNames(state),
    submittedAt: state.form.submission.timestamp,
    jobId: state.form.submission.response?.attributes?.jobId,
    isSubmittingBDD: isBDD(state.form.data) || false,
  };
}

ConfirmationPoll.propTypes = {
  delayFailure: PropTypes.number,
  disabilities: PropTypes.array,
  fullName: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
  }),
  isSubmittingBDD: PropTypes.bool,
  jobId: PropTypes.string,
  longWaitTime: PropTypes.number,
  pollRate: PropTypes.number,
  submittedAt: PropTypes.object,
};

// Using it as a prop for easy testing
ConfirmationPoll.defaultProps = {
  pollRate: 5000,
  delayFailure: 6000, // larger than pollRate
  longWaitTime: 30000,
};

export default connect(mapStateToProps)(ConfirmationPoll);
