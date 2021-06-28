import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import { fetchSearchByNameResults } from '../../actions/index';
import SearchResultCard from '../SearchResultCard';
import RefineYourSearch from '../RefineYourSearch';
import TuitionAndHousingEstimates from '../TuitionAndHousingEstimates';

export function NameSearchResults({
  dispatchFetchSearchByNameResults,
  filters,
  preview,
  search,
}) {
  const { version } = preview;
  const { inProgress } = search;
  const { count, results } = search.name;
  const { currentPage, totalPages } = search.name.pagination;
  const { name } = search.query;

  const fetchPage = page => {
    dispatchFetchSearchByNameResults(name, page, filters, version);
  };

  return (
    <>
      {name !== '' &&
        name !== null && (
          <div className="usa-grid vads-u-padding--1">
            <p>
              Showing <strong>{count} search results</strong> for '
              <strong>{name}</strong>'
            </p>
            <div className="usa-width-one-third">
              <TuitionAndHousingEstimates />
              <RefineYourSearch />
            </div>
            <div className="usa-width-two-thirds ">
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
});

const mapDispatchToProps = {
  dispatchFetchSearchByNameResults: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchResults);
