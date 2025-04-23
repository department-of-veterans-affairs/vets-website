import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const Pagination = ({ meta }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize'));
  const pageSelect = e => {
    const status = searchParams.get('status');
    const sort = searchParams.get('sort');
    navigate(
      `?status=${status}&sort=${sort}&pageNumber=${e.detail.page}&pageSize=${pageSize}`,
    );
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
