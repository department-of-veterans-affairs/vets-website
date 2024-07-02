import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export default function DueDateOld({ date }) {
  const now = moment();
  const dueDate = moment(date);
  const className = dueDate.isBefore(now) ? 'past-due' : 'due-file';
  return (
    <div className="tracked-item-due">
      <strong className={className}>
        <va-icon icon="warning" size={3} class="past-due-icon" />
        Needed from you
      </strong>
      <span className={className}> - due {dueDate.fromNow()}</span>
    </div>
  );
}

DueDateOld.propTypes = {
  date: PropTypes.string.isRequired,
};
