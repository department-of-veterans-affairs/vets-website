import PropTypes from 'prop-types';
import React from 'react';

export const UnifiedLabAndTestObservationDetail = ({
  header,
  value,
  ddActionName,
  emptyMessage = 'None noted',
}) => {
  return (
    <>
      <h4 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin--0">
        {header}
      </h4>
      <p
        className="vads-u-margin--0 vads-u-padding-bottom--2"
        data-dd-privacy="mask"
        data-dd-action-name={ddActionName}
        data-testid="lab-and-test-observation-message-detail"
      >
        {value || emptyMessage}
      </p>
    </>
  );
};
export default UnifiedLabAndTestObservationDetail;

UnifiedLabAndTestObservationDetail.propTypes = {
  ddActionName: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string,
  value: PropTypes.string,
};
