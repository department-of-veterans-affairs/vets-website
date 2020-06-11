import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { FeatureGroup, Map, TileLayer } from 'react-leaflet';
import mapboxClient from '../components/MapboxClient';
import { mapboxToken } from '../utils/mapboxToken';
import isMobile from 'ismobilejs';
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
import { facilityTypes } from '../config';
import {
  BOUNDING_RADIUS,
  FacilityType,
  LocationType,
  MARKER_LETTERS,
} from '../constants';
import { areGeocodeEqual, setFocus } from '../utils/helpers';
import {
  facilityLocatorShowCommunityCares,
  facilitiesPpmsSuppressPharmacies,
  facilityLocatorFeUseV1,
} from '../utils/selectors';
import { isProduction } from 'platform/site-wide/feature-toggles/selectors';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import recordEvent from 'platform/monitoring/record-event';

const mbxClient = mbxGeo(mapboxClient);

const otherToolsLink = (
  <p>
    Can’t find what you’re looking for?
    <a href="https://www.va.gov/directory/guide/home.asp">
      Try using our other tools to search.
    </a>
  </p>
);

const headingStyle = {
  fontWeight: '700',
  fontFamily: 'Bitter, Georgia, Cambria, Times New Roman, Times, serif',
  lineHeight: '1.3',
  clear: 'both',
};

const ddStyle = {
  margin: '2rem 0 .5rem 0',
  lineHeight: '1.5',
};

// Link to urgent care benefit web page
const urgentCareDialogLink = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <dl className="usa-alert-text">
        <dt className="usa-alert-heading" style={headingStyle} tabIndex="-1">
          Important information about your Community Care appointment
        </dt>
        <dd style={ddStyle}>
          Click below to learn how to prepare for your urgent care appointment
          with a Community Care provider.
        </dd>
        <button
          className="usa-button-primary vads-u-margin-y--0"
          onClick={() => {
            // Record event
            recordEvent({ event: 'cta-primary-button-click' });
            window.open(
              'https://www.va.gov/COMMUNITYCARE/programs/veterans/Urgent_Care.asp',
              '_blank',
            );
          }}
        >
          Learn about VA urgent care benefit
        </button>
      </dl>
    </div>
  </div>
);

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
  }

  componentDidMount() {
    const { location, currentQuery } = this.props;

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
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(currentPosition => {
        this.genBBoxFromCoords(currentPosition.coords);
      });
    } else {
      this.props.searchWithBounds({
        bounds: currentQuery.bounds,
        facilityType: currentQuery.facilityType,
        serviceType: currentQuery.serviceType,
        page: currentQuery.currentPage,
        apiVersion: this.props.useAPIv1 ? 1 : 0,
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

    /*
      Notes:

      Going to need a couple new flags in the Redux store to properly
      track state of the app. For example, a flag to know when Mapbox API
      requests are done as all they do is update the Redux store, but intuiting
      whether or not the data in the fields that were updated represents a valid
      state for triggering a new search is ambiguous at best nor should we simply
      fire off a new search each time something changes in Redux.

      New Flag Ideas:
        - geocodeInProgress
        - revGeocodeInProgress - should be a separate flag as both operations happen
        - searchRequested - To track that the user clicked the search button
          (could have used inProgress but it gets tripped by other Actions)
        -

      The boundary checking of the current code below doesn't actually work.
      Array equality isn't something that should be done with the operator,
      and using the new method below causes `searchWithBounds` to never fire.
      Goes in line with needing clearer ideas of what state of the app ==
      when to fire off a new search, zoom out, or even just do nothing.

      Near as I can tell this.zoomOut.cancel() does nothing.

      Future testing to fix excessive searches being fired:
    // If we're not searching but the flag to request a search is on
    if (!newQuery.searchBoundsInProgress && newQuery.inProgress) {
      if (this.didParamsChange(currentQuery, newQuery)) {
        this.props.clearSearchResults();
      }
    */
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
        apiVersion: this.props.useAPIv1 ? 1 : 0,
      });
    }

    if (!isEmpty(nextProps.results) || newQuery.inProgress) {
      this.zoomOut.cancel();
    }
  }

  componentDidUpdate(prevProps) {
    const { currentQuery: prevQuery } = prevProps;
    const updatedQuery = this.props.currentQuery;

    const shouldZoomOut = // ToTriggerNewSearch
      !updatedQuery.searchBoundsInProgress &&
      prevQuery.searchBoundsInProgress && // search completed
      isEmpty(this.props.results) &&
      updatedQuery.bounds &&
      parseInt(updatedQuery.zoomLevel, 10) > 2 &&
      !updatedQuery.error;

    if (shouldZoomOut) {
      if (isMobile.any) {
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
  }

  /**
   * Helper method to compare search parameters between
   * component updates/renders.
   *
   * Currently compares search string, location type,
   * service type, and map bounding box.
   *
   * @param {object} previous Previous component props
   * @param {object} current Current componet props
   */
  /* didParamsChange = (previous, current) => {
    return (
      current.searchString !== previous.searchString ||
      current.facilityType !== previous.facilityType ||
      current.serviceType !== previous.serviceType ||
      !areBoundsEqual(current.bounds, previous.bounds)
    );
  }; */

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
   *  @param position Has shape: `{latitude: x, longitude: y}`
   */
  genBBoxFromCoords = position => {
    mbxClient
      .reverseGeocode({
        query: [position.longitude, position.latitude],
        types: ['address'],
      })
      .send()
      .then(({ body: { features } }) => {
        const coordinates = features[0].center;
        const placeName = features[0].place_name;
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
    const { currentQuery } = this.props;
    this.updateUrlParams({
      address: currentQuery.searchString,
    });

    this.props.genBBoxFromAddress(currentQuery);
  };

  handleBoundsChanged = () => {
    const { currentQuery } = this.props;
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
      apiVersion: this.props.useAPIv1 ? 1 : 0,
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
    // need to use this because Icons are rendered outside of Router context (Leaflet manipulates the DOM directly)
    const linkAction = (id, isProvider = false, e) => {
      e.preventDefault();
      if (isProvider) {
        this.context.router.push(`provider/${id}`);
      } else {
        this.context.router.push(`facility/${id}`);
      }
    };

    const markers = MARKER_LETTERS.values();
    const mapMarkers = results.map(r => {
      const iconProps = {
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
          this.props.fetchVAFacility(r.id, r);
        },
        markerText: markers.next().value,
      };

      const popupContent = (
        <div>
          {r.type === LocationType.CC_PROVIDER ? (
            <div>
              <a
                href={`/provider/${r.id}`}
                onClick={linkAction.bind(this, r.id, true)}
              >
                <h5>{r.attributes.name}</h5>
              </a>
              <h6>{r.attributes.orgName}</h6>
              <p>
                Services:{' '}
                <strong>
                  {r.attributes.specialty.map(s => s.name.trim()).join(', ')}
                </strong>
              </p>
            </div>
          ) : (
            <div>
              <a
                href={`/facility/${r.id}`}
                onClick={linkAction.bind(this, r.id, false)}
              >
                <h5>{r.attributes.name}</h5>
              </a>
              <p>
                Facility type:{' '}
                <strong>{facilityTypes[r.attributes.facilityType]}</strong>
              </p>
            </div>
          )}
        </div>
      );

      switch (r.attributes.facilityType) {
        case FacilityType.VA_HEALTH_FACILITY:
        case FacilityType.VA_CEMETARY:
        case FacilityType.VA_BENEFITS_FACILITY:
        case FacilityType.VET_CENTER:
          return <FacilityMarker {...iconProps}>{popupContent}</FacilityMarker>;
        case undefined:
          if (r.type === LocationType.CC_PROVIDER) {
            return (
              <FacilityMarker {...iconProps}>{popupContent}</FacilityMarker>
            );
          }
          return null;
        default:
          return null;
      }
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

  renderMobileView = () => {
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    const {
      currentQuery,
      selectedResult,
      showCommunityCares,
      results,
      pagination: { currentPage, totalPages },
    } = this.props;
    const facilityLocatorMarkers = this.renderMapMarkers();
    const showDialogUrgCare =
      (currentQuery.facilityType === LocationType.URGENT_CARE &&
        currentQuery.serviceType === 'NonVAUrgentCare') ||
      currentQuery.facilityType === LocationType.URGENT_CARE_FARMACIES
        ? urgentCareDialogLink
        : null;
    return (
      <div>
        <div className="columns small-12">
          <SearchControls
            currentQuery={currentQuery}
            onChange={this.props.updateSearchQuery}
            onSubmit={this.handleSearch}
            showCommunityCares={showCommunityCares}
            isMobile
          />
          <div>{showDialogUrgCare}</div>
          {/* <div ref={this.searchResultTitle}>
            {results.length > 0 ? (
              <p className="search-result-title">
                <strong>{totalEntries} results</strong>
                {` for `}
                <strong>
                  {facilityTypes[this.props.currentQuery.facilityType]}
                </strong>
                {` near `}
                <strong>“{this.props.currentQuery.context}”</strong>
              </p>
            ) : (
              <br />
            )}
          </div> */}
          <br />
          <Tabs onSelect={this.centerMap}>
            <TabList>
              <Tab className="small-6 tab">View List</Tab>
              <Tab className="small-6 tab">View Map</Tab>
            </TabList>
            <TabPanel>
              <div className="facility-search-results">
                <ResultsList
                  isMobile
                  updateUrlParams={this.updateUrlParams}
                  query={this.props.currentQuery}
                />
              </div>
              {results.length > 0 && (
                <Pagination
                  onPageSelect={this.handlePageSelect}
                  page={currentPage}
                  pages={totalPages}
                />
              )}
            </TabPanel>
            <TabPanel>
              {otherToolsLink}
              <Map
                ref="map"
                center={position}
                zoom={parseInt(currentQuery.zoomLevel, 10)}
                style={{ width: '100%', maxHeight: '55vh' }}
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
                {facilityLocatorMarkers.length > 0 && (
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
      </div>
    );
  };

  renderDesktopView = () => {
    // defaults to White House coordinates initially
    const {
      currentQuery,
      showCommunityCares,
      suppressPharmacies,
      results,
      pagination: { currentPage, totalPages },
    } = this.props;
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    const facilityLocatorMarkers = this.renderMapMarkers();
    const showDialogUrgCare =
      (currentQuery.facilityType === LocationType.URGENT_CARE &&
        currentQuery.serviceType === 'NonVAUrgentCare') ||
      currentQuery.facilityType === LocationType.URGENT_CARE_FARMACIES
        ? urgentCareDialogLink
        : null;

    return (
      <div className="desktop-container">
        <div>
          <SearchControls
            currentQuery={currentQuery}
            onChange={this.props.updateSearchQuery}
            onSubmit={this.handleSearch}
            showCommunityCares={showCommunityCares}
            suppressPharmacies={suppressPharmacies}
          />
        </div>
        <div>{showDialogUrgCare}</div>
        {/* <div ref={this.searchResultTitle} style={{ paddingLeft: '15px' }}>
          {results.length > 0 ? (
            <p className="search-result-title">
              <strong>{totalEntries} results</strong>
              {` for `}
              <strong>
                {facilityTypes[this.props.currentQuery.facilityType]}
              </strong>
              {` near `}
              <strong>“{this.props.currentQuery.context}”</strong>
            </p>
          ) : (
            <br >
          )}
        </div> */}
        <br />
        <div className="row">
          <div
            className="columns usa-width-one-third medium-4 small-12"
            style={{ maxHeight: '78vh', overflowY: 'auto' }}
            id="searchResultsContainer"
          >
            <div className="facility-search-results">
              <div>
                <ResultsList
                  updateUrlParams={this.updateUrlParams}
                  query={this.props.currentQuery}
                />
              </div>
            </div>
          </div>
          <div
            className="columns usa-width-two-thirds medium-8 small-12"
            style={{ minHeight: '75vh', paddingLeft: '0px' }}
          >
            {otherToolsLink}
            <Map
              ref="map"
              center={position}
              zoomSnap={1}
              zoomDelta={1}
              zoom={parseInt(currentQuery.zoomLevel, 10)}
              style={{ minHeight: '75vh', width: '100%' }}
              scrollWheelZoom={false}
              onMoveEnd={this.handleBoundsChanged}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                attribution="Map data &copy; <a href=&quot;http://openstreetmap.org&quot;>OpenStreetMap</a> contributors, \
                  <a href=&quot;http://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, \
                  Imagery © <a href=&quot;http://mapbox.com&quot;>Mapbox</a>"
              />
              {facilityLocatorMarkers.length > 0 && (
                <FeatureGroup ref="facilityMarkers">
                  {facilityLocatorMarkers}
                </FeatureGroup>
              )}
            </Map>
          </div>
        </div>
        {currentPage &&
          results.length > 0 && (
            <div className="width-35">
              <Pagination
                onPageSelect={this.handlePageSelect}
                page={currentPage}
                pages={totalPages}
              />
            </div>
          )}
      </div>
    );
  };

  render() {
    const chatbotLink = (
      <>
        For questions about how COVID-19 may affect your health appointments,
        benefits, and services, use our{' '}
        <a href="/coronavirus-chatbot/">coronavirus chatbot</a>.
      </>
    );
    return (
      <div>
        <div className="title-section">
          <h1>Find VA Locations</h1>
        </div>

        <div className="facility-introtext">
          <p>
            Find one of VA's more than 2,000 health care, counseling, benefits,
            and cemeteries facilities, plus VA's nationwide network of community
            health care providers.
          </p>
          <p>
            <strong>Coronavirus update:</strong> {chatbotLink} Many locations
            have changing hours and services. For your safety, please call
            before visiting to ask about getting help by phone or video. We
            require everyone entering a VA facility to wear a cloth face
            covering.{' '}
            <a href="/coronavirus-veteran-frequently-asked-questions/">
              Learn more about this requirement
            </a>
            .
          </p>
          <p>
            <strong>Need same-day care for a minor illness or injury?</strong>{' '}
            Select Urgent care under facility type, then select either VA or
            community providers as the service type.
          </p>
        </div>
        {isMobile.any ? this.renderMobileView() : this.renderDesktopView()}
      </div>
    );
  }
}

VAMap.contextTypes = {
  router: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    currentQuery: state.searchQuery,
    showCommunityCares:
      isProduction(state) || facilityLocatorShowCommunityCares(state),
    suppressPharmacies: facilitiesPpmsSuppressPharmacies(state),
    useAPIv1: facilityLocatorFeUseV1(state),
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
