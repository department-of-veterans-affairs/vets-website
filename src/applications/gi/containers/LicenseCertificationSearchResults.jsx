import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import { fetchLicenseCertificationResults } from '../actions';
import { filterLcResults } from '../utils/helpers';

function LicenseCertificationSearchResults({
  dispatchFetchLicenseCertificationResults,
  lcResults,
  fetchingLc,
  hasFetchedOnce,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredResults, setFilteredResults] = useState(lcResults);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name') ?? 'all';
  const category = searchParams.get('category') ?? 'all';
  const state = searchParams.get('state') ?? 'all';

  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  // const currentResults = lcResults.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage,
  // );

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
        const results = filterLcResults(lcResults, name, { type: category });
        setFilteredResults(results);
      }
    },
    [lcResults],
  );

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  if (fetchingLc) {
    return <h2>Loading</h2>;
  }

  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        {hasFetchedOnce && filteredResults.length !== 0 ? (
          <>
            <div className="row">
              <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
                Licenses and Certifications Search Results
              </h1>

              <p className="vads-u-color--gray-dark lc-filter-options">
                Showing{' '}
                {filteredResults.length > itemsPerPage
                  ? itemsPerPage
                  : filteredResults.length}{' '}
                of {filteredResults.length} results for: {name || null}
              </p>
              <p className="lc-filter-option">
                <strong>Category type: </strong> {`"${category}"`}
              </p>
              <p className="lc-filter-option">
                <strong>State: </strong> {`"${state}"`}
              </p>
              <p className="lc-filter-option">
                <strong>License/Certification Name: </strong> {`"${name}"`}
              </p>
            </div>
            <div className="row">
              {filteredResults.map((result, index) => {
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
              })}
            </div>
            <VaPagination
              page={currentPage}
              pages={totalPages}
              maxPageListLength={itemsPerPage}
              onPageSelect={e => handlePageChange(e.detail.page)}
            />
          </>
        ) : (
          <div className="row">
            <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
              Licenses and Certifications Search Results
            </h1>

            <p>No results for this search</p>
          </div>
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
};

const mapStateToProps = state => ({
  fetchingLc: state.licenseCertificationSearch.fetchingLc,
  hasFetchedOnce: state.licenseCertificationSearch.hasFetchedOnce,
  lcResults: state.licenseCertificationSearch.lcResults,
});

const mapDispatchToProps = {
  dispatchFetchLicenseCertificationResults: fetchLicenseCertificationResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LicenseCertificationSearchResults);
