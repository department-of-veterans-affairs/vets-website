import React from 'react';
import PropTypes from 'prop-types';

import ApplicationsInProgress from './ApplicationsInProgress';

const ApplicationsByStatus = ({
  applicationStatus = 'in-progress',
  hideMissingApplicationHelp,
}) => {
  const headingText =
    applicationStatus === 'in-progress' ? 'In-progress' : 'Completed';
  const emptyState =
    applicationStatus === 'in-progress'
      ? "You don't have any benefit forms or applications in progress."
      : "You don't have any completed benefit forms or applications to show.";

  return (
    <div data-testid="applications-by-status">
      <h3
        className="vads-u-font-size--h4 vads-u-margin-bottom--2p5"
        data-testid="applications-by-status-header"
      >
        {headingText} forms
      </h3>

      <ApplicationsInProgress
        emptyState={emptyState}
        hideH3
        hideMissingApplicationHelp={hideMissingApplicationHelp}
      />
    </div>
  );
};

ApplicationsByStatus.propTypes = {
  applicationStatus: PropTypes.string, // 'in-progress' or 'completed'
  hideMissingApplicationHelp: PropTypes.bool,
};

export default ApplicationsByStatus;
