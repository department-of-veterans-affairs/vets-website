import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const Pagination = ({ setCount, meta }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageSelect = e => {
    const status = searchParams.get('status');
    const sort = searchParams.get('sort');
    setCount(e.detail.page);
    navigate(
      `?status=${status}&sort=${sort}&pageNumber=${e.detail.page}&pageSize=20`,
    );
  };

  return (
    <>
      <VaPagination
        page={meta.number}
        pages={meta.total_pages}
        maxPageListLength={20}
        showLastPage
        onPageSelect={e => pageSelect(e)}
      />
    </>
  );
};

export default Pagination;
