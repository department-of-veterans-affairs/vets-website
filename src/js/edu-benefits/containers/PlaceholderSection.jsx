import React from 'react';

import { connect } from 'react-redux';

import NavButtons from '../components/NavButtons';
import { isValidSection } from '../utils/validations';
import { withRouter } from 'react-router';

class PlaceholderSection extends React.Component {
  render() {
    const { currentLocation, data, submission, router } = this.props;
    const navigateTo = path => {
      return router.push(path);
    };

    return (
      <div className="form-panel">
        {currentLocation}
        <NavButtons
            submission={submission}
            path={currentLocation}
            isValid={isValidSection(currentLocation, data)}
            onNavigate={navigateTo}
            onComplete={() => null}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.veteran,
    section: state.uiState.sections[ownProps.location.pathname],
    submission: state.uiState.submission,
    currentLocation: ownProps.location.pathname,
    router: ownProps.router
  };
}

// Fill this in when we start using actions
function mapDispatchToProps() {
  return {};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlaceholderSection));
export { PlaceholderSection };
