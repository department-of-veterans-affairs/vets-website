import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ADDRESS_DATA from 'platform/forms/address/data';

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import {
  capitalizeFirstLetter,
  formatResultCount,
  showLcParams,
} from '../utils/helpers';
import { useLcpFilter } from '../utils/useLcpFilter';
import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';

export default function LicenseCertificationSearchResults({
  // error,
  flag,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const history = useHistory();

  const { hasFetchedOnce, fetchingLc, filteredResults, error } = useSelector(
    state => state.licenseCertificationSearch,
  );

  const { nameParam, categoryParam, stateParam } = showLcParams(location);

  useLcpFilter({
    flag,
    name: nameParam,
    categoryValue: categoryParam,
    locationValue: stateParam,
  });

  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePageChange = page => {
    setCurrentPage(page);
    window.scroll({ top: 0, bottom: 0, behavior: 'smooth' }); // troubleshoot scrollTo functions in platform to align with standards
  };

  const handleRouteChange = id => event => {
    event.preventDefault();
    history.push(`/lc-search/results/${id}`);
  };

  const handlePreviousRouteChange = event => {
    event.preventDefault();
    history.push(`/lc-search?category=${categoryParam}&state=${stateParam}`);
  };

  return (
    <div>
      {fetchingLc && (
        <va-loading-indicator
          // data-testid="loading-indicator"
          message="Loading..."
        />
      )}
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        {error && (
          <div className="row">
            <LicesnseCertificationServiceError />
          </div>
        )}
        {!fetchingLc &&
          hasFetchedOnce && (
            <>
              <div className="row">
                <h1 className="mobile-lg:vads-u-text-align--left vads-u-margin-bottom--4">
                  Search Results
                </h1>

                <div className="lc-result-info-wrapper">
                  <div className="vads-u-display--flex vads-u-justify-content--space-between  vads-u-align-items--center">
                    <p className="vads-u-color--gray-dark vads-u-margin--0">
                      Showing{' '}
                      {filteredResults.length - 1 === 0
                        ? ' 0 results for:'
                        : `${formatResultCount(
                            filteredResults,
                            currentPage,
                            itemsPerPage,
                          )} of ${filteredResults.length - 1} results for:`}
                    </p>
                    <va-link
                      href={`/lc-search?category=${categoryParam}&state=${stateParam}`}
                      class="back-link"
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
                {filteredResults.length - 1 > 0 ? (
                  <ul className="lc-result-cards-wrapper">
                    {currentResults.map((result, index) => {
                      if (index === 0) return null;
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
              {filteredResults.length > itemsPerPage && (
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
  flag: PropTypes.string,
  // error: Proptypes // verify error Proptypes
};
