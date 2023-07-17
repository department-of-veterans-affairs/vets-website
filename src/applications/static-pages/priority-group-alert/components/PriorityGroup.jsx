import React from 'react';
import PropTypes from 'prop-types';

const PriorityGroup = ({ effectiveDate, priorityGroup }) => (
  <va-alert close-btn-aria-label="Close notification" status="success" visible>
    <h2 slot="headline">
      Your assigned priority group is {priorityGroup} (as of {effectiveDate})
    </h2>
    <div>
      <p className="vads-u-margin-y--0">
        If your income has changed or your service-connected disability has
        gotten worse, you may qualify for a different priority group. Use
        <a href="/health-care/update-health-information/">form 10-10EZR</a>
        to update your information.
      </p>
    </div>
  </va-alert>
);

PriorityGroup.propTypes = {
  effectiveDate: PropTypes.string,
  priorityGroup: PropTypes.string,
};

export default PriorityGroup;
