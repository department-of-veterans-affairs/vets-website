import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaLoadingIndicator,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import { fetchLicenseCertificationResults } from '../actions';
import {
  capitalizeFirstLetter,
  filterLcResults,
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
  const { name, categoryParam, stateParam } = showLcParams(location);

  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatResultCount = (_currentPage, _itemsPerPage) => {
    if (_currentPage * _itemsPerPage > filteredResults.length) {
      return `${_currentPage * _itemsPerPage - (_itemsPerPage - 1)} - ${
        filteredResults.length
      }  `;
    }

    return `${_currentPage * _itemsPerPage -
      (_itemsPerPage - 1)} - ${_currentPage * _itemsPerPage}  `;
  };

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
        const results = filterLcResults(lcResults, name, {
          type: categoryParam,
          state: stateParam,
        });
        setFilteredResults(results);
      }
    },
    [lcResults],
  );

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  // if (error) {
  //   {/* ERROR STATE */}
  // }

  return (
    <div>
      {fetchingLc && (
        <VaLoadingIndicator
          // data-testid="loading-indicator"
          message="Loading..."
        />
      )}
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        {!fetchingLc &&
          hasFetchedOnce && (
            <>
              <div className="row">
                <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
                  Licenses and Certifications Search Results
                </h1>

                <p className="vads-u-color--gray-dark lc-filter-options">
                  Showing {filteredResults.length === 0 && ' 0 results for:'}
                  {filteredResults.length > itemsPerPage
                    ? `${formatResultCount(currentPage, itemsPerPage)} of ${
                        filteredResults.length
                      } results for: `
                    : `${filteredResults.length}
                  of ${filteredResults.length} results for: `}
                </p>
                <p className="lc-filter-option">
                  <strong>Category type: </strong>{' '}
                  {`"${capitalizeFirstLetter(categoryParam)}"`}
                </p>
                <p className="lc-filter-option">
                  <strong>State: </strong>{' '}
                  {`${stateParam === 'all' ? `"All"` : `"${stateParam}"`}`}
                </p>
                <p className="lc-filter-option">
                  <strong>License/Certification Name: </strong> {`"${name}"`}
                </p>
              </div>
              <div className="row">
                {filteredResults.length > 0 ? (
                  currentResults.map((result, index) => {
                    return (
                      <div className="vads-u-padding-bottom--2" key={index}>
                        <va-card class="vads-u-background-color--gray-lightest">
                          <h3 className="vads-u-margin--0">{result.name}</h3>
                          <h4 className="lc-card-subheader vads-u-margin-y--1p5">
                            {result.type}
                          </h4>
                          <va-link-action
                            href={`results/${result.link.split('lce/')[1]}`}
                            text="View test amount details"
                            type="secondary"
                          />
                        </va-card>
                      </div>
                    );
                  })
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
