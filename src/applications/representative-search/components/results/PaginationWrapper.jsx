import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PaginationWrapper = ({ handlePageSelect }) => {
  const pagination = useSelector(state => state.searchResult.pagination);
  const currentPage = pagination ? pagination.currentPage : 1;
  const totalPages = pagination ? pagination.totalPages : 1;
  if (currentPage && totalPages > 1) {
    let paginationLength;
    if (window.innerWidth > 415) {
      paginationLength = 7;
    } else {
      paginationLength = 4;
    }
    return (
      <div className="pagination-container">
        <VaPagination
          max-page-list-length={paginationLength}
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
  handlePageSelect: PropTypes.func.isRequired,
};

export default PaginationWrapper;
