import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

import { submissionStatuses } from '../constants';
import {
  retryableErrorContent,
  successfulSubmitContent,
  submitErrorContent,
} from '../content/confirmation-page';
import { connect } from 'react-redux';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
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
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
