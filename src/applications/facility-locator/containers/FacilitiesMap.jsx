import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import mapboxgl from 'mapbox-gl';
import { browserHistory } from 'react-router';
import vaDebounce from 'platform/utilities/data/debounce';
import { isEmpty } from 'lodash';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import recordEvent from 'platform/monitoring/record-event';
import { mapboxToken } from 'platform/utilities/facilities-and-mapbox';
import SegmentedControl from '../components/SegmentedControl';
import {
  clearSearchText,
  clearSearchResults,
  fetchVAFacility,
  searchWithBounds,
  genBBoxFromAddress,
  genSearchAreaFromCenter,
  updateSearchQuery,
  mapMoved,
  geolocateUser,
  clearGeocodeError,
  getProviderSpecialties,
} from '../actions';
import {
  facilitiesPpmsSuppressAll,
  facilitiesUseFlProgressiveDisclosure,
  facilityLocatorPredictiveLocationSearch,
  facilityLocatorMobileMapUpdate,
} from '../utils/featureFlagSelectors';
import NoResultsMessage from '../components/NoResultsMessage';
import ResultsList from '../components/ResultsList';
import PaginationWrapper from '../components/PaginationWrapper';
import SearchControls from '../components/SearchControls';
import SearchResultsHeader from '../components/SearchResultsHeader';
import { FacilitiesMapTypes } from '../types';

import { setFocus, buildMarker, resetMapElements } from '../utils/helpers';
import {
  Covid19Vaccine,
  EMERGENCY_CARE_SERVICES,
  LocationType,
  MapboxInit,
  MAX_SEARCH_AREA,
} from '../constants';
import { distBetween } from '../utils/facilityDistance';
import SearchResult from '../components/SearchResult';
import { recordZoomEvent, recordPanEvent } from '../utils/analytics';
import { otherToolsLink } from '../utils/mapLinks';
import SearchAreaControl from '../components/SearchAreaControl';
import Covid19Result from '../components/search-results-items/Covid19Result';
import Alert from '../components/Alert';
import EmergencyCareAlert from '../components/EmergencyCareAlert';
import ControlResultsHolder from '../components/ControlResultsHolder';
import ControlsAndMapContainer from '../components/ControlsAndMapContainer';
import PpmsServiceError from '../components/PpmsServiceError';

let lastZoom = 3;

const mapboxGlContainer = 'mapbox-gl-container';
const zoomMessageDivID = 'screenreader-zoom-message';

const FacilitiesMap = props => {
  const [map, setMap] = useState(null);
  const [verticalSize, setVerticalSize] = useState(0);
  const [horizontalSize, setHorizontalSize] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 481);
  const [isSmallDesktop, setIsSmallDesktop] = useState(
    window.innerWidth >= 1024,
  );
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 481 && window.innerWidth <= 1023,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  // refs
  const mapboxContainerRef = useRef(null);
  const searchResultTitleRef = useRef(null);
  const searchResultMessageRef = useRef();

  /**
   * Search when the component renders with a sharable url
   */
  const searchWithUrl = () => {
    // Check for scenario when results are in the store
    if (!!props.location.search && props.results && props.results.length > 0) {
      return;
    }
    const { location } = props;

    if (!isEmpty(location.query)) {
      props.updateSearchQuery({
        facilityType: location.query.facilityType,
        serviceType: location.query.serviceType,
      });
    }

    if (location.query.address) {
      const expandedRadius =
        location.query.facilityType === 'benefits' &&
        !location.query.serviceType;

      props.genBBoxFromAddress(
        {
          searchString: location.query.address,
          context: location.query.context,
          facilityType: location.query.facilityType,
        },
        expandedRadius,
        props.useProgressiveDisclosure,
      );
      setIsSearching(true);
    }
  };

  const updateUrlParams = params => {
    const { location, currentQuery } = props;
    const queryParams = {
      ...location.query,
      page: currentQuery.currentPage,
      address: currentQuery.searchString,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      latitude: props.currentQuery.position?.latitude,
      longitude: props.currentQuery.position?.longitude,
      radius: props.currentQuery.radius && props.currentQuery.radius.toFixed(),
      bounds: props.currentQuery.bounds,
      ...params,
    };

    const queryStringObj = appendQuery(
      `/find-locations${location.pathname}`,
      queryParams,
    );

    browserHistory.push(queryStringObj);
  };

  const addMapMarker = useCallback(
    searchCoords => {
      const markerElement = buildMarker('currentPos');
      new mapboxgl.Marker(markerElement)
        .setLngLat([searchCoords.lng, searchCoords.lat])
        .addTo(map);
    },
    [map],
  );

  const renderMarkers = useCallback(
    locations => {
      if (locations.length === 0) return;

      const locationBounds = new mapboxgl.LngLatBounds();

      locations.forEach((loc, index) => {
        const attrs = {
          letter: index + 1,
        };
        locationBounds.extend(
          new mapboxgl.LngLat(loc.attributes.long, loc.attributes.lat),
        );
        const markerElement = buildMarker('location', { loc, attrs });
        new mapboxgl.Marker(markerElement)
          .setLngLat([loc.attributes.long, loc.attributes.lat])
          .addTo(map);
      });

      if (props.currentQuery.searchCoords) {
        const { searchCoords } = props.currentQuery;
        addMapMarker(searchCoords);
        locationBounds.extend(
          new mapboxgl.LngLat(searchCoords.lng, searchCoords.lat),
        );
        map.fitBounds(locationBounds, { padding: 20 });
      }

      if (props.currentQuery.searchArea) {
        const { locationCoords } = props.currentQuery.searchArea;
        addMapMarker(locationCoords);
        locationBounds.extend(
          new mapboxgl.LngLat(locationCoords.lng, locationCoords.lat),
        );
      }
    },
    [addMapMarker, map, props.currentQuery],
  );

  const handleSearch = async () => {
    resetMapElements();
    const { currentQuery } = props;
    const { facilityType, serviceType, searchString } = currentQuery;
    const expandedRadius = facilityType === 'benefits' && !serviceType;
    lastZoom = null;

    updateUrlParams({
      address: searchString,
    });

    props.genBBoxFromAddress(
      {
        ...currentQuery,
      },
      expandedRadius,
    );

    setIsSearching(true);
  };

  const calculateSearchArea = () => {
    const currentBounds = map.getBounds();
    const { _ne, _sw } = currentBounds;
    return distBetween(_ne.lat, _ne.lng, _sw.lat, _sw.lng);
  };

  const handleSearchArea = () => {
    resetMapElements();
    const { currentQuery } = props;
    lastZoom = null;
    const center = map.getCenter().wrap();
    const bounds = map.getBounds();
    recordEvent({
      event: 'fl-search',
      'fl-search-fac-type': currentQuery.facilityType,
      'fl-search-svc-type': currentQuery.serviceType,
    });
    const currentMapBoundsDistance = calculateSearchArea();

    props.genSearchAreaFromCenter({
      lat: center.lat,
      lng: center.lng,
      currentMapBoundsDistance,
      currentBounds: [
        bounds._sw.lng,
        bounds._sw.lat,
        bounds._ne.lng,
        bounds._ne.lat,
      ],
    });
  };

  const handlePageSelect = e => {
    const { page } = e.detail;

    resetMapElements();
    const { currentQuery } = props;
    const coords = currentQuery.position;
    const { radius } = currentQuery;
    const center = [coords.latitude, coords.longitude];
    props.searchWithBounds({
      bounds: currentQuery.bounds,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      page,
      center,
      radius,
    });
  };

  const speakZoom = (searchRadius, zoomDirection) => {
    const screenreaderZoomElement = document.getElementById(zoomMessageDivID);

    if (screenreaderZoomElement) {
      // delay to allow time for the search area button text to be read
      setTimeout(() => {
        screenreaderZoomElement.innerText = `zooming ${zoomDirection}, ${Math.round(
          searchRadius,
        )} miles`;
      }, 750);
    }
  };

  const setMapEventHandlers = () => {
    map.on('dragend', () => {
      props.mapMoved(calculateSearchArea());
      recordPanEvent(map.getCenter(), props.currentQuery);
    });

    map.on('zoomend', e => {
      // Only trigger mapMoved and speakZoom for manual events,
      // e.g. zoom in/out button click, mouse wheel, etc.
      // which will have an originalEvent defined
      if (!e.originalEvent) {
        return;
      }

      const searchRadius = calculateSearchArea();
      const currentZoom = parseInt(map.getZoom(), 10);

      props.mapMoved(searchRadius);

      if (lastZoom && parseInt(lastZoom, 10) > 3) {
        recordZoomEvent(lastZoom, currentZoom);
      }

      if (lastZoom !== currentZoom) {
        const zoomDirection = currentZoom > lastZoom ? 'in' : 'out';
        speakZoom(searchRadius, zoomDirection);
        lastZoom = currentZoom;
      }
    });
  };

  const setupMap = () => {
    const mapContainerElement = document.getElementById(mapboxGlContainer);
    if (!mapContainerElement) {
      return null;
    }

    mapContainerElement.setAttribute('tabindex', 0);

    mapboxgl.accessToken = mapboxToken;
    const mapInit = new mapboxgl.Map({
      container: mapboxGlContainer,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [MapboxInit.centerInit.lng, MapboxInit.centerInit.lat],
      zoom: MapboxInit.zoomInit,
    });

    mapInit.addControl(
      new mapboxgl.NavigationControl({
        // Hide rotation control.
        showCompass: false,
      }),
      'top-left',
    );

    // Remove mapbox logo from tab order
    const mapBoxLogo = document.querySelector(
      'a.mapboxgl-ctrl-logo.mapboxgl-compact',
    );

    if (mapBoxLogo) mapBoxLogo.setAttribute('tabIndex', -1);

    mapInit.on('load', () => {
      mapInit.resize();
    });

    return mapInit;
  };

  /**
   * Setup map on resize
   */
  const setMapResize = () => {
    setTimeout(function() {
      setMap(setupMap());
    }, 10);
  };

  /**
   * Setup map on tab change
   */
  const segmentOnChange = tab => {
    setSelectedTab(tab);
    setMapResize();
  };

  const shouldRenderSearchArea = () => {
    return props.currentQuery?.mapMoved;
  };

  const searchAreaButtonEnabled = () =>
    calculateSearchArea() < MAX_SEARCH_AREA &&
    props.currentQuery.facilityType &&
    (props.currentQuery.facilityType === 'provider'
      ? props.currentQuery.serviceType
      : true);

  const speakMapInstructions = () => {
    const mapInstructionsElement = document.getElementById('map-instructions');

    if (mapInstructionsElement) {
      mapInstructionsElement.innerText =
        'Search areas on the map up to a maximum of 500 miles. ' +
        'Zoom in or out using the zoom in and zoom out buttons. ' +
        'Use a keyboard to navigate up, down, left, and right in the map.';
    }
  };

  // renderMap does not consider progressive disclosure flipper internally
  const renderMap = (mobile, results, smallDesktop) => {
    if (isSearching) {
      return null;
    }
    return (
      <>
        {(results?.length || 0) > 0 ? (
          <h2 className="sr-only">Map of Results</h2>
        ) : null}
        <div id={zoomMessageDivID} aria-live="polite" className="sr-only" />
        <p className="sr-only" id="map-instructions" aria-live="assertive" />
        <div
          id={mapboxGlContainer}
          role="application"
          aria-label="Find VA locations on an interactive map"
          aria-describedby="map-instructions"
          onFocus={() => speakMapInstructions()}
          className={
            mobile
              ? 'mobile'
              : `${smallDesktop ? 'desktop' : 'tablet'}-map-container`
          }
        >
          {shouldRenderSearchArea() && (
            <SearchAreaControl
              isMobile={mobile}
              isEnabled={searchAreaButtonEnabled()}
              handleSearchArea={handleSearchArea}
              query={props.currentQuery}
            />
          )}
        </div>
      </>
    );
  };

  const renderView = () => {
    // This block renders the desktop and mobile view. It ensures that the desktop map
    // gets re-loaded when resizing from mobile to desktop.
    const {
      currentQuery,
      selectedResult,
      results,
      pagination,
      searchError,
      useProgressiveDisclosure,
    } = props;

    const currentPage = pagination ? pagination.currentPage : 1;
    const totalPages = pagination ? pagination.totalPages : 1;
    const { facilityType, serviceType } = currentQuery;
    const queryContext = currentQuery.context;
    const isEmergencyCareType = facilityType === LocationType.EMERGENCY_CARE;
    const isCcpEmergencyCareTypes = EMERGENCY_CARE_SERVICES.includes(
      serviceType,
    );

    const paginationWrapper = () => {
      return (
        <PaginationWrapper
          handlePageSelect={handlePageSelect}
          currentPage={currentPage}
          totalPages={totalPages}
          results={results}
          inProgress={currentQuery.inProgress}
        />
      );
    };

    const resultsList = () => {
      return (
        <ResultsList
          isMobile={isMobile}
          query={currentQuery}
          searchResultMessageRef={searchResultMessageRef}
          updateUrlParams={updateUrlParams}
        />
      );
    };

    // Sometimes the div presents but the map does not get loaded on resize
    const childrenOfMapboxContainer = document.getElementById(mapboxGlContainer)
      ?.children?.length;

    if (
      (map &&
        !isMobile &&
        (!window.document.getElementById(mapboxGlContainer) ||
          (window.document.getElementsByClassName('desktop-map-container')
            .length === 0 &&
            window.document.getElementsByClassName('tablet-map-container')
              .length === 0))) ||
      !childrenOfMapboxContainer
    ) {
      setMapResize();
    }

    return (
      <div
        id="facilities-map-container"
        className={!isMobile ? 'tablet-or-greater-container' : undefined}
        ref={mapboxContainerRef}
      >
        {props.suppressPPMS && (
          <Alert
            displayType="warning"
            title="Some search options aren’t working right now"
            description="We’re sorry. Searches for non-VA facilities such as community providers and urgent care are currently unavailable. We’re working to fix this. Please check back soon."
          />
        )}
        <ControlsAndMapContainer
          isSmallDesktop={!!(isSmallDesktop && useProgressiveDisclosure)}
        >
          <ControlResultsHolder
            isSmallDesktop={!!(isSmallDesktop && useProgressiveDisclosure)}
          >
            {useProgressiveDisclosure ? (
              <PpmsServiceError currentQuery={props.currentQuery} />
            ) : null}
            <SearchControls
              geolocateUser={props.geolocateUser}
              clearGeocodeError={props.clearGeocodeError}
              currentQuery={currentQuery}
              onChange={props.updateSearchQuery}
              onSubmit={handleSearch}
              suppressPPMS={props.suppressPPMS}
              clearSearchText={props.clearSearchText}
              useProgressiveDisclosure={useProgressiveDisclosure}
              isMobile={isMobile}
              isTablet={isTablet}
              isSmallDesktop={isSmallDesktop}
              getProviderSpecialties={props.getProviderSpecialties}
            />
            <EmergencyCareAlert
              shouldShow={isEmergencyCareType || isCcpEmergencyCareTypes}
            />
            <div id="search-results-title" ref={searchResultTitleRef}>
              {!searchError && (
                <SearchResultsHeader
                  results={results}
                  facilityType={facilityType}
                  serviceType={serviceType}
                  context={queryContext}
                  specialtyMap={props.specialties}
                  inProgress={currentQuery.inProgress}
                  pagination={pagination}
                />
              )}
              {searchError && <p />}
            </div>
            {!isMobile && (
              <>
                {isSmallDesktop &&
                  useProgressiveDisclosure && (
                    <div
                      className="search-results-container vads-u-padding-x--0p5 vads-u-padding-top--0p5 columns"
                      id="searchResultsContainer"
                    >
                      <div className="facility-search-results">
                        {resultsList()}
                      </div>
                    </div>
                  )}
                {((!isMobile && !useProgressiveDisclosure) ||
                  (isTablet && useProgressiveDisclosure)) && (
                  <>
                    <div
                      className={
                        !isMobile ? 'tablet-results-map-container' : undefined
                      }
                    >
                      <div
                        className="columns search-results-container vads-u-padding-right--1p5 vads-u-padding-left--0p25"
                        id="searchResultsContainer"
                      >
                        <div className="facility-search-results">
                          {resultsList()}
                        </div>
                      </div>
                      {renderMap(
                        false,
                        results,
                        isSmallDesktop && useProgressiveDisclosure,
                      )}
                    </div>
                    {paginationWrapper()}
                  </>
                )}
              </>
            )}
          </ControlResultsHolder>
          {isSmallDesktop &&
            useProgressiveDisclosure && (
              <div className="map-and-message-container">
                {renderMap(
                  false,
                  results,
                  isSmallDesktop && useProgressiveDisclosure,
                )}
              </div>
            )}
        </ControlsAndMapContainer>
        {isSmallDesktop && useProgressiveDisclosure && paginationWrapper()}

        {isMobile && (
          <div className="columns small-12">
            {props.facilityLocatorMobileMapUpdate ? (
              <>
                <SegmentedControl
                  a11yLabels={['View List', 'View Map']}
                  labels={['View List', 'View Map']}
                  onChange={segmentOnChange}
                  selected={selectedTab}
                />
                <>
                  {selectedTab === 0 ? (
                    <>
                      <div className="facility-search-results">
                        {resultsList()}
                      </div>
                      {paginationWrapper()}{' '}
                    </>
                  ) : (
                    <>
                      {renderMap(true, results)}
                      {currentQuery.searchStarted &&
                        !results.length && (
                          <NoResultsMessage
                            resultRef={searchResultMessageRef}
                            resultsFound={false}
                            searchStarted
                          />
                        )}
                      {selectedResult && (
                        <div className="mobile-search-result">
                          {currentQuery.serviceType === Covid19Vaccine ? (
                            <Covid19Result location={selectedResult} />
                          ) : (
                            <SearchResult
                              result={selectedResult}
                              query={currentQuery}
                            />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              </>
            ) : (
              <Tabs>
                <TabList>
                  <Tab className="small-6 tab">View List</Tab>
                  <Tab onClick={setMapResize} className="small-6 tab">
                    View Map
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="facility-search-results">{resultsList()}</div>
                  {paginationWrapper()}
                </TabPanel>
                <TabPanel>
                  {renderMap(true, results, false)}
                  {currentQuery.searchStarted &&
                    !results.length && (
                      <NoResultsMessage
                        resultRef={searchResultMessageRef}
                        resultsFound={false}
                        searchStarted
                      />
                    )}
                  {selectedResult && (
                    <div className="mobile-search-result">
                      {currentQuery.serviceType === Covid19Vaccine ? (
                        <Covid19Result location={selectedResult} />
                      ) : (
                        <SearchResult
                          result={selectedResult}
                          query={currentQuery}
                        />
                      )}
                    </div>
                  )}
                </TabPanel>
              </Tabs>
            )}
          </div>
        )}
      </div>
    );
  };

  const searchCurrentArea = () => {
    const { currentQuery } = props;
    const { searchArea, context, searchString } = currentQuery;
    const coords = currentQuery.position;
    const { radius } = currentQuery;
    const center = [coords.latitude, coords.longitude];
    if (searchArea) {
      updateUrlParams({
        context,
        searchString,
      });
      props.searchWithBounds({
        bounds: props.currentQuery.bounds,
        facilityType: props.currentQuery.facilityType,
        serviceType: props.currentQuery.serviceType,
        page: props.currentQuery.currentPage,
        center,
        radius,
      });
    }
  };

  const setUpResizeEventListener = () => {
    const setBreakpoints = () => {
      const screenIsMobile = window.innerWidth <= 481;
      const screenIsSmallDesktop = window.innerWidth >= 1024;
      const screenIsTablet =
        window.innerWidth > 481 && window.innerWidth <= 1023;

      setIsMobile(screenIsMobile);
      setIsSmallDesktop(screenIsSmallDesktop);
      setIsTablet(screenIsTablet);
    };
    const debouncedResize = vaDebounce(250, setBreakpoints);
    searchWithUrl();

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  };

  const handleSearchOnQueryChange = () => {
    if (isSearching) {
      updateUrlParams({
        context: props.currentQuery.context,
        address: props.currentQuery.searchString,
      });
      const { currentQuery } = props;
      const coords = currentQuery.position;
      const { radius } = currentQuery;
      const center = [coords.latitude, coords.longitude];
      const resultsPage = currentQuery.currentPage;

      if (!props.searchBoundsInProgress) {
        props.searchWithBounds({
          bounds: props.currentQuery.bounds,
          facilityType: props.currentQuery.facilityType,
          serviceType: props.currentQuery.serviceType,
          page: resultsPage,
          center,
          radius,
        });
        setIsSearching(false);
      }
    }
  };

  const handleMapOnNoResultsFound = () => {
    if (
      props.results &&
      props.results.length === 0 &&
      map &&
      props.currentQuery.searchCoords
    ) {
      const { searchCoords } = props.currentQuery;
      const locationBounds = new mapboxgl.LngLatBounds();
      addMapMarker(searchCoords);
      locationBounds.extend(
        new mapboxgl.LngLat(searchCoords.lng, searchCoords.lat),
      );
      map.fitBounds(locationBounds, { maxZoom: 12 });
    }
  };

  useEffect(
    () => {
      if (map) {
        setMapEventHandlers();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, props.currentQuery.searchCoords],
  );

  useEffect(
    () => {
      searchCurrentArea();
    },
    [props.currentQuery.searchArea],
  );

  useEffect(() => {
    setMap(setupMap());
    setUpResizeEventListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <-- empty array means 'run once'

  useEffect(
    () => {
      handleSearchOnQueryChange();
    },
    [props.currentQuery.id],
  );

  useEffect(
    () => {
      if (!map) return;
      renderMarkers(props.results);
    },
    [props.results, map],
  );

  useEffect(
    () => {
      if (searchResultTitleRef.current && props.resultTime) {
        setFocus(searchResultTitleRef.current);
      }
    },
    [props.resultTime],
  );

  useEffect(
    () => {
      handleMapOnNoResultsFound();
    },
    [props.currentQuery.searchCoords, props.results],
  );

  useEffect(
    () => {
      if (searchResultMessageRef.current) {
        setFocus(searchResultMessageRef.current);
      }
    },
    [props.results, props.currentQuery.inProgress, props.searchError],
  );

  useEffect(
    () => {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { height, width } = entry.contentRect;
          setTimeout(() => {
            // to prevent the map from being resized multiple times
            setVerticalSize(height);
            setHorizontalSize(width);
          }, 200);
        }
      });

      if (mapboxContainerRef.current && props.useProgressiveDisclosure) {
        resizeObserver.observe(mapboxContainerRef.current);
      } else {
        resizeObserver.disconnect();
      }
      return () => {
        resizeObserver.disconnect();
      };
    },
    [mapboxContainerRef, props.useProgressiveDisclosure],
  );

  useEffect(
    () => {
      if (map && !isMobile) {
        map.resize();
      }
    },
    [map, horizontalSize, verticalSize, isMobile],
  );

  return (
    <>
      <h1 className="vads-u-margin-x--2 medium-screen:vads-u-margin-x--2">
        Find VA locations
      </h1>
      <p className="vads-u-margin-x--2 medium-screen:vads-u-margin-x--2 vads-u-margin-bottom--4">
        Find a VA location or in-network community care provider. For same-day
        care for minor illnesses or injuries, select Urgent care for facility
        type.
      </p>
      {renderView()}
      {otherToolsLink()}
    </>
  );
};

const mapStateToProps = state => ({
  facilityLocatorMobileMapUpdate: facilityLocatorMobileMapUpdate(state),
  currentQuery: state.searchQuery,
  suppressPPMS: facilitiesPpmsSuppressAll(state),
  usePredictiveGeolocation: facilityLocatorPredictiveLocationSearch(state),
  useProgressiveDisclosure: facilitiesUseFlProgressiveDisclosure(state),
  results: state.searchResult.results,
  searchError: state.searchResult.error,
  resultTime: state.searchResult.resultTime,
  pagination: state.searchResult.pagination,
  selectedResult: state.searchResult.selectedResult,
  specialties: state.searchQuery.specialties,
});

const mapDispatchToProps = {
  geolocateUser,
  clearGeocodeError,
  fetchVAFacility,
  updateSearchQuery,
  genBBoxFromAddress,
  genSearchAreaFromCenter,
  getProviderSpecialties,
  searchWithBounds,
  clearSearchResults,
  clearSearchText,
  mapMoved,
};

FacilitiesMap.propTypes = FacilitiesMapTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilitiesMap);
