import React from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PaginationWrapper = ({ handlePageSelect, currentPage, totalPages }) => {
  if (currentPage && totalPages > 1) {
    return (
      <div className="pagination-container">
        <VaPagination
          max-page-list-length={7}
          onPageSelect={handlePageSelect}
          page={currentPage}
          pages={totalPages}
          uswds
        />
      </div>
    );
  }

  return null;
};

PaginationWrapper.propTypes = {
  currentPage: PropTypes.number.isRequired,
  handlePageSelect: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default PaginationWrapper;
