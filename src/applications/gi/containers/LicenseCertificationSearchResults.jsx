import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ADDRESS_DATA from 'platform/forms/address/data';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useHistory, useLocation } from 'react-router-dom';
import { fetchLicenseCertificationResults } from '../actions';
import {
  capitalizeFirstLetter,
  filterLcResults,
  formatResultCount,
  showLcParams,
} from '../utils/helpers';

function LicenseCertificationSearchResults({
  dispatchFetchLicenseCertificationResults,
  // error,
  lcResults,
  fetchingLc,
  hasFetchedOnce,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResults, setFilteredResults] = useState([]);

  const location = useLocation();
  const history = useHistory();
  const { nameParam, categoryParam, stateParam } = showLcParams(location);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(
    () => {
      if (!hasFetchedOnce) {
        dispatchFetchLicenseCertificationResults();
      }
    },
    [dispatchFetchLicenseCertificationResults, hasFetchedOnce],
  );

  useEffect(
    () => {
      if (lcResults.length !== 0) {
        const results = filterLcResults(lcResults, nameParam, {
          type: categoryParam,
          state: stateParam,
        });
        setFilteredResults(results);
      }
    },
    [lcResults],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleRouteChange = id => event => {
    event.preventDefault();
    history.push(`/lc-search/results/${id}`);
  };

  const handlePreviousRouteChange = event => {
    event.preventDefault();
    history.push(`/lc-search?category=${categoryParam}&state=${stateParam}`);
  };

  // if (error) {
  //   {/* ERROR STATE */}
  // }

  return (
    <div>
      {fetchingLc && (
        <va-loading-indicator
          // data-testid="loading-indicator"
          message="Loading..."
        />
      )}
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        {!fetchingLc &&
          hasFetchedOnce && (
            <>
              <div className="row">
                <h1 className="mobile-lg:vads-u-text-align--left vads-u-margin-bottom--4">
                  Search Results
                </h1>

                <div className="result-info-wrapper">
                  <div className="vads-u-display--flex vads-u-justify-content--space-between  vads-u-align-items--center">
                    <p className="vads-u-color--gray-dark vads-u-margin--0">
                      Showing{' '}
                      {filteredResults.length === 0 && ' 0 results for:'}
                      {`${formatResultCount(
                        filteredResults,
                        currentPage,
                        itemsPerPage,
                      )} of ${filteredResults.length} results for:`}
                    </p>
                    <va-link
                      href={`/lc-search?category=${categoryParam}&state=${stateParam}`}
                      className="back-link"
                      back
                      text="Back to search"
                      onClick={handlePreviousRouteChange}
                    />
                  </div>
                  <p className="lc-filter-option">
                    <strong>Category type: </strong>{' '}
                    {`"${capitalizeFirstLetter(categoryParam)}"`}
                  </p>
                  <p className="lc-filter-option">
                    <strong>State: </strong>{' '}
                    {`${
                      stateParam === 'all'
                        ? `"All"`
                        : `"${ADDRESS_DATA.states[stateParam]}"`
                    }`}
                  </p>
                  <p className="lc-filter-option">
                    <strong>License/Certification name: </strong>{' '}
                    {`"${nameParam}"`}
                  </p>
                </div>
              </div>
              <div className="row">
                {filteredResults.length > 0 ? (
                  <ul className="lc-result-cards-wrapper">
                    {currentResults.map((result, index) => {
                      return (
                        <li className="vads-u-padding-bottom--2" key={index}>
                          <va-card class="vads-u-background-color--gray-lightest vads-u-border--0">
                            <h3 className="vads-u-margin--0">{result.lacNm}</h3>
                            <h4 className="lc-card-subheader vads-u-margin-top--1p5">
                              {result.eduLacTypeNm}
                            </h4>
                            {result.eduLacTypeNm !== 'Certification' && (
                              <p className="state vads-u-margin-y--1">
                                {ADDRESS_DATA.states[result.state]}
                              </p>
                            )}
                            <va-link-action
                              href={`/lc-search/results/${result.enrichedId}`}
                              text={`View test amount details for ${
                                result.lacNm
                              }`}
                              type="secondary"
                              onClick={handleRouteChange(result.enrichedId)}
                            />
                          </va-card>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>
                    We didn't find results based on the selected criteria.
                    Please go back to search and try again.
                  </p>
                )}
              </div>
              {filteredResults.length > 0 && (
                <VaPagination
                  page={currentPage}
                  pages={totalPages}
                  maxPageListLength={itemsPerPage}
                  onPageSelect={e => handlePageChange(e.detail.page)}
                />
              )}
            </>
          )}
      </section>
    </div>
  );
}

LicenseCertificationSearchResults.propTypes = {
  dispatchFetchLicenseCertificationResults: PropTypes.func.isRequired,
  fetchingLc: PropTypes.bool.isRequired,
  hasFetchedOnce: PropTypes.bool.isRequired,
  lcResults: PropTypes.array,
  // error: Proptypes // verify error Proptypes
};

const mapStateToProps = state => ({
  fetchingLc: state.licenseCertificationSearch.fetchingLc,
  hasFetchedOnce: state.licenseCertificationSearch.hasFetchedOnce,
  lcResults: state.licenseCertificationSearch.lcResults,
  // error: // create error state in redux store
});

const mapDispatchToProps = {
  dispatchFetchLicenseCertificationResults: fetchLicenseCertificationResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseCertificationSearchResults);
