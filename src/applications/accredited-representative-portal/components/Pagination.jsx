import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SEARCH_PARAMS } from '../utilities/poaRequests';

const Pagination = ({ meta, defaults }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize'));
  const pageSelect = e => {
    const sortBy = searchParams.get(SEARCH_PARAMS.SORTBY) || defaults.SORT_BY;
    const status = searchParams.get(SEARCH_PARAMS.STATUS) || defaults.STATUS;
    const sort =
      searchParams.get(SEARCH_PARAMS.SORTORDER) || defaults.SORT_ORDER;
    const selectedIndividual =
      searchParams.get(SEARCH_PARAMS.SELECTED_INDIVIDUAL) ||
      defaults.SELECTED_INDIVIDUAL;

    if (status) {
      navigate(
        `?status=${status}&sortOrder=${sort}&sortBy=${sortBy}&pageNumber=${
          e.detail.page
        }&pageSize=${pageSize}&as_selected_individual=${selectedIndividual}`,
      );
    } else {
      navigate(
        `?sortOrder=${sort}&sortBy=${sortBy}&pageNumber=${
          e.detail.page
        }&pageSize=${pageSize}&as_selected_individual=${selectedIndividual}`,
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
