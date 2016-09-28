import React from 'react';
import _ from 'lodash';
import Scroll from 'react-scroll';

import { connect } from 'react-redux';

import { withRouter } from 'react-router';

import { chapters, pages } from '../routes';

import Nav from '../../common/components/Nav';
import NavButtons from '../../common/components/NavButtons';
import NavHeader from '../../common/components/NavHeader';

import PerfPanel from '../components/debug/PerfPanel';
import RoutesDropdown from '../components/debug/RoutesDropdown';

import { isValidPage, isValidForm } from '../utils/validations';
import { ensurePageInitialized, updateCompletedStatus, submitForm } from '../actions/index';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

class EduBenefitsApp extends React.Component {
  componentWillReceiveProps(nextProps) {
    const a = nextProps.submission.status;
    const b = this.props.submission.status;
    if (a !== b && a === 'applicationSubmitted') {
      this.props.router.push('/submit-message');
      scrollToTop();
    }
  }
  render() {
    const { pageState, currentLocation, data, submission, router, dirtyPage, setComplete, submitBenefitsForm } = this.props;
    const navigateTo = path => router.push(path);
    const onSubmit = () => {
      submitBenefitsForm(this.props.data);
    };

    let devPanel = undefined;
    if (__BUILDTYPE__ === 'development') {
      const queryParams = _.fromPairs(
        window.location.search.substring(1).split('&').map((v) => { return v.split('='); }));
      if (queryParams.devPanel === '1') {
        devPanel = (
          <div className="row">
            <RoutesDropdown/>
            <PerfPanel/>
          </div>
        );
      }
    }

    return (
      <div className="row">
        {devPanel}
        <div className="medium-4 columns show-for-medium-up">
          <Element name="topScrollElement"/>
          <Nav
              data={data}
              pages={pageState}
              chapters={chapters}
              currentUrl={currentLocation.pathname}/>
        </div>
        <div className="medium-8 columns">
          <div className="progress-box">
            <NavHeader path={currentLocation.pathname} chapters={chapters} className="show-for-small-only"/>
            {this.props.children}
            <NavButtons
                data={data}
                submission={submission}
                pages={pages}
                path={currentLocation.pathname}
                isValid={isValidPage(currentLocation.pathname, data)}
                canSubmit={isValidForm(data)}
                dirtyPage={dirtyPage}
                onNavigate={navigateTo}
                onComplete={setComplete}
                onSubmit={onSubmit}/>
          </div>
        </div>
        <span className="js-test-location hidden" data-location={currentLocation.pathname} hidden></span>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    pageState: state.uiState.pages,
    currentLocation: ownProps.location,
    data: state.veteran,
    submission: state.uiState.submission,
    router: ownProps.router
  };
}

// Fill this in when we start using actions
function mapDispatchToProps(dispatch) {
  return {
    dirtyPage(page) {
      dispatch(ensurePageInitialized(page));
    },
    setComplete(page) {
      dispatch(updateCompletedStatus(page));
    },
    submitBenefitsForm(...args) {
      dispatch(submitForm(...args));
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EduBenefitsApp));
export { EduBenefitsApp };
