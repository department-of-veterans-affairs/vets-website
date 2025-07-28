import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SEARCH_PARAMS } from '../utilities/poaRequests';

const Pagination = ({ meta }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize'));
  const pageSelect = e => {
    const status = searchParams.get('status');
    const sort = searchParams.get(SEARCH_PARAMS.SORTORDER);
    const sortBy = searchParams.get(SEARCH_PARAMS.SORTBY);
    if (status) {
      navigate(
        `?status=${status}&sortOrder=${sort}&sortBy=${sortBy}&pageNumber=${
          e.detail.page
        }&pageSize=${pageSize}`,
      );
    } else {
      navigate(
        `?sortOrder=${sort}&sortBy=${sortBy}&pageNumber=${
          e.detail.page
        }&pageSize=${pageSize}`,
      );
    }
  };

  return (
    <>
      <VaPagination
        page={meta.number}
        pages={meta.totalPages}
        maxPageListLength={pageSize}
        showLastPage
        onPageSelect={e => pageSelect(e)}
      />
    </>
  );
};

export default Pagination;
