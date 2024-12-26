import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getProviderSpecialties } from '../actions';

function LoadingIndicatorOrShow({
  children,
  serviceType = '',
  currentQuery,
  ...dispatchProps
}) {
  useEffect(
    () => {
      switch (serviceType) {
        case 'ppms_services':
          dispatchProps.getProviderSpecialties();
          break;
        case 'vamc_services':
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceType],
  );
  if (currentQuery.fetchSvcsInProgress) {
    return <VaLoadingIndicator message="Loading services" />;
  }
  return children;
}

LoadingIndicatorOrShow.propTypes = {
  children: PropTypes.node,
  currentQuery: PropTypes.object,
  serviceType: PropTypes.string,
};

const mapDispatch = { getProviderSpecialties };

const mapStateToProps = state => {
  return {
    currentQuery: state.searchQuery,
  };
};

export default connect(
  mapStateToProps,
  mapDispatch,
)(LoadingIndicatorOrShow);
