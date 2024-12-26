import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { getProviderSpecialties } from '../actions';

function LoadingIndicatorOrShow({
  serviceType = '',
  // currentQuery,
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

  return null;
}

LoadingIndicatorOrShow.propTypes = {
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
