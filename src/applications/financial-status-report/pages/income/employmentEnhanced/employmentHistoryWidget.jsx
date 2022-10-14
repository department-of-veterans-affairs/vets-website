import React from 'react';
import { Link } from 'react-router';

const employmentHistoryWidget = items => {
  return (
    <Link
      className="add-additional-job"
      to={{ pathname: '/add-additional-job', search: `?index=${items.length}` }}
    >
      Add additional job
    </Link>
  );
};

export default employmentHistoryWidget;
