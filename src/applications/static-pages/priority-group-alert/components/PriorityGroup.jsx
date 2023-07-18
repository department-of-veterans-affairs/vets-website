import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const PriorityGroup = ({ effectiveDate, priorityGroup }) => {
  const group = priorityGroup.replace('Group ', '');
  const date = moment(effectiveDate).format('YYYY-MM-DD');
  const headline = `Your assigned priority group is ${group} (as of ${date})`;

  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="success"
      visible
    >
      <h2 slot="headline">{headline}</h2>
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
};

PriorityGroup.propTypes = {
  effectiveDate: PropTypes.string.isRequired,
  priorityGroup: PropTypes.string.isRequired,
};

export default PriorityGroup;
