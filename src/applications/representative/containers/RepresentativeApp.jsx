import React from 'react';
import PropTypes from 'prop-types';
import GetFormHelp from '../components/GetFormHelp';

// import { connect } from 'react-redux';
// import DowntimeNotification, {
//   externalServices,
// } from 'platform/monitoring/DowntimeNotification';

export default function RepresentativeApp({ children }) {
  return (
    <>
      <div className="find-a-representative">
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

RepresentativeApp.propTypes = {
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
// )(RepresentativeApp);
