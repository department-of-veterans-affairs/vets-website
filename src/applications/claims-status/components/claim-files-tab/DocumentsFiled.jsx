import PropTypes from 'prop-types';
import React from 'react';

function DocumentsFiled({ claim }) {
  return (
    <div className="what-you-need-to-do-container">
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Documents filed
      </h3>
    </div>
  );
}

DocumentsFiled.propTypes = {
  claim: PropTypes.object,
};

export default DocumentsFiled;
