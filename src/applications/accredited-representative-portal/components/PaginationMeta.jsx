import React from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { SEARCH_PARAMS } from '../utilities/constants';

const PaginationMeta = ({ meta, results, resultType, defaults }) => {
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize')) || defaults.SIZE;
  const pageNumber = Number(searchParams.get('pageNumber')) || defaults.NUMBER;
  const sortOrder =
    searchParams.get(SEARCH_PARAMS.SORTORDER) || defaults.SORT_ORDER;
  const searchStatus = searchParams.get('status') || '';
  let initCount;
  let pageSizeCount = pageSize * pageNumber;
  const totalCount = meta.total;
  if (pageSizeCount > totalCount) {
    pageSizeCount = pageSize + (totalCount - pageSize);
  }
  if (pageNumber > 1) {
    if (results.length < pageSize) {
      initCount = pageSize * (pageNumber - 1) + 1;
    } else {
      initCount = pageSizeCount - (pageSize - 1);
    }
  } else {
    initCount = 1;
  }
  return (
    <p className="poa-request__meta">
      Showing {initCount}-{pageSizeCount} of {totalCount} {searchStatus || ''}{' '}
      {resultType || ''} sorted by “
      <strong>
        {searchStatus === 'processed' ? 'Processed' : 'Submitted'} date (
        {sortOrder === 'asc' ? 'oldest' : 'newest'})
      </strong>
      ”
    </p>
  );
};

PaginationMeta.propTypes = {
  defaults: PropTypes.object,
  meta: PropTypes.object,
  results: PropTypes.arrayOf(PropTypes.object),
  resultType: PropTypes.string,
};

export default PaginationMeta;
