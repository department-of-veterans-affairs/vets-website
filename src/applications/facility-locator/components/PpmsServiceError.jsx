import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setFocus } from '../utils/helpers';

function PpmsServiceError({ currentQuery }) {
  const shownAlert = useRef(null);
  useEffect(() => {
    if (
      shownAlert.current &&
      currentQuery?.fetchSvcsError &&
      !shownAlert.current.hasAttribute('tabindex')
    ) {
      setTimeout(() => {
        // We need the timeout because the alert is rendered after the error is set
        // and we need to wait for the alert to be rendered before setting focus
        // Also, the required field (facilityType) steals focus immediately no matter how it is set
        setFocus(shownAlert.current);
      }, 50);
    }
  }, [shownAlert, currentQuery]);
  if (currentQuery?.fetchSvcsError) {
    return (
      <va-alert
        status="error"
        class="vads-u-margin-bottom--4"
        id="fetch-ppms-services-error"
        ref={shownAlert}
      >
        <h2 slot="headline">We’ve run into a problem</h2>
        <p className="vads-u-margin-y--0">
          Community provider searches aren’t working right now. Try again later.
        </p>
      </va-alert>
    );
  }
  return null;
}

PpmsServiceError.propTypes = {
  currentQuery: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    currentQuery: state.searchQuery,
  };
};

export default connect(mapStateToProps)(PpmsServiceError);
