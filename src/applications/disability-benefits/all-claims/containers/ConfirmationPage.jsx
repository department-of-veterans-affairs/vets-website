import React from 'react';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

import {
  submissionStatuses,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../constants';
import {
  retryableErrorContent,
  exhaustedErrorContent,
  successfulSubmitContent,
  submitErrorContent,
} from '../content/confirmation-page';

export default class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }

  componentDidMount() {
    scrollToTop();
    setTimeout(() => focusElement('va-alert h2'), 100);
  }

  render() {
    // Reset everything
    sessionStorage.removeItem(WIZARD_STATUS);
    sessionStorage.removeItem(FORM_STATUS_BDD);
    sessionStorage.removeItem(SAVED_SEPARATION_DATE);

    switch (this.props.submissionStatus) {
      case submissionStatuses.succeeded:
        return successfulSubmitContent(this.props);
      case submissionStatuses.retry:
        return retryableErrorContent(this.props);
      case submissionStatuses.exhausted:
      case submissionStatuses.apiFailure:
        return exhaustedErrorContent(this.props);
      default:
        return submitErrorContent(this.props);
    }
  }
}

ConfirmationPage.propTypes = {
  submissionStatus: PropTypes.oneOf(Object.values(submissionStatuses)),
  fullName: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
    middle: PropTypes.string,
    suffix: PropTypes.string,
  }).isRequired,
  disabilities: PropTypes.array.isRequired,
  submittedAt: PropTypes.string.isRequired,
  claimId: PropTypes.string,
  jobId: PropTypes.string,
  submissionId: PropTypes.string,
};
