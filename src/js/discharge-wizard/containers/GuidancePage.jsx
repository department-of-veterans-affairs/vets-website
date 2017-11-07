import { connect } from 'react-redux';
import React from 'react';

class GuidancePage extends React.Component {
  render() {
    return (
      <div className="discharge-wizard">
        <nav className="va-nav-breadcrumbs">
          <ul className="row va-nav-breadcrumbs-list columns" role="menubar" aria-label="Primary">
            <li><a href="/">Home</a></li>
            <li><a href="/discharge-wizard">Discharge</a></li>
            <li><strong>Guidance</strong></li>
          </ul>
        </nav>
        <div className="row">
          <div className="columns small-12">
            <h1>Upgrading Your Discharge Status: What to know</h1>
            <div className="medium-8">
              Result
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formValues: state.dischargeWizard.form,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GuidancePage);
