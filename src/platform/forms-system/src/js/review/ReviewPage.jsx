import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { focusElement } from '../utilities/ui';
import ReviewChapters from '../review/ReviewChapters';
import SubmitController from '../review/SubmitController';

const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo(
    'topScrollElement',
    window.Forms?.scroll || {
      duration: 500,
      delay: 0,
      smooth: true,
    },
  );
};

class ReviewPage extends React.Component {
  componentDidMount() {
    scrollToTop();
    focusElement('h2');
  }

  render() {
    const { formConfig, pageList, path } = this.props;

    return (
      <div>
        <ReviewChapters formConfig={formConfig} pageList={pageList} />
        <SubmitController
          formConfig={formConfig}
          pageList={pageList}
          path={path}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const route = ownProps.route;
  const { formConfig, pageList, path } = route;

  return {
    formConfig,
    pageList,
    path,
    route,
  };
}

const mapDispatchToProps = {};

ReviewPage.propTypes = {
  pageList: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  route: PropTypes.shape({
    formConfig: PropTypes.object.isRequired,
  }).isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ReviewPage),
);

export { ReviewPage };
