import React from 'react';

import { PAGE_SIZE } from '../constants';

const SimplePagination = ({ prevOffset, nextOffset, handlePageChange }) => (
  <div className="simple-pagination">
    {prevOffset && (
      <a href="#" rel="prev" onClick={handlePageChange(prevOffset)}>
        « Previous
      </a>
    )}
    <span className="current-page">
      Page {prevOffset ? prevOffset / PAGE_SIZE + 1 : 1}
    </span>
    {nextOffset && (
      <a href="#" rel="next" onClick={handlePageChange(nextOffset)}>
        Next »
      </a>
    )}
  </div>
);

export default SimplePagination;
