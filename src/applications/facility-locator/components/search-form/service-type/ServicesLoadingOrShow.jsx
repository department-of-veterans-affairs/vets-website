import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function ServicesLoadingOrShow({
  children,
  serviceType = '',
  currentQuery,
  ...dispatchProps
}) {
  const [loadingMessage, setLoadingMessage] = useState('Loading services');
  useEffect(
    () => {
      let ignore = false;
      if (ignore) return;
      switch (serviceType) {
        case 'ppms_services':
          setLoadingMessage('Loading community provider services');
          dispatchProps.getProviderSpecialties();
          break;
        case 'vamc_services':
          setLoadingMessage('Loading VAMC services');
          break;
        default:
          break;
      }
      // eslint-disable-next-line consistent-return
      return () => {
        ignore = true;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceType],
  );

  if (currentQuery.fetchSvcsInProgress) {
    return (
      <VaLoadingIndicator
        id="service-type-loading"
        message={loadingMessage}
        className="vads-u-margin-bottom--2"
      />
    );
  }
  return children;
}

ServicesLoadingOrShow.propTypes = {
  children: PropTypes.node,
  currentQuery: PropTypes.object,
  serviceType: PropTypes.string,
};

const mapStateToProps = state => {
  return {
    currentQuery: state.searchQuery,
  };
};

export default connect(mapStateToProps)(ServicesLoadingOrShow);
