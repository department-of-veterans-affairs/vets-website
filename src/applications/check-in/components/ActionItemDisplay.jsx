import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeSelectApp, makeSelectVeteranData } from '../selectors';
import { APP_NAMES } from '../utils/appConstants';

import WhatToDoNext from './WhatToDoNext';

const ActionItemDisplay = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);

  const displaySuccessAlert = app === APP_NAMES.PRE_CHECK_IN; // && pre-check-in insn't neccessary

  return (
    <>
      {displaySuccessAlert ? (
        <div data-testid="action-item-display">
          <va-alert
            close-btn-aria-label="Close notification"
            closeable
            status="success"
            visible
          >
            <h2 slot="headline">Test</h2>
            <p className="vads-u-margin-y--0">
              You can now access health tools on VA.gov.
            </p>
          </va-alert>
        </div>
      ) : (
        <WhatToDoNext router={router} appointments={appointments} />
      )}
    </>
  );
};

ActionItemDisplay.propTypes = {
  router: PropTypes.object,
};

export default ActionItemDisplay;
