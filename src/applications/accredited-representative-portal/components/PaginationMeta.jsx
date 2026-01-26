import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { SEARCH_PARAMS } from '../utilities/constants';
import { ProfileContext } from '../context/ProfileContext';

const PaginationMeta = ({ meta, results, resultType, defaults }) => {
  const profile = useContext(ProfileContext);
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('pageSize')) || defaults.SIZE;
  const pageNumber = Number(searchParams.get('pageNumber')) || defaults.NUMBER;
  const sortOrder =
    searchParams.get(SEARCH_PARAMS.SORTORDER) || defaults.SORT_ORDER;
  const selectedIndividual =
    searchParams.get('as_selected_individual') || defaults.SELECTED_INDIVIDUAL;
  const searchStatus = searchParams.get('status') || '';
  let initCount;
  let pageSizeCount = pageSize * pageNumber;
  const totalCount = meta.page.total;

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

  const userName = profile ? (
    <span className="poa-request__user-name">
      "You ({profile.firstName.toLowerCase()} {profile.lastName.toLowerCase()}
      )"
    </span>
  ) : null;
  return (
    <p className="poa-request__meta">
      Showing{' '}
      {totalCount > 0 && (
        <span>
          {initCount}-{pageSizeCount} of{' '}
        </span>
      )}
      {totalCount} {searchStatus || ''} {resultType || ''}{' '}
      {selectedIndividual === 'true' && 'for'}{' '}
      {selectedIndividual === 'true' && userName} sorted by “
      <strong>
        {searchStatus === 'processed' ? 'Processed' : 'Submitted'} date (
        {sortOrder})
      </strong>
      ”
    </p>
  );
};

PaginationMeta.propTypes = {
  defaults: PropTypes.object,
  meta: PropTypes.object,
  resultType: PropTypes.string,
  results: PropTypes.arrayOf(PropTypes.object),
};

export default PaginationMeta;
