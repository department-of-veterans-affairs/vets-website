import React from 'react';
import moment from 'moment';

export default function DueDate({ date }) {
  const today = moment().startOf('day');
  const className = moment(date).isBefore(today) ? 'past-due' : 'due-file';
  return (
    <div className="tracked-item-due">
      <h6 className={className}><i className="fa fa-exclamation-triangle"></i> Needed from you</h6>
      <span className={className}> - due {moment(date).fromNow()}</span>
    </div>
  );
}

DueDate.propTypes = {
  date: React.PropTypes.string.isRequired
};

