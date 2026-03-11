/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import repStatusLoader from 'platform/user/widgets/representative-status';
import { useLocation } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
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

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = useSelector(state => state.searchQuery);
  const isErrorGeocode = useSelector(state => state.errors.isErrorGeocode);
  const searchResults = useSelector(state => state.searchResult.searchResults);

  const previousLocationInputString = useRef(searchQuery.locationInputString);
  const previousSortType = useRef(searchQuery.sortType);
  const previousRepresentativeType = useRef(searchQuery.representativeType);
  const previousRepresentativeInputString = useRef(
    searchQuery.representativeInputString,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisplayingResults, setIsDisplayingResults] = useState(false);

  const isPostLogin = location.search.includes('postLogin=true');

  const resultsArePresent =
    location.search.length <= 1 || searchResults?.length > 0;

  const store = useStore();
  const dispatch = useDispatch();

  const updateUrlParams = params => {
    const newSearchParams = new URLSearchParams({
      address: searchQuery.locationInputString,
      lat: searchQuery.position?.latitude,
      long: searchQuery.position?.longitude,
      page: searchQuery.page || 1,
      perPage: 10,
      sort: searchQuery.sortType?.toLowerCase(),
      type: searchQuery.representativeType,
      name: searchQuery.representativeInputString,
      organization: searchQuery.organization,
      ...params,
    });

    if (searchQuery.committedSearchQuery.searchArea !== null) {
      newSearchParams.set(
        'distance',
        searchQuery.committedSearchQuery.searchArea,
      );
    }

    navigate({ search: `?${newSearchParams}` }, { replace: true });
  };

  const handleSearch = async () => {
    dispatch(clearError(ErrorTypes.geocodeError));
    setIsSearching(true);
    dispatch(geocodeUserAddress(searchQuery));
    // search query committed in geocodeUserAddress function
  };

  const handleSearchViaUrl = () => {
    if (resultsArePresent || isPostLogin) {
      return;
    }

    setIsSearching(true);

    const queryUpdateCommitPayload = {
      id: Date.now(),
      context: {
        location: searchParams.get('address'),
        repOrgName: searchParams.get('name'),
      },
      locationQueryString: searchParams.get('address'),
      locationInputString: searchParams.get('address'),
      position: {
        latitude: searchParams.get('lat'),
        longitude: searchParams.get('long'),
      },
      representativeQueryString: location.query.name,
      representativeInputString: location.query.name,
      representativeType: location.query.type,
      organization: location.query.organization,
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
      organization,
    } = searchQuery.committedSearchQuery;

    const { latitude, longitude } = position;

    setIsSearching(true);

    const distance = searchArea === 'Show all' ? null : searchArea;

    updateUrlParams({
      address: context.location,
      name: representativeInputString ?? '',
      lat: latitude,
      long: longitude,
      type: representativeType,
      page: page || 1,
      sort: sortType,
      distance,
      organization: organization ?? '',
    });

    if (!searchQuery.searchWithInputInProgress) {
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
      if (context.location !== previousLocationInputString.current) {
        recordSearchResultsChange(dataLayerProps, 'location');
        previousLocationInputString.current = context.location;
      } else {
        if (sortType !== previousSortType.current) {
          recordSearchResultsChange(dataLayerProps, 'sort', sortType);
          previousSortType.current = sortType;
        }

        if (representativeType !== previousRepresentativeType.current) {
          recordSearchResultsChange(
            dataLayerProps,
            'filter',
            representativeType,
          );
          previousRepresentativeType.current = representativeType;
        }
        if (
          representativeInputString !==
          previousRepresentativeInputString.current
        ) {
          recordSearchResultsChange(
            dataLayerProps,
            'filter',
            representativeInputString,
          );
          previousRepresentativeInputString.current = representativeInputString;
        }
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
          organization,
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
      if (isSearching && !isErrorGeocode) {
        handleSearchOnQueryChange();
      }
    },
    [searchQuery.committedSearchQuery.id],
  );

  // Trigger request on sort update
  useEffect(
    () => {
      if (searchQuery.searchCounter > 0) {
        handleSearchOnQueryChange();
      }
    },
    [
      searchQuery.committedSearchQuery.sortType,
      searchQuery.committedSearchQuery.page,
    ],
  );

  useEffect(
    () => {
      if (isSearching && isErrorGeocode) {
        setIsSearching(false);
      }
    },
    [isErrorGeocode],
  );

  // search complete
  useEffect(
    () => {
      if (searchQuery.searchCounter > 0) {
        setIsSearching(false);
        setIsLoading(false);
        setIsDisplayingResults(true);
      }
    },
    [searchQuery.searchCounter],
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

export default SearchPage;
