/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import formConfig from '../config/form';

// import { connect } from 'react-redux';
// import DowntimeNotification, {
//   externalServices,
// } from 'platform/monitoring/DowntimeNotification';

export default function RepresentativeApp({ children }) {
  return (
    <>
      <div>
        <div className="find-a-representative">{children}</div>
        <FormFooter formConfig={formConfig} />
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
