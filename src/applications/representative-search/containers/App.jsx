import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GetFormHelp from '../components/GetFormHelp';

// import DowntimeNotification, {
//   externalServices,
// } from 'platform/monitoring/DowntimeNotification';

function App({ children }) {
  return (
    <>
      <div className="find-a-representative vads-u-margin-x--3">
        <div className="row">{children}</div>
        <div className="row">
          <div className="usa-grid usa-width-three-fourths">
            <GetFormHelp />
          </div>
        </div>
      </div>
    </>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedResult: state.searchResult.selectedResult,
    searchQuery: state.searchQuery,
    results: state.searchResult.results,
  };
}

export default connect(
  mapStateToProps,
  null,
)(App);
