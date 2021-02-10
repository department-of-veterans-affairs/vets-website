import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

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

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export default class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }

  componentDidMount() {
    focusElement('.usa-alert-body > h2');
    scrollToTop();
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
  areConfirmationEmailTogglesOn: PropTypes.bool.isRequired,
};

ConfirmationPage.defaultProps = {
  areConfirmationEmailTogglesOn: false,
};
