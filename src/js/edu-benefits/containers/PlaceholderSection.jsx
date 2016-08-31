import React from 'react';

import { connect } from 'react-redux';

import NavHeader from '../components/NavHeader';
import { groupPagesIntoChapters } from '../utils/chapters';
import routes from '../routes';
class PlaceholderSection extends React.Component {
  render() {
    const { currentLocation } = this.props;
    const chapters = groupPagesIntoChapters(routes);

    return (
      <div className="form-panel">
        <NavHeader path={currentLocation} chapters={chapters} className="show-for-small-only"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaceholderSection);
export { PlaceholderSection };
