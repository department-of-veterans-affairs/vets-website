import React from 'react';
import PropTypes from 'prop-types';

// import { connect } from 'react-redux';
// import DowntimeNotification, {
//   externalServices,
// } from 'platform/monitoring/DowntimeNotification';

export default function RepresentativeApp({ children }) {
  const renderBreadcrumbs = () => {
    return [
      <a href="/" key="home">
        Home
      </a>,
      <a href="/" key="disability">
        Disability
      </a>,
      <a href="/" key="disability">
        Find an Accredited Representative
      </a>,
    ];
  };

  return (
    <>
      <div>
        <va-breadcrumbs>{renderBreadcrumbs()}</va-breadcrumbs>
        <div className="row">
          <div className="find-a-representative">{children}</div>
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
