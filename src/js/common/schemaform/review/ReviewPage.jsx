import PropTypes from 'prop-types';
import Raven from 'raven-js';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import recordEvent from '../../../../platform/monitoring/record-event';

import ReviewCollapsibleChapter from './ReviewCollapsibleChapter';
import SubmitButtons from './SubmitButtons';
import PrivacyAgreement from '../../../../platform/forms/components/PrivacyAgreement';

import { focusElement } from '../../../../platform/utilities/ui';
import { getActivePages } from '../../../../platform/forms/helpers';
import { createPageListByChapter, expandArrayPages, getPageKeys, getActiveChapters } from '../helpers';
import { getReviewPageOpenChapters } from '../state/selectors';

import ReviewChapters from '../review/ReviewChapters';
import SubmitController from '../review/SubmitController';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class ReviewPage extends React.Component {
  componentDidMount() {
    scrollToTop();
    focusElement('h4');
  }

  render() {
    const {
      form,
      formConfig,
      location,
      pageList,
      path,
    } = this.props;

    return (
      <div>
        <ReviewChapters
          formConfig={formConfig}
          pageList={pageList}/>
        <SubmitController
          formConfig={formConfig}
          pageList={pageList}
          path={path}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const route = ownProps.route;
  const {
    formConfig,
    pageList,
    path,
  } = route;

  const { form } = state;

  return {
    form,
    formConfig,
    pageList,
    path,
    route
  };
}

const mapDispatchToProps = {
};

ReviewPage.propTypes = {
  form: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired
  }).isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewPage));

export { ReviewPage };
