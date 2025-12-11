import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import get from '@department-of-veterans-affairs/platform-forms-system/get';
import { apiRequest } from 'platform/utilities/api';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import ConfirmationPage from '../containers/ConfirmationPage';

import { submissionStatuses, terminalStatuses } from '../constants';
import { isBDD } from '../utils';

export class ConfirmationPoll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submissionStatus: submissionStatuses.pending,
      claimId: null,
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

          setTimeout(this.poll, waitTime);
        }
      })
      .catch(() => {
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
          });
        }
      });
  };

  render() {
    const { submissionStatus, claimId } = this.state;
    if (submissionStatus === submissionStatuses.pending) {
      return (
        <va-loading-indicator
          message="Preparing your submission. This may take up to 30 seconds. Please don’t refresh the page."
          set-focus
        />
      );
    }

    const {
      fullName,
      disabilities,
      submittedAt,
      jobId,
      isSubmittingBDD,
      route,
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
        route={route}
      />
    );
  }
}

const getDisabilityLabel = disability => {
  if (!disability) return '';

  if (typeof disability === 'string') {
    return disability.trim();
  }

  if (typeof disability !== 'object') {
    return '';
  }

  const name =
    typeof disability.name === 'string' ? disability.name.trim() : '';
  const condition =
    typeof disability.condition === 'string' ? disability.condition.trim() : '';
  const rated =
    typeof disability.ratedDisability === 'string'
      ? disability.ratedDisability.trim()
      : '';
  const side =
    typeof disability.sideOfBody === 'string'
      ? disability.sideOfBody.trim()
      : '';

  if (condition.toLowerCase() === 'rated disability' && rated) {
    return rated;
  }

  const isNewDisability = !disability['view:selected'];

  if (isNewDisability && condition) {
    const sideSuffix = side ? `, ${side.toLowerCase()}` : '';
    return `${condition}${sideSuffix}`;
  }

  return name || condition || rated;
};

export const selectAllDisabilityNames = createSelector(
  state => state.form.data.ratedDisabilities,
  state => state.form.data.newDisabilities,
  (ratedDisabilities = [], newDisabilities = []) =>
    ratedDisabilities
      .filter(d => d && d['view:selected'])
      .concat(newDisabilities || [])
      .map(getDisabilityLabel)
      .filter(name => name),
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
  pollRate: PropTypes.number,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  submittedAt: PropTypes.object,
};

// Using it as a prop for easy testing
ConfirmationPoll.defaultProps = {
  pollRate: 5000,
  delayFailure: 6000, // larger than pollRate
};

export default connect(mapStateToProps)(ConfirmationPoll);
