import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { useSearchParams, useNavigation } from 'react-router-dom';
import { SEARCH_PARAMS } from '../utilities/constants';
import { ProfileContext } from '../context/ProfileContext';

const PaginationMeta = ({ meta, results, resultType, defaults }) => {
  const profile = useContext(ProfileContext);
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const pageSize = Number(searchParams.get('perPage')) || defaults.SIZE;
  const pageNumber = Number(searchParams.get('page')) || defaults.NUMBER;
  const sortOrder = searchParams.get(SEARCH_PARAMS.SORT) || defaults.SORT;
  const selectedIndividual =
    searchParams.get('show') || defaults.SELECTED_INDIVIDUAL;
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
      {`"You (${profile.firstName.toLowerCase()} ${profile.lastName.toLowerCase()})"`}
    </span>
  ) : null;

  useEffect(
    () => {
      if (navigation.state === 'idle') {
        focusElement('.poa-request__meta');
      }
    },
    [navigation.state],
  );

  return (
    <p className="poa-request__meta" role="text">
      {`Showing ${
        totalCount > 0 ? `${initCount}-${pageSizeCount} of ` : ''
      }${totalCount} ${searchStatus || ''} ${resultType || ''} ${
        selectedIndividual === 'you' ? 'for ' : ''
      }`}
      {selectedIndividual === 'you' ? userName : ''}
      {` sorted by `}“
      <strong>
        {`${
          searchStatus === 'processed' ? 'Processed' : 'Submitted'
        } date (${sortOrder})`}
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
