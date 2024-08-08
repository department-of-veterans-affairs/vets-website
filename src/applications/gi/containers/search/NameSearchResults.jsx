import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  VaLoadingIndicator,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import { fetchSearchByNameResults } from '../../actions/index';
import ResultCard from './ResultCard';
import FilterYourResults from '../FilterYourResults';
// import FilterByLocation from './FilterByLocation';
import TuitionAndHousingEstimates from '../TuitionAndHousingEstimates';
import { updateUrlParams } from '../../selectors/search';
import { getFiltersChanged } from '../../selectors/filters';
import MobileFilterControls from '../../components/MobileFilterControls';

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

  // We use the Pagination component from the VA Component Library. This doesn't seem to handle
  // visual focus so after page load, let's grab the anchor tags for the 3 pagination elements
  // and add href="#" to them (this is all that is needed to force visual focus and tabability)
  useEffect(() => {
    const paginationPrev = document.getElementsByClassName(
      'va-pagination-prev',
    );
    const paginationInner = document.getElementsByClassName(
      'va-pagination-inner',
    );
    const paginationNext = document.getElementsByClassName(
      'va-pagination-next',
    );

    if (paginationInner.length > 0) {
      const anchors = [
        ...paginationPrev[0].getElementsByTagName('a'),
        ...paginationInner[0].getElementsByTagName('a'),
        ...paginationNext[0].getElementsByTagName('a'),
      ];
      if (anchors) {
        for (const a of anchors) {
          a.href = '#';
        }
      }
    }
  });

  useEffect(
    () => {
      // Avoid blank searches or double events
      if (name && count !== null) {
        recordEvent({
          event: 'view_search_results',
          'search-page-path': document.location.pathname,
          'search-query': name,
          'search-results-total-count': count,
          'search-results-total-pages': totalPages,
          'search-selection': 'GIBCT',
          'search-typeahead-enabled': false,
          'search-location': 'Name',
          'sitewide-search-app-used': false,
          'type-ahead-option-keyword-selected': undefined,
          'type-ahead-option-position': undefined,
          'type-ahead-options-list': undefined,
          'type-ahead-options-count': undefined,
        });
      }
    },
    [results, name, totalPages, count],
  );

  const fetchPage = e => {
    const { page } = e.detail;
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

  useEffect(
    () => {
      const targetId = 'name-search-results-count';
      focusElement(`#${targetId}`);
    },
    [results],
  );

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

            {!smallScreen &&
              environment.isProduction() && (
                <div className="column small-4 vads-u-padding--0">
                  <TuitionAndHousingEstimates smallScreen={smallScreen} />
                  <FilterYourResults
                    smallScreen={smallScreen}
                    searchType="name"
                  />
                </div>
              )}
            {!smallScreen &&
              !environment.isProduction() && (
                <div className="column small-4 vads-u-padding--0">
                  <TuitionAndHousingEstimates smallScreen={smallScreen} />
                  <FilterYourResults
                    smallScreen={smallScreen}
                    searchType="name"
                  />
                </div>
              )}
            {/* {!smallScreen &&
              !environment.isProduction() && (
                <div className="column small-4 vads-u-padding--0">
                  <TuitionAndHousingEstimates smallScreen={smallScreen} />
                  <FilterByLocation smallScreen={smallScreen} />
                </div>
              )} */}
            <div className="column small-12 medium-8 name-search-cards-padding">
              {inProgress && (
                <VaLoadingIndicator
                  data-testid="loading-indicator"
                  message="Loading search results..."
                />
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
                <VaPagination
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
