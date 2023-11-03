import React from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PaginationWrapper = ({
  handlePageSelect,
  currentPage,
  totalPages,
  // searchResults,
}) => {
  return (
    <div className="pagination-container vads-u-padding-bottom--2">
      <VaPagination
        onPageSelect={handlePageSelect}
        page={currentPage}
        pages={totalPages}
      />
    </div>
  );
};

export default PaginationWrapper;
