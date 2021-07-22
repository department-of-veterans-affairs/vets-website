import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import { fetchSearchByNameResults } from '../../actions/index';
import SearchResultCard from '../SearchResultCard';
import FilterYourResults from '../FilterYourResults';
import TuitionAndHousingEstimates from '../TuitionAndHousingEstimates';
import { updateUrlParams } from '../../utils/helpers';
import { getFiltersChanged } from '../../selectors/filters';

export function NameSearchResults({
  dispatchFetchSearchByNameResults,
  filters,
  preview,
  search,
  filtersChanged,
}) {
  const { version } = preview;
  const { inProgress, tab } = search;
  const { count, results } = search.name;
  const { currentPage, totalPages } = search.name.pagination;
  const { name } = search.query;
  const history = useHistory();
  const [usedFilters, setUsedFilters] = useState(filtersChanged);

  useEffect(
    () => {
      setUsedFilters(getFiltersChanged(filters));
    },
    [search.name.results],
  );
  const fetchPage = page => {
    dispatchFetchSearchByNameResults(name, page, filters, version);

    updateUrlParams(
      history,
      tab,
      {
        ...search.query,
        name,
      },
      filters,
      version,
      page,
    );
  };

  return (
    <>
      {name !== '' &&
        name !== null && (
          <div className="row vads-u-padding--0 vads-u-margin--0">
            <p className="vads-u-padding-x--2p5 small-screen:vads-u-padding--0">
              Showing <strong>{count} search results</strong> for '
              <strong>{name}</strong>'
            </p>
            <div className="column small-4 vads-u-padding--0 vads-u-display--none small-screen:vads-u-display--block">
              <TuitionAndHousingEstimates />
              <FilterYourResults />
            </div>
            <div className="column search-results-content">
              {inProgress && (
                <LoadingIndicator message="Loading search results..." />
              )}

              {!inProgress &&
                count > 0 && (
                  <div className="vads-l-row vads-u-flex-wrap--wrap">
                    {results.map(institution => (
                      <SearchResultCard
                        institution={institution}
                        key={institution.facilityCode}
                      />
                    ))}
                  </div>
                )}

              {!inProgress &&
                count === 0 &&
                usedFilters && (
                  <p>
                    We didn't find any institutions based on the filters you've
                    applied. Please update the filters and search again.
                  </p>
                )}

              {!inProgress && (
                <Pagination
                  className="vads-u-border-top--0"
                  onPageSelect={fetchPage}
                  page={currentPage}
                  pages={totalPages}
                  maxPageListLength={5}
                  showLastPage
                />
              )}
            </div>
          </div>
        )}
    </>
  );
}

const mapStateToProps = state => ({
  eligibility: state.eligibility,
  filters: state.filters,
  preview: state.preview,
  search: state.search,
  filtersChanged: getFiltersChanged(state.filters),
});

const mapDispatchToProps = {
  dispatchFetchSearchByNameResults: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchResults);
