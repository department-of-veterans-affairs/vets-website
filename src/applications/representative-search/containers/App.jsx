import React from 'react';
import PropTypes from 'prop-types';
import GetFormHelp from '../components/GetFormHelp';

// import { connect } from 'react-redux';
// import DowntimeNotification, {
//   externalServices,
// } from 'platform/monitoring/DowntimeNotification';

export default function App({ children }) {
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

// const mapStateToProps = state => {
//   return {
//     selectedResult: state.searchResult.selectedResult,
//     searchQuery: state.searchQuery,
//     results: state.searchResult.results,
//   };
// };

// export default connect(
//   mapStateToProps,
//   null,
// )(App);
