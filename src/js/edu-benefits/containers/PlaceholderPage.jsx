import React from 'react';

import { connect } from 'react-redux';

class PlaceholderPage extends React.Component {
  render() {
    const { currentLocation } = this.props;

    return (
      <div className="form-panel">
        {currentLocation}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentLocation: ownProps.location.pathname
  };
}

// Fill this in when we start using actions
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceholderPage);
export { PlaceholderPage };
