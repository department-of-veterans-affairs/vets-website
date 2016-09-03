import React from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';

import { withRouter } from 'react-router';

import { chapters, pages } from '../routes';

import Nav from '../components/Nav';
import NavButtons from '../components/NavButtons';

import PerfPanel from '../components/debug/PerfPanel';
import RoutesDropdown from '../components/debug/RoutesDropdown';

import { isValidPage } from '../utils/validations';
import { ensureSectionInitialized, updateCompletedStatus } from '../actions/index';

import NavHeader from '../components/NavHeader';

class EduBenefitsApp extends React.Component {
  render() {
    const { pageState, currentLocation, data, submission, router, dirtySection, setComplete } = this.props;
    const navigateTo = path => router.push(path);

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
          <Nav pages={pageState} chapters={chapters} currentUrl={currentLocation.pathname}/>
        </div>
        <div className="medium-8 columns">
          <div className="progress-box">
            <NavHeader path={currentLocation.pathname} chapters={chapters} className="show-for-small-only"/>
            {this.props.children}
            <NavButtons
                submission={submission}
                pages={pages}
                path={currentLocation.pathname}
                isValid={isValidPage(currentLocation.pathname, data)}
                dirtySection={dirtySection}
                onNavigate={navigateTo}
                onComplete={setComplete}/>
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
    dirtySection(page) {
      dispatch(ensureSectionInitialized(page));
    },
    setComplete(page) {
      dispatch(updateCompletedStatus(page));
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EduBenefitsApp));
export { EduBenefitsApp };
