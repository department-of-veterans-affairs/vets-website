import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { buildDateFormatter } from '../utils/helpers';

export default function DueDate({ date }) {
  const now = moment();
  const dueDate = moment(date);
  const pastDueDate = dueDate.isBefore(now);
  const className = pastDueDate ? 'past-due' : 'due-file';

  const formattedClaimDate = buildDateFormatter()(date);
  const dueDateHeader = pastDueDate
    ? `Needed from you by ${formattedClaimDate} - Due ${dueDate.fromNow()}`
    : `Needed from you by ${formattedClaimDate}`;

  return (
    <div className="due-date-header">
      <strong className={className}>{dueDateHeader}</strong>
    </div>
  );
}

DueDate.propTypes = {
  date: PropTypes.string.isRequired,
};
