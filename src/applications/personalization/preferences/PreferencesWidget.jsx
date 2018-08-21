import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class PreferencesWidget extends React.Component {

  render() {
    return (
      <div className="row user-profile-row">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1 id="dashboard-title">Find VA Benefits</h1>
          <p>Tell us which benefits you're interested in, so we can help you apply. Select one or more of the types of benefits below, and we'll help you get started.</p>
          <Link to="/">Cancel</Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state,
  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesWidget);
export { PreferencesWidget };
