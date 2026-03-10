import React from 'react';
import PropTypes from 'prop-types';
import { formatFacilityUnorderedList } from '../../util/facilityHelpers';

const MissingRecordsWarningAlert = ({ ohFacilityNamesAfterCutover = [] }) => {
  return (
    <va-alert
      id="missing-records-warning-alert"
      status="warning"
      class="no-print vads-u-margin-y--1p5"
      data-testid="missing-records-warning-alert"
    >
      <h2 slot="headline">
        Some of your records aren’t available in this report
      </h2>
      <p>
        Medical records from these VA health facilities aren’t available in your
        VA Blue Button report:
      </p>
      {formatFacilityUnorderedList(ohFacilityNamesAfterCutover)}
      <p>
        If you need medical records from these facilities, download your
        Continuity of Care Document (CCD).
      </p>
      <va-link
        href="/my-health/medical-records/download#ccd"
        text="Go to download your Continuity of Care Document"
      />
    </va-alert>
  );
};

// Facility name can be a string or an object with id and content
// (formatFacilityUnorderedList supports both formats)
const facilityNameShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.node,
  }),
]);

MissingRecordsWarningAlert.propTypes = {
  ohFacilityNamesAfterCutover: PropTypes.arrayOf(facilityNameShape),
};

export default MissingRecordsWarningAlert;
