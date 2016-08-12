import React from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';

import { bindToActionCreators } from 'redux';

import { placeholderAction } from '../actions';

class EduBenefitsApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let devPanel = undefined;
    if (__BUILDTYPE__ === 'development') {
      //using require here allows this code to be removed in prod
      let PerfPanel = require('./debug/PerfPanel');
      //import PopulateVeteranButton from './debug/PopulateVeteranButton';
      let RoutesDropdown = require('./debug/RoutesDropdown');
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
      <div>
        {devPanel}
        Get your education benefits here!
        <span className="js-test-location hidden" data-location={this.props.location.pathname} hidden></span>
      </div>
    );
  }
}

EduBenefitsApp.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    placeholder: state.placeholder,
  };
}

function mapDispatchToProps(dispatch) {
  return bindToActionCreators({placeholderAction}, dispatch);
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(EduBenefitsApp);
export { EduBenefitsApp };
