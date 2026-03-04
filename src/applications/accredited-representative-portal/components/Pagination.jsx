import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams, useNavigation } from 'react-router-dom';
import { focusElement } from 'platform/utilities/ui';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { SEARCH_PARAMS } from '../utilities/constants';

const Pagination = ({ meta, defaults }) => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('perPage'));
  const pageSelect = page => {
    const status = searchParams.get(SEARCH_PARAMS.STATUS) || defaults.STATUS;
    const sort = searchParams.get(SEARCH_PARAMS.SORT) || defaults.SORT;
    const selectedIndividual =
      searchParams.get(SEARCH_PARAMS.SELECTED_INDIVIDUAL) ||
      defaults.SELECTED_INDIVIDUAL;

    // status for request search page, second is for submissions pagination
    if (status) {
      navigate(
        `?status=${status}&sort=${sort}&page=${page}&perPage=${pageSize}&show=${selectedIndividual}`,
      );
    } else {
      navigate(`?sort=${sort}&page=${page}&perPage=${pageSize}`);
    }
  };

  const page = meta.page.number;
  const pages = meta.page.totalPages;
  useEffect(
    () => {
      if (navigation.state === 'idle') {
        focusElement('.poa-request__meta');
      }
    },
    [navigation.state],
  );
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

Pagination.propTypes = {
  defaults: PropTypes.object,
  meta: PropTypes.object,
};

export default Pagination;
