import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import { fetchSearchByNameResults } from '../../actions/index';
import ResultCard from '../search/ResultCard';
import FilterYourResults from '../FilterYourResults';
import TuitionAndHousingEstimates from '../TuitionAndHousingEstimates';
import { updateUrlParams } from '../../selectors/search';
import { getFiltersChanged } from '../../selectors/filters';
import MobileFilterControls from '../../components/MobileFilterControls';
import { focusElement } from 'platform/utilities/ui';

export function NameSearchResults({
  dispatchFetchSearchByNameResults,
  filters,
  preview,
  search,
  smallScreen,
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
  useEffect(
    () => {
      focusElement('#name-search-results-count');
    },
    [results],
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
    );
  };

  return (
    <>
      {name !== '' &&
        name !== null && (
          <div className="row vads-u-padding--0 vads-u-margin--0">
            {smallScreen && <MobileFilterControls />}
            <p
              className="vads-u-padding-x--1p5 small-screen:vads-u-padding-x--0"
              id="name-search-results-count"
            >
              Showing {count} search results for "<strong>{name}</strong>"
            </p>

            {!smallScreen && (
              <div className="column small-4 vads-u-padding--0">
                <TuitionAndHousingEstimates smallScreen={smallScreen} />
                <FilterYourResults smallScreen={smallScreen} />
              </div>
            )}
            <div className="column small-12 medium-8 name-search-cards-padding">
              {inProgress && (
                <LoadingIndicator message="Loading search results..." />
              )}

              {!inProgress &&
                count > 0 && (
                  <div className="vads-l-row">
                    {results.map(institution => (
                      <ResultCard
                        institution={institution}
                        key={institution.facilityCode}
                        version={preview.version}
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
