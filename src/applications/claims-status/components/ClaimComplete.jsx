import PropTypes from 'prop-types';
import React from 'react';
import { format, isValid, parseISO } from 'date-fns';

import CompleteDetails from './CompleteDetails';

const formatDate = date => {
  const parsedDate = parseISO(date);

  return isValid(parsedDate)
    ? format(parsedDate, 'MMMM d, yyyy')
    : 'Invalid date';
};

function ClaimComplete({ completedDate }) {
  const completedDateText = completedDate
    ? `on ${formatDate(completedDate)}`
    : '';
  const alertText = ['We decided your claim', `${completedDateText}`].join(' ');

  return (
    <>
      <div className="inset">
        <h3 className="vads-u-font-size--h4">{alertText}</h3>
      </div>
      <CompleteDetails className="vads-u-margin--2" />
    </>
  );
}

ClaimComplete.propTypes = {
  completedDate: PropTypes.string,
};

export default ClaimComplete;
