import React from 'react';

import { PAGE_SIZE } from '../constants';

const SimplePagination = ({ prevOffset, nextOffset, handlePageChange }) => {
  let pageNumber = 1;

  if (nextOffset) {
    pageNumber = nextOffset / PAGE_SIZE;
  } else if (prevOffset) {
    pageNumber = prevOffset / PAGE_SIZE + 1;
  }

  return (
    <div className="simple-pagination">
      {prevOffset && (
        <a href="#" rel="prev" onClick={handlePageChange(prevOffset)}>
          « Previous
        </a>
      )}
      <span className="current-page">Page {pageNumber}</span>
      {nextOffset && (
        <a href="#" rel="next" onClick={handlePageChange(nextOffset)}>
          Next »
        </a>
      )}
    </div>
  );
};

export default SimplePagination;
