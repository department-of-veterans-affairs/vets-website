import React from 'react';
import PropTypes from 'prop-types';

import {
  focusElement,
  scrollToTop,
} from '@department-of-veterans-affairs/platform-utilities/ui';

import {
  submissionStatuses,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SAVED_SEPARATION_DATE,
} from '../constants';
import {
  retryableErrorContent,
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
      case submissionStatuses.exhausted:
      case submissionStatuses.apiFailure:
        return retryableErrorContent(this.props);
      default:
        return submitErrorContent(this.props);
    }
  }
}

ConfirmationPage.propTypes = {
  disabilities: PropTypes.array.isRequired,
  fullName: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
    middle: PropTypes.string,
    suffix: PropTypes.string,
  }).isRequired,
  submittedAt: PropTypes.string.isRequired,
  claimId: PropTypes.string,
  isSubmittingBDD: PropTypes.bool,
  jobId: PropTypes.string,
  submissionId: PropTypes.string,
  submissionStatus: PropTypes.oneOf(Object.values(submissionStatuses)),
};
