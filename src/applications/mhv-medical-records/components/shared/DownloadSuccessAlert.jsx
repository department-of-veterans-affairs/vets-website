/**
 * Alert Box component specific to access trouble
 *
 * @author Matthew Wright
 * @desc: Alert that displays when a download link is clicked and there are no data issues
 * @notes :
 */

import React, { useEffect } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { ALERT_TYPE_SUCCESS } from '../../util/constants';

const DownloadSuccessAlert = props => {
  const { className, type, focusId } = props;

  useEffect(
    () => {
      if (focusId) {
        focusElement(`#${focusId}`);
      }
    },
    [focusId],
  );

  return (
    <VaAlert
      id={focusId}
      status={ALERT_TYPE_SUCCESS}
      className={`vads-u-margin-top--4 no-print ${className}`}
      role="alert"
      data-testid="alert-download-started"
    >
      <h2 slot="headline" data-testid="download-success-alert-message">
        {`${type || 'Download'} started`}
      </h2>
      <p className="vads-u-margin--0">
        Check your device’s downloads location for your file.
      </p>
    </VaAlert>
  );
};

export default DownloadSuccessAlert;

DownloadSuccessAlert.propTypes = {
  className: PropTypes.any,
  completed: PropTypes.any,
  focusId: PropTypes.any,
  type: PropTypes.any,
  visibility: PropTypes.any,
};
