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
  name: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
    middle: PropTypes.string,
    suffix: PropTypes.string,
  }).isRequired,
  submittedAt: PropTypes.string.isRequired,
  jobId: PropTypes.string,
  response: PropTypes.shape,
};
