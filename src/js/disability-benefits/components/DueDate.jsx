import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export default function DueDate({ date }) {
  const now = moment();
  const dueDate = moment(date);
  const className = dueDate.isBefore(now) ? 'past-due' : 'due-file';
  return (
    <div className="tracked-item-due">
      <h6 className={className}><i className="fa fa-exclamation-triangle"></i> Needed from you</h6>
      <span className={className}> - due {dueDate.fromNow()}</span>
    </div>
  );
}

DueDate.propTypes = {
  date: PropTypes.string.isRequired
};

