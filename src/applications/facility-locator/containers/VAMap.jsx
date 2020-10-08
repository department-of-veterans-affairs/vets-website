import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { FeatureGroup, Map, TileLayer } from 'react-leaflet';
import mapboxClient from '../components/MapboxClient';
import { mapboxToken } from '../utils/mapboxToken';
import { debounce, isEmpty } from 'lodash';
import appendQuery from 'append-query';
import {
  clearSearchResults,
  fetchVAFacility,
  genBBoxFromAddress,
  searchWithBounds,
  updateSearchQuery,
} from '../actions';
import SearchControls from '../components/SearchControls';
import ResultsList from '../components/ResultsList';
import SearchResult from '../components/SearchResult';
import FacilityMarker from '../components/markers/FacilityMarker';
import CurrentPositionMarker from '../components/markers/CurrentPositionMarker';
import { BOUNDING_RADIUS, MARKER_LETTERS } from '../constants';
import { areGeocodeEqual, setFocus } from '../utils/helpers';
import {
  facilitiesPpmsSuppressPharmacies,
  facilitiesPpmsSuppressCommunityCare,
  facilityLocatorPredictiveLocationSearch,
} from '../utils/selectors';
import { recordMarkerEvents, recordZoomPanEvents } from '../utils/analytics';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import { distBetween } from '../utils/facilityDistance';
import SearchResultsHeader from '../components/SearchResultsHeader';
import vaDebounce from 'platform/utilities/data/debounce';
import PaginationWrapper from '../components/PaginationWrapper';

const mbxClient = mbxGeo(mapboxClient);

class VAMap extends Component {
  constructor(props) {
    super(props);
    this.zoomOut = debounce(
      () => this.refs.map.leafletElement.zoomOut(BOUNDING_RADIUS),
      2500,
      { leading: true },
    );

    this.listener = browserHistory.listen(location => {
      this.syncStateWithLocation(location);
    });
    this.searchResultTitle = React.createRef();
    this.debouncedResize = vaDebounce(250, this.setIsMobile);
    this.state = {
      isMobile: this.getMobile(),
    };
  }

  getMobile = () => {
    return window.innerWidth <= 481;
  };

  setIsMobile = () => {
    this.setState({ isMobile: this.getMobile() });
  };

  componentDidMount() {
    const { location, currentQuery, usePredictiveGeolocation } = this.props;
    const { facilityType } = currentQuery;

    window.addEventListener('resize', this.debouncedResize);

    // navigating back from *Detail page preserves previous search results
    if (!isEmpty(this.props.results)) {
      return;
    }

    // Relevant when loading a "shareable" URL
    if (!isEmpty(location.query)) {
      this.props.updateSearchQuery({
        facilityType: location.query.facilityType,
        serviceType: location.query.serviceType,
      });
    }

    if (location.query.address) {
      this.props.genBBoxFromAddress({
        searchString: location.query.address,
        context: location.query.context,
        usePredictiveGeolocation,
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(currentPosition => {
        this.genBBoxFromCoords(currentPosition.coords, facilityType);
      });
    } else {
      this.props.searchWithBounds({
        bounds: currentQuery.bounds,
        facilityType: currentQuery.facilityType,
        serviceType: currentQuery.serviceType,
        page: currentQuery.currentPage,
      });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { currentQuery } = this.props;
    const newQuery = nextProps.currentQuery;
    let resultsPage = newQuery.currentPage;

    if (!areGeocodeEqual(currentQuery.position, newQuery.position)) {
      this.updateUrlParams({
        location: `${newQuery.position.latitude},${
          newQuery.position.longitude
        }`, // don't break the string
        context: newQuery.context,
        address: newQuery.searchString,
      });
    }

    // Reset to page 1 if zoom level changes
    if (
      currentQuery.zoomLevel !== newQuery.zoomLevel &&
      currentQuery.currentPage !== 1
    ) {
      resultsPage = 1;
    }

    if (
      newQuery.bounds &&
      currentQuery.bounds !== newQuery.bounds &&
      !newQuery.searchBoundsInProgress
    ) {
      this.props.searchWithBounds({
        bounds: newQuery.bounds,
        facilityType: newQuery.facilityType,
        serviceType: newQuery.serviceType,
        page: resultsPage,
      });
    }

    if (!isEmpty(nextProps.results) || newQuery.inProgress) {
      this.zoomOut.cancel();
    }
  }

  componentDidUpdate(prevProps) {
    const { currentQuery: prevQuery } = prevProps;
    const updatedQuery = this.props.currentQuery;

    const searchCompleted =
      !updatedQuery.searchBoundsInProgress && prevQuery.searchBoundsInProgress;

    if (searchCompleted && this.searchResultTitle.current) {
      setFocus(this.searchResultTitle.current);
    }

    const shouldZoomOut =
      searchCompleted &&
      isEmpty(this.props.results) &&
      updatedQuery.bounds &&
      parseInt(updatedQuery.zoomLevel, 10) > 2 &&
      !updatedQuery.error;

    if (shouldZoomOut) {
      if (this.state.isMobile) {
        // manual zoom-out for mobile
        this.props.updateSearchQuery({
          bounds: [
            updatedQuery.bounds[0] - BOUNDING_RADIUS,
            updatedQuery.bounds[1] - BOUNDING_RADIUS,
            updatedQuery.bounds[2] + BOUNDING_RADIUS,
            updatedQuery.bounds[3] + BOUNDING_RADIUS,
          ],
        });
      } else {
        this.zoomOut();
      }
    }

    // If we have results OR the search is still running
    if (
      !isEmpty(this.props.results) ||
      (prevQuery.inProgress && updatedQuery.inProgress)
    ) {
      this.zoomOut.cancel();
    }
  }

  componentWillUnmount() {
    // call the func returned by browserHistory.listen to unbind the listener
    this.listener();

    window.removeEventListener('resize', this.debouncedResize);
  }

  /**
   * Presumably handles the case if a user manually makes a change to the
   * address bar and thereby updates the location as tracked by ReactRouter?
   * (i.e. route changes not handled through the Router)
   *
   * @param {Object} location ReactRouter location object
   */
  syncStateWithLocation = location => {
    if (
      location.query.address &&
      this.props.currentQuery.searchString !== location.query.address &&
      !this.props.currentQuery.inProgress
    ) {
      this.props.genBBoxFromAddress({
        searchString: location.query.address,
        context: location.query.context,
        usePredictiveGeolocation: this.props.usePredictiveGeolocation,
      });
    }
  };

  /**
   * Regenerates the URL based on the given parameters so that
   * the map link stays useful for sharing.
   *
   * @param {Object} params Object containing the current search fields
   */
  updateUrlParams = params => {
    // TODO (bshyong): try out existing query-string npm library
    const { location, currentQuery } = this.props;
    const queryParams = {
      ...location.query,
      zoomLevel: currentQuery.zoomLevel,
      page: currentQuery.currentPage,
      address: currentQuery.searchString,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      ...params,
    };

    const queryStringObj = appendQuery(
      `/find-locations${location.pathname}`,
      queryParams,
    );

    browserHistory.push(queryStringObj);
  };

  /**
   * Generates a bounding box from a lat/long geocoordinate.
   *
   */
  genBBoxFromCoords = (position, facilityType) => {
    mbxClient
      .reverseGeocode({
        query: [position.longitude, position.latitude],
        types: ['address'],
      })
      .send()
      .then(({ body: { features } }) => {
        const placeName = features[0].place_name;
        if (!facilityType) {
          this.props.updateSearchQuery({
            searchString: placeName,
          });
          return;
        }
        const coordinates = features[0].center;
        const zipCode =
          features[0].context.find(v => v.id.includes('postcode')).text || '';

        this.props.updateSearchQuery({
          bounds: features[0].bbox || [
            coordinates[0] - BOUNDING_RADIUS,
            coordinates[1] - BOUNDING_RADIUS,
            coordinates[0] + BOUNDING_RADIUS,
            coordinates[1] + BOUNDING_RADIUS,
          ],
          searchString: placeName,
          context: zipCode,
          position,
        });

        this.updateUrlParams({
          address: placeName,
          context: zipCode,
        });
      })
      .catch(error => error);
  };

  handleSearch = () => {
    const { currentQuery, usePredictiveGeolocation } = this.props;
    this.updateUrlParams({
      address: currentQuery.searchString,
    });

    this.props.genBBoxFromAddress({
      ...currentQuery,
      usePredictiveGeolocation,
    });
  };

  handleBoundsChanged = () => {
    const { currentQuery } = this.props;
    if (!currentQuery.facilityType) return;
    const { position } = currentQuery;
    const { leafletElement } = this.refs.map;

    let center = {
      lat: position.latitude,
      lng: position.longitude,
    };
    let boundsArray = currentQuery.bounds;
    let zoom = currentQuery.zoomLevel;
    if (this.refs.map) {
      center = leafletElement.getCenter();
      zoom = leafletElement.getZoom();
      const bounds = leafletElement.getBounds();

      boundsArray = [
        bounds._southWest.lng,
        bounds._southWest.lat,
        bounds._northEast.lng,
        bounds._northEast.lat,
      ];
    }
    this.props.updateSearchQuery({
      bounds: boundsArray,
      position: {
        latitude: center.lat,
        longitude: center.lng,
      },
      zoomLevel: zoom,
    });
  };

  handlePageSelect = page => {
    const { currentQuery } = this.props;
    this.props.searchWithBounds({
      bounds: currentQuery.bounds,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      page,
    });
    setFocus(this.searchResultTitle.current);
  };

  centerMap = () => {
    setTimeout(() => {
      if (this.refs.map && this.refs.facilityMarkers) {
        this.refs.map.leafletElement.fitBounds(
          this.refs.facilityMarkers.leafletElement.getBounds(),
        );
      }
    }, 1);
  };

  /**
   * Use the list of search results to generate map markers and current position marker
   */
  renderMapMarkers = () => {
    const { results } = this.props;
    if (!results) return null;

    const currentLocation = this.props.currentQuery.position;
    const markers = MARKER_LETTERS.values();
    const sortedResults = results
      .map(r => {
        const distance = currentLocation
          ? distBetween(
              currentLocation.latitude,
              currentLocation.longitude,
              r.attributes.lat,
              r.attributes.long,
            )
          : null;
        return {
          ...r,
          distance,
        };
      })
      .sort((resultA, resultB) => resultA.distance - resultB.distance);
    const mapMarkers = sortedResults.map(r => {
      const markerProps = {
        key: r.id,
        position: [r.attributes.lat, r.attributes.long],
        onClick: () => {
          const searchResult = document.getElementById(r.id);
          if (searchResult) {
            Array.from(
              document.getElementsByClassName('facility-result'),
            ).forEach(e => {
              e.classList.remove('active');
            });
            searchResult.classList.add('active');
            document.getElementById('searchResultsContainer').scrollTop =
              searchResult.offsetTop;
          }
          recordMarkerEvents(r);
        },
        markerText: markers.next().value,
      };
      return <FacilityMarker key={r.id} {...markerProps} />;
    });
    if (this.props.currentQuery.searchCoords) {
      mapMarkers.push(
        <CurrentPositionMarker
          key={`${this.props.currentQuery.searchCoords.lat}-${
            this.props.currentQuery.searchCoords.lng
          }`}
          position={[
            this.props.currentQuery.searchCoords.lat,
            this.props.currentQuery.searchCoords.lng,
          ]}
        />,
      );
    }
    return mapMarkers;
  };

  renderResultsHeader = (results, facilityType, serviceType, queryContext) => (
    <SearchResultsHeader
      results={results}
      facilityType={facilityType}
      serviceType={serviceType}
      context={queryContext}
      inProgress={this.props.currentQuery.inProgress}
    />
  );

  renderSearchControls = currentQuery => (
    <SearchControls
      currentQuery={currentQuery}
      onChange={this.props.updateSearchQuery}
      onSubmit={this.handleSearch}
      suppressCCP={this.props.suppressCCP}
      suppressPharmacies={this.props.suppressPharmacies}
    />
  );

  renderMobileView = () => {
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    const {
      currentQuery,
      selectedResult,
      results,
      pagination: { currentPage, totalPages },
    } = this.props;
    const facilityLocatorMarkers = this.renderMapMarkers();
    const facilityType = currentQuery.facilityType;
    const serviceType = currentQuery.serviceType;
    const queryContext = currentQuery.context;

    return (
      <>
        {this.renderSearchControls(currentQuery)}
        <div id="search-results-title" ref={this.searchResultTitle}>
          {this.renderResultsHeader(
            results,
            facilityType,
            serviceType,
            queryContext,
          )}
        </div>
        <div className="columns small-12">
          <Tabs onSelect={this.centerMap}>
            <TabList>
              <Tab className="small-6 tab">View List</Tab>
              <Tab className="small-6 tab">View Map</Tab>
            </TabList>
            <TabPanel>
              <div className="facility-search-results">
                <ResultsList
                  updateUrlParams={this.updateUrlParams}
                  query={currentQuery}
                />
              </div>
              <PaginationWrapper
                handlePageSelect={this.handlePageSelect}
                currentPage={currentPage}
                totalPages={totalPages}
                results={results}
                inProgress={currentQuery.inProgress}
              />
            </TabPanel>
            <TabPanel>
              {this.screenReaderMapText()}
              <Map
                ref="map"
                id="map-id"
                center={position}
                onViewportChanged={e =>
                  recordZoomPanEvents(
                    e,
                    currentQuery.searchCoords,
                    currentQuery.zoomLevel,
                  )
                }
                zoom={parseInt(currentQuery.zoomLevel, 10)}
                style={{ width: '100%', maxHeight: '55vh', height: '55vh' }}
                scrollWheelZoom={false}
                zoomSnap={1}
                zoomDelta={1}
                onMoveEnd={this.handleBoundsChanged}
                onLoad={this.handleBoundsChanged}
                onViewReset={this.handleBoundsChanged}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                  attribution="Map data &copy; <a href=&quot;http://openstreetmap.org&quot;>OpenStreetMap</a> contributors, \
                    <a href=&quot;http://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, \
                    Imagery © <a href=&quot;http://mapbox.com&quot;>Mapbox</a>"
                />
                {facilityLocatorMarkers &&
                  facilityLocatorMarkers.length > 0 && (
                    <FeatureGroup ref="facilityMarkers">
                      {facilityLocatorMarkers}
                    </FeatureGroup>
                  )}
              </Map>
              {selectedResult && (
                <div className="mobile-search-result">
                  <SearchResult
                    result={selectedResult}
                    query={this.props.currentQuery}
                  />
                </div>
              )}
            </TabPanel>
          </Tabs>
        </div>
      </>
    );
  };

  renderDesktopView = () => {
    // defaults to White House coordinates initially
    const {
      currentQuery,
      results,
      pagination: { currentPage, totalPages },
    } = this.props;
    const facilityType = currentQuery.facilityType;
    const serviceType = currentQuery.serviceType;
    const queryContext = currentQuery.context;

    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    const facilityLocatorMarkers = this.renderMapMarkers();
    return (
      <div className="desktop-container">
        {this.renderSearchControls(currentQuery)}
        <div id="search-results-title" ref={this.searchResultTitle}>
          {this.renderResultsHeader(
            results,
            facilityType,
            serviceType,
            queryContext,
          )}
        </div>
        <div
          className="columns search-results-container medium-4 small-12"
          id="searchResultsContainer"
        >
          <div className="facility-search-results">
            <ResultsList
              updateUrlParams={this.updateUrlParams}
              query={this.props.currentQuery}
            />
          </div>
        </div>
        <div className="desktop-map-container">
          {this.screenReaderMapText()}
          <Map
            ref="map"
            id="map-id"
            center={position}
            onViewportChanged={e =>
              recordZoomPanEvents(
                e,
                currentQuery.searchCoords,
                currentQuery.zoomLevel,
              )
            }
            zoomSnap={1}
            zoomDelta={1}
            zoom={parseInt(currentQuery.zoomLevel, 10)}
            style={{ minHeight: '78vh', width: '100%' }} // TODO - move this into CSS
            scrollWheelZoom={false}
            onMoveEnd={this.handleBoundsChanged}
          >
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
              attribution="Map data &copy; <a href=&quot;http://openstreetmap.org&quot;>OpenStreetMap</a> contributors, \
                <a href=&quot;http://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, \
                Imagery © <a href=&quot;http://mapbox.com&quot;>Mapbox</a>"
            />
            {facilityLocatorMarkers &&
              facilityLocatorMarkers.length > 0 && (
                <FeatureGroup ref="facilityMarkers">
                  {facilityLocatorMarkers}
                </FeatureGroup>
              )}
          </Map>
        </div>
        <PaginationWrapper
          handlePageSelect={this.handlePageSelect}
          currentPage={currentPage}
          totalPages={totalPages}
          results={results}
          inProgress={currentQuery.inProgress}
        />
      </div>
    );
  };

  otherToolsLink = () => (
    <div id="other-tools">
      Can’t find what you’re looking for?&nbsp;&nbsp;
      {/* Add a line break for mobile, which uses white-space: pre-line */}
      {'\n'}
      <a href="https://www.va.gov/directory/guide/home.asp">
        Try using our other tools to search.
      </a>
    </div>
  );

  screenReaderMapText = () => (
    <p className="vads-u-visibility--screen-reader">
      Please note: Due to technical limitations, the map is not providing an
      accessible experience for screen reader devices. We're working to deliver
      an enhanced screen reader experience.
    </p>
  );

  render() {
    const results = this.props.results;

    const coronavirusUpdate = (
      <>
        Please call first to confirm services or ask about getting help by phone
        or video. We require everyone entering a VA facility to wear a{' '}
        <a href="/coronavirus-veteran-frequently-asked-questions/#more-health-care-questions">
          mask that covers their mouth and nose.
        </a>{' '}
        Get answers to questions about COVID-19 and VA benefits and services
        with our <a href="/coronavirus-chatbot/">coronavirus chatbot</a>.
      </>
    );

    return (
      <>
        <div>
          <div className="title-section">
            <h1>Find VA locations</h1>
          </div>

          <div className="facility-introtext">
            <p>
              Find a VA location or in-network community care provider. For
              same-day care for minor illnesses or injuries, select Urgent care
              for facility type.
            </p>
            <p>
              <strong>Coronavirus update:</strong> {coronavirusUpdate}
            </p>
          </div>
          {this.state.isMobile
            ? this.renderMobileView()
            : this.renderDesktopView()}
        </div>
        {results && results.length > 0 && this.otherToolsLink()}
      </>
    );
  }
}

VAMap.contextTypes = {
  router: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    currentQuery: state.searchQuery,
    suppressPharmacies: facilitiesPpmsSuppressPharmacies(state),
    suppressCCP: facilitiesPpmsSuppressCommunityCare(state),
    usePredictiveGeolocation: facilityLocatorPredictiveLocationSearch(state),
    results: state.searchResult.results,
    pagination: state.searchResult.pagination,
    selectedResult: state.searchResult.selectedResult,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchVAFacility,
    updateSearchQuery,
    genBBoxFromAddress,
    searchWithBounds,
    clearSearchResults,
  },
)(VAMap);
