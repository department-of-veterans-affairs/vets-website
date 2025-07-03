import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { intersection, difference } from 'lodash';

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import TravelClaimCard from './TravelClaimCard';
import TravelPayClaimFilters from './TravelPayClaimFilters';
import ErrorAlert from './alerts/ErrorAlert';

const TravelPayStatusList = ({ claims, canViewClaimDetails }) => {
  const { data, error } = claims;
  const CLAIMS_PER_PAGE = 10;

  const filterInfoRef = useRef();

  const [selectedClaimsOrder, setSelectedClaimsOrder] = useState('mostRecent');
  const [orderClaimsBy, setOrderClaimsBy] = useState('mostRecent');
  const [currentPage, setCurrentPage] = useState(1);

  const [statusesToFilterBy, setStatusesToFilterBy] = useState([]);
  const [checkedStatusFilters, setCheckedStatusFilters] = useState([]);
  const [appliedStatusFilters, setAppliedStatusFilters] = useState([]);

  if (!error && data.length > 0 && statusesToFilterBy.length === 0) {
    // Sets initial status filters after travelClaims load

    const topStatuses = new Set(['On hold', 'Denied', 'In manual review']);
    const availableStatuses = new Set(data.map(c => c.claimStatus));

    const availableTopStatuses = intersection(
      Array.from(topStatuses),
      Array.from(availableStatuses),
    );

    const availableNonTopStatuses = difference(
      Array.from(availableStatuses),
      Array.from(topStatuses),
    ).sort(); // .sort() ensures statuses are alphabetized

    const orderedStatusFilters = availableTopStatuses.concat(
      availableNonTopStatuses,
    );
    setStatusesToFilterBy(orderedStatusFilters);
  }

  const compareClaimsDate = (a, b) => {
    // Date.parse(null) evaluates to NaN, which is falsy. By including
    // the OR condition, any comparison with a null appointmentDateTime
    // will fallback to comparing the createOn value instead.
    return (
      Date.parse(b.appointmentDateTime) - Date.parse(a.appointmentDateTime) ||
      Date.parse(b.createdOn) - Date.parse(a.createdOn)
    );
  };

  switch (orderClaimsBy) {
    case 'mostRecent':
      data.sort((a, b) => compareClaimsDate(a, b));
      break;
    case 'oldest':
      data.sort((a, b) => compareClaimsDate(b, a));
      break;
    default:
      break;
  }

  const resetSearch = () => {
    setAppliedStatusFilters([]);
    setCheckedStatusFilters([]);
    setSelectedClaimsOrder('mostRecent');
    setOrderClaimsBy('mostRecent');
    setCurrentPage(1);
    filterInfoRef.current.focus();
  };

  const applyFilters = () => {
    setAppliedStatusFilters(checkedStatusFilters);
    setOrderClaimsBy(selectedClaimsOrder);
    setCurrentPage(1);
    filterInfoRef.current.focus();
  };

  const onStatusFilterChange = e => {
    const statusName = e.target.name;

    if (e.target.checked) {
      setCheckedStatusFilters([...checkedStatusFilters, statusName]);
    } else {
      setCheckedStatusFilters(
        checkedStatusFilters.filter(
          statusFilter => statusFilter !== statusName,
        ),
      );
    }
  };

  let displayedClaims = data.filter(claim => {
    return (
      appliedStatusFilters.length === 0 ||
      appliedStatusFilters.includes(claim.claimStatus)
    );
  });

  const numResults = displayedClaims.length;
  const shouldPaginate = displayedClaims.length > CLAIMS_PER_PAGE;
  const numPages = Math.ceil(displayedClaims.length / CLAIMS_PER_PAGE);

  const pageStart = (currentPage - 1) * CLAIMS_PER_PAGE + 1;
  const pageEnd = Math.min(currentPage * CLAIMS_PER_PAGE, numResults);

  if (shouldPaginate) {
    displayedClaims = displayedClaims.slice(pageStart - 1, pageEnd);
  }

  const resultsText = () => {
    let sortAndFilterText;

    if (orderClaimsBy === 'mostRecent') {
      sortAndFilterText = 'newest first';
    }

    if (orderClaimsBy === 'oldest') {
      sortAndFilterText = 'oldest first';
    }

    const appliedFiltersLength = appliedStatusFilters.length;

    if (appliedFiltersLength > 0) {
      sortAndFilterText += `, with ${appliedFiltersLength} ${
        appliedFiltersLength === 1 ? 'filter' : 'filters'
      } applied`;
    }

    if (numResults === 0 && appliedFiltersLength > 0) {
      // Note that appliedFiltersLength === 1 should never be true here, since
      // 0 claims matching a single filter should mean the filter isn't shown
      return `Showing 0 claims with ${appliedFiltersLength} ${
        appliedFiltersLength === 1 ? 'filter' : 'filters'
      } applied`;
    }

    return numResults === 0
      ? `Showing ${numResults} claims`
      : `Showing ${pageStart} ‒ ${pageEnd} of ${numResults} claims, sorted by ${sortAndFilterText}.`;
  };

  const onPageSelect = useCallback(
    selectedPage => {
      setCurrentPage(selectedPage);
      filterInfoRef.current.focus();
    },
    [setCurrentPage],
  );

  return (
    <>
      {!error && (
        <>
          <TravelPayClaimFilters
            statusesToFilterBy={statusesToFilterBy}
            checkedStatusFilters={checkedStatusFilters}
            onStatusFilterChange={onStatusFilterChange}
            applyFilters={applyFilters}
            resetSearch={resetSearch}
            selectedClaimsOrder={selectedClaimsOrder}
            setSelectedClaimsOrder={setSelectedClaimsOrder}
          />
          <h2 tabIndex={-1} ref={filterInfoRef} id="pagination-info">
            {resultsText()}
          </h2>
        </>
      )}

      <section id="travel-claims-list" className="travel-claim-list-container">
        {displayedClaims.map(travelClaim => (
          <TravelClaimCard
            key={travelClaim.id}
            {...travelClaim}
            canViewClaimDetails={canViewClaimDetails}
          />
        ))}
      </section>
      {shouldPaginate && (
        <VaPagination
          onPageSelect={e => onPageSelect(e.detail.page)}
          page={currentPage}
          pages={numPages}
        />
      )}
      {!error && data.length === 0 && <p>No travel claims to show.</p>}
      {error && (
        <div className="vads-u-margin-top--2">
          <ErrorAlert errorStatus={error.errors[0].status} />
        </div>
      )}
    </>
  );
};

export default TravelPayStatusList;

TravelPayStatusList.propTypes = {
  canViewClaimDetails: PropTypes.bool,
  claims: PropTypes.shape({
    data: PropTypes.array,
    error: PropTypes.object,
    metadata: PropTypes.object,
  }),
};
