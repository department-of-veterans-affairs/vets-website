import PropTypes from 'prop-types';
import React from 'react';
import { isBefore, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { buildDateFormatter } from '../utils/helpers';

export default function DueDate({ date }) {
  const now = new Date();
  const dueDate = parseISO(date);
  const pastDueDate = isBefore(dueDate, now);
  const className = pastDueDate ? 'past-due' : 'due-file';

  const formattedClaimDate = buildDateFormatter()(date);
  let dueDateHeader = '';

  if (pastDueDate) {
    dueDateHeader = `Needed from you by ${formattedClaimDate} - Due ${formatDistanceToNowStrict(
      dueDate,
    )} ago`;
  } else {
    dueDateHeader = `Needed from you by ${formattedClaimDate}`;
  }
  return (
    <div className="due-date-header">
      <strong className={className}>{dueDateHeader}</strong>
    </div>
  );
}

DueDate.propTypes = {
  date: PropTypes.string.isRequired,
};
