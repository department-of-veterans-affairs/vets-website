import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { buildDateFormatter } from '../utils/helpers';

export default function DueDate({ date }) {
  const now = moment();
  const dueDate = moment(date);
  const className = dueDate.isBefore(now) ? 'past-due' : 'due-file';

  const formattedClaimDate = buildDateFormatter()(date);
  const dueDateHeader = `Needed from you by ${formattedClaimDate}`;

  return (
    <div className="due-date-header">
      <strong className={className}>{dueDateHeader}</strong>
    </div>
  );
}

DueDate.propTypes = {
  date: PropTypes.string.isRequired,
};
