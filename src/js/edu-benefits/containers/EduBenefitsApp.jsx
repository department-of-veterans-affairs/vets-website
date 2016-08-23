import React from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';

import Nav from '../components/Nav';

class EduBenefitsApp extends React.Component {
  render() {
    let devPanel = undefined;
    if (__BUILDTYPE__ === 'development') {
      // using require here allows this code to be removed in prod
      let PerfPanel = require('./../components/debug/PerfPanel');
      // import PopulateVeteranButton from './debug/PopulateVeteranButton';
      let RoutesDropdown = require('./../components/debug/RoutesDropdown');
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

    const { panels, sections } = this.props.uiState;
    const currentLocation = this.props.currentLocation;

    return (
      <div className="row">
        {devPanel}
        <Nav sections={sections} panels={panels} currentUrl={currentLocation.pathname}/>
        <span className="js-test-location hidden" data-location={currentLocation.pathname} hidden></span>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    uiState: state.uiState,
    currentLocation: ownProps.location
  };
}

// Fill this in when we start using actions
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(EduBenefitsApp);
export { EduBenefitsApp };
