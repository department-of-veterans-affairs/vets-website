import React from 'react';
import { Link } from 'react-router';

const issuesWidget = items => {
  return (
    <Link
      className="add-new-issue"
      to={{ pathname: '/add-issue', search: `?index=${items.length}` }}
    >
      Add a new issue
    </Link>
  );
};

export default issuesWidget;
