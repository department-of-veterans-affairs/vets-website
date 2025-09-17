import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SEARCH_PARAMS } from '../utilities/poaRequests';

const Pagination = ({ meta, defaults }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize'));
  const pageSelect = page => {
    const sortBy = searchParams.get(SEARCH_PARAMS.SORTBY) || defaults.SORT_BY;
    const status = searchParams.get(SEARCH_PARAMS.STATUS) || defaults.STATUS;
    const sort =
      searchParams.get(SEARCH_PARAMS.SORTORDER) || defaults.SORT_ORDER;
    const selectedIndividual =
      searchParams.get(SEARCH_PARAMS.SELECTED_INDIVIDUAL) ||
      defaults.SELECTED_INDIVIDUAL;

    // status for request search page, second is for submissions pagination
    if (status) {
      navigate(
        `?status=${status}&sortOrder=${sort}&sortBy=${sortBy}&pageNumber=${page}&pageSize=${pageSize}&as_selected_individual=${selectedIndividual}`,
      );
    } else {
      navigate(
        `?sortOrder=${sort}&sortBy=${sortBy}&pageNumber=${page}&pageSize=${pageSize}`,
      );
    }
  };

  const page = meta.page.number;
  const pages = meta.page.totalPages;

  return (
    <>
      <VaPagination
        page={page}
        pages={pages}
        maxPageListLength={pageSize}
        showLastPage
        onPageSelect={e => pageSelect(e.detail.page)}
      />
    </>
  );
};

export default Pagination;
