import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEARCH_PARAMS } from '../utilities/constants';

const PaginationMeta = (meta, results) => {
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize'));
  const pageNumber = Number(searchParams.get('pageNumber'));
  const sortby = searchParams.get(SEARCH_PARAMS.SORTBY);
  const searchStatus = searchParams.get('status');
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
      Showing {initCount}-{pageSizeCount} of {totalCount} {searchStatus}{' '}
      requests sorted by “
      <strong>
        {searchStatus === 'processed' ? 'Processed' : 'Submitted'} date (
        {sortby === 'asc' ? 'oldest' : 'newest'})
      </strong>
      ”
    </p>
  );
};

export default PaginationMeta;
