import React from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PaginationWrapper = ({
  handlePageSelect,
  currentPage,
  totalPages,
  // searchResults,
}) => {
  return (
    <VaPagination
      onPageSelect={handlePageSelect}
      page={currentPage}
      pages={totalPages}
    />
  );
};

export default PaginationWrapper;
