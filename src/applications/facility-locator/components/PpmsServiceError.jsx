import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function PpmsServiceError({ currentQuery }) {
  if (currentQuery?.fetchSvcsError) {
    return (
      <va-alert status="error" class="vads-u-margin-bottom--2">
        <h3 id="fetch-ppms-services-errro" slot="headline">
          We’ve run into a problem
        </h3>
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
