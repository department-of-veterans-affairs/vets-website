/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { isEmpty } from 'lodash';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
import repStatusLoader from 'platform/user/widgets/representative-status';
import { recordSearchResultsChange } from '../utils/analytics';
import GetFormHelp from '../components/footer/GetFormHelp';
import { ErrorTypes } from '../constants';

import {
  searchWithInput,
  updateSearchQuery,
  commitSearchQuery,
  geocodeUserAddress,
  clearError,
} from '../actions';
import SearchSection from '../components/search/SearchSection';
import ResultsSection from '../components/results/ResultsSection';

const SearchPage = props => {
  const currentQuery = useSelector(state => state.searchQuery);
  const errors = useSelector(state => state.errors);
  const searchResults = useSelector(state => state.searchResult.searchResults);
  const { searchWithInputInProgress } = currentQuery;

  const previousLocationInputString = useRef(currentQuery.locationInputString);
  const previousSortType = useRef(currentQuery.sortType);
  const previousRepresentativeType = useRef(currentQuery.representativeType);
  const previousRepresentativeInputString = useRef(
    currentQuery.representativeInputString,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisplayingResults, setIsDisplayingResults] = useState(false);

  const isPostLogin = props.location?.search?.includes('postLogin=true');

  const resultsArePresent =
    (props.location?.search && searchResults?.length > 0) ||
    isEmpty(props.location.query);

  const store = useStore();
  const dispatch = useDispatch();

  const updateUrlParams = params => {
    const { location } = props;

    const queryParams = {
      address: currentQuery.locationInputString,
      lat: currentQuery.position?.latitude,
      long: currentQuery.position?.longitude,
      page: currentQuery.page || 1,
      perPage: 10,
      sort: currentQuery.sortType?.toLowerCase(),
      type: currentQuery.representativeType,
      name: currentQuery.representativeInputString,
      organizationFilter: currentQuery.organizationFilter,
      ...params,
    };

    if (currentQuery.committedSearchQuery.searchArea !== null) {
      queryParams.distance = currentQuery.committedSearchQuery.searchArea;
    }

    const queryStringObj = appendQuery(
      `/get-help-from-accredited-representative/find-rep${location.pathname}`,
      queryParams,
    );
    browserHistory.push(queryStringObj);
  };

  const handleSearch = async () => {
    dispatch(clearError(ErrorTypes.geocodeError));
    setIsSearching(true);
    dispatch(geocodeUserAddress(currentQuery));
    // search query committed in geocodeUserAddress function
  };

  const handleSearchViaUrl = () => {
    const { location } = props;

    if (resultsArePresent || isPostLogin) {
      return;
    }

    setIsSearching(true);

    const queryUpdateCommitPayload = {
      id: Date.now(),
      context: {
        location: location.query.address,
        repOrgName: location.query.name,
      },
      locationQueryString: location.query.address,
      locationInputString: location.query.address,
      position: {
        latitude: location.query.lat,
        longitude: location.query.long,
      },
      representativeQueryString: location.query.name,
      representativeInputString: location.query.name,
      representativeType: location.query.type,
      organizationFilter: location.query.organizationFilter,
      page: location.query.page,
      sortType: location.query.sort,
      searchArea: location.query.distance,
    };

    dispatch(updateSearchQuery(queryUpdateCommitPayload));
    dispatch(commitSearchQuery(queryUpdateCommitPayload));
  };

  const handleSearchOnQueryChange = () => {
    const {
      context,
      representativeInputString,
      representativeType,
      position,
      sortType,
      page,
      searchArea,
      organizationFilter,
    } = currentQuery.committedSearchQuery;

    const { latitude, longitude } = position;

    setIsSearching(true);

    const distance = searchArea === 'Show all' ? null : searchArea;

    updateUrlParams({
      address: context.location,
      name: representativeInputString || null,
      lat: latitude,
      long: longitude,
      type: representativeType,
      page: page || 1,
      sort: sortType,
      distance,
      organizationFilter,
    });

    if (!searchWithInputInProgress) {
      const dataLayerProps = {
        locationInputString: context.location,
        representativeType,
        searchRadius: distance,
        representativeName: representativeInputString,
        sortType,
        totalCount: searchResults?.meta?.totalEntries,
        totalPages: searchResults?.meta?.totalPages,
        currentPage: searchResults?.meta?.currentPage,
      };

      const locationUpdated =
        context.location !== previousLocationInputString.current;

      const sortTypeUpdated = sortType !== previousSortType.current;

      const repTypeUpdated =
        representativeType !== previousRepresentativeType.current;

      const repNameUpdated =
        representativeInputString !== previousRepresentativeInputString.current;

      if (locationUpdated) {
        recordSearchResultsChange(dataLayerProps, 'location');
        previousLocationInputString.current = context.location;
        return;
      }

      if (sortTypeUpdated) {
        recordSearchResultsChange(dataLayerProps, 'sort', sortType);
        previousSortType.current = sortType;
      }

      if (repTypeUpdated) {
        recordSearchResultsChange(dataLayerProps, 'filter', representativeType);
        previousRepresentativeType.current = representativeType;
      }
      if (repNameUpdated) {
        recordSearchResultsChange(
          dataLayerProps,
          'filter',
          representativeInputString,
        );
        previousRepresentativeInputString.current = representativeInputString;
      }

      dispatch(
        searchWithInput({
          address: context.location,
          lat: latitude,
          long: longitude,
          name: representativeInputString,
          page,
          perPage: 10,
          sort: sortType,
          type: representativeType,
          distance,
          organizationFilter,
        }),
      );

      setIsSearching(false);
      setIsLoading(true);
      setIsDisplayingResults(false);
    }
  };

  const handlePageSelect = e => {
    const { page } = e.detail;
    setIsSearching(true);

    const queryUpdateCommitPayload = {
      id: Date.now(),
      page,
    };

    dispatch(updateSearchQuery(queryUpdateCommitPayload));
    dispatch(commitSearchQuery(queryUpdateCommitPayload));
  };

  // Trigger request on query update following search
  useEffect(
    () => {
      if (isSearching && !errors.isErrorGeocode) {
        handleSearchOnQueryChange();
      }
    },
    [currentQuery.committedSearchQuery.id],
  );

  // Trigger request on sort update
  useEffect(
    () => {
      if (currentQuery.searchCounter > 0) {
        handleSearchOnQueryChange();
      }
    },
    [
      currentQuery.committedSearchQuery.sortType,
      currentQuery.committedSearchQuery.page,
    ],
  );

  useEffect(
    () => {
      if (isSearching && errors.isErrorGeocode) {
        setIsSearching(false);
      }
    },
    [errors.isErrorGeocode],
  );

  // search complete
  useEffect(
    () => {
      if (currentQuery.searchCounter > 0) {
        setIsSearching(false);
        setIsLoading(false);
        setIsDisplayingResults(true);
      }
    },
    [currentQuery.searchCounter],
  );

  // jump to results
  useEffect(
    () => {
      if (isDisplayingResults) {
        window.scrollTo(0, 600);
        focusElement('#search-results-subheader');
      }
    },
    [isDisplayingResults],
  );

  // search from query params on page load
  useEffect(() => {
    handleSearchViaUrl();
    repStatusLoader(store, 'representative-status', 3);
  }, []);

  const breadcrumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/get-help-from-accredited-representative',
      label: 'Get help from a VA accredited representative or VSO',
    },
    {
      href: '/get-help-from-accredited-representative/find-rep',
      label: 'Find a VA accredited representative or VSO',
    },
  ];

  return (
    <>
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <nav className="va-nav-breadcrumbs">
            <VaBreadcrumbs breadcrumbList={breadcrumbs} uswds />
          </nav>
          <article className="usa-content">
            <SearchSection onSearch={handleSearch} />
            <ResultsSection
              isDisplayingResults={isDisplayingResults}
              isLoading={isLoading}
              onPageSelect={handlePageSelect}
            />
            <GetFormHelp />
          </article>
        </div>
      </div>
    </>
  );
};

SearchPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.shape({
      address: PropTypes.string,
      distance: PropTypes.string,
      name: PropTypes.string,
      lat: PropTypes.string,
      long: PropTypes.string,
      page: PropTypes.string,
      perPage: PropTypes.string,
      sort: PropTypes.string,
      type: PropTypes.string,
      searchArea: PropTypes.string,
    }),
    search: PropTypes.string,
  }),
};

export default SearchPage;
