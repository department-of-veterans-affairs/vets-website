import React from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';

import { withRouter } from 'react-router';

import Nav from '../components/Nav';
import NavButtons from '../components/NavButtons';

import PerfPanel from '../components/debug/PerfPanel';
import RoutesDropdown from '../components/debug/RoutesDropdown';

import { isValidSection } from '../utils/validations';
import { ensureFieldsInitialized, updateCompletedStatus } from '../actions/index';

class EduBenefitsApp extends React.Component {
  render() {
    const { panels, sections } = this.props.uiState;
    const { currentLocation, data, submission, router, dirtyFields, setComplete } = this.props;
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
          <Nav sections={sections} panels={panels} currentUrl={currentLocation.pathname}/>
        </div>
        <div className="medium-8 columns">
          <div className="progress-box">
            {this.props.children}
            <NavButtons
                submission={submission}
                path={currentLocation.pathname}
                isValid={isValidSection(currentLocation.pathname, data)}
                dirtyFields={dirtyFields}
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
    uiState: state.uiState,
    currentLocation: ownProps.location,
    data: state.veteran,
    submission: state.uiState.submission,
    router: ownProps.router
  };
}

// Fill this in when we start using actions
function mapDispatchToProps(dispatch) {
  return {
    dirtyFields(section) {
      dispatch(ensureFieldsInitialized(section));
    },
    setComplete(section) {
      dispatch(updateCompletedStatus(section));
    }
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EduBenefitsApp));
export { EduBenefitsApp };
