import React from 'react';
import { connect } from 'react-redux';

function CoronavirusVaccinationApp({ user: _user, children }) {
  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-content vads-u-margin-bottom--3">
        <h1>Request a COVID-19 vaccination</h1>
        {children}
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoronavirusVaccinationApp);
export { CoronavirusVaccinationApp };
