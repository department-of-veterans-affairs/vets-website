/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { mapboxClient, mapboxToken } from '../components/MapboxClient';
import isMobile from 'ismobilejs';
import { isEmpty, debounce } from 'lodash';
import appendQuery from 'append-query';
import {
  updateSearchQuery,
  genBBoxFromAddress,
  searchWithBounds,
  fetchVAFacility,
  clearSearchResults,
} from '../actions';
import SearchControls from '../components/SearchControls';
import ResultsList from '../components/ResultsList';
import SearchResult from '../components/SearchResult';
import CemeteryMarker from '../components/markers/CemeteryMarker';
import HealthMarker from '../components/markers/HealthMarker';
import BenefitsMarker from '../components/markers/BenefitsMarker';
import VetCenterMarker from '../components/markers/VetCenterMarker';
import ProviderMarker from '../components/markers/ProviderMarker';
import { facilityTypes, ccLocatorEnabled } from '../config';
import { LocationType, FacilityType, BOUNDING_RADIUS } from '../constants';
import { areGeocodeEqual /* areBoundsEqual */ } from '../utils/helpers';

const otherToolsLink = (
  <p>
    Can’t find what you’re looking for?
    <a href="https://www.va.gov/directory/guide/home.asp">
      Try using our other tools to search.
    </a>
  </p>
);

// This isn't valid JSX 2.x, better to get used to it now
/* eslint-disable react/jsx-boolean-value */
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
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentQuery } = this.props;
    const newQuery = nextProps.currentQuery;
    let resultsPage = newQuery.currentPage;

    if (!areGeocodeEqual(currentQuery.position, newQuery.position)) {
      this.updateUrlParams({
        // eslint-disable-next-line prettier/prettier
        location: `${newQuery.position.latitude},${newQuery.position.longitude}`, // don't break the string
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
      });
    }

    if (!isEmpty(nextProps.results) || newQuery.inProgress) {
      this.zoomOut.cancel();
    }
  }

  componentDidUpdate(prevProps) {
    const { currentQuery: prevQuery } = prevProps;
    const updatedQuery = this.props.currentQuery;

    /* eslint-disable prettier/prettier */
    const shouldZoomOut = ( // ToTriggerNewSearch
      (!updatedQuery.searchBoundsInProgress && prevQuery.searchBoundsInProgress) && // search completed
      isEmpty(this.props.results) &&
      updatedQuery.bounds &&
      parseInt(updatedQuery.zoomLevel, 10) > 2 &&
      !updatedQuery.error
    );
    /* eslint-enable prettier/prettier */

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
  // eslint-disable-next-line prettier/prettier
  syncStateWithLocation = (location) => {
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
  // eslint-disable-next-line prettier/prettier
  updateUrlParams = (params) => {
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
  // eslint-disable-next-line prettier/prettier
  genBBoxFromCoords = (position) => {
    mapboxClient.geocodeReverse(position, { types: 'address' }, (err, res) => {
      const coordinates = res.features[0].center;
      const placeName = res.features[0].place_name;
      const zipCode =
        res.features[0].context.find(v => v.id.includes('postcode')).text || '';

      this.props.updateSearchQuery({
        bounds: res.features[0].bbox || [
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
    });
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
   * Use the list of search results to generate pushpins for the map.
   */
  renderFacilityMarkers = () => {
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

    return results.map(r => {
      const iconProps = {
        key: r.id,
        position: [r.attributes.lat, r.attributes.long],
        onClick: () => {
          const searchResult = document.getElementById(r.id);
          if (searchResult) {
            // eslint-disable-next-line prettier/prettier
            Array.from(document.getElementsByClassName('facility-result')).forEach(e => {
              e.classList.remove('active');
            });
            searchResult.classList.add('active');
            // eslint-disable-next-line prettier/prettier
            document.getElementById('searchResultsContainer').scrollTop = searchResult.offsetTop;
          }
          this.props.fetchVAFacility(r.id, r);
        },
      };

      /* eslint-disable prettier/prettier */
      const popupContent = (
        <div>
          { (r.type === LocationType.CC_PROVIDER) ? (
            <div>
              <a onClick={linkAction.bind(this, r.id, true)}>
                <h5>{r.attributes.name}</h5>
              </a>
              <h6>{r.attributes.orgName}</h6>
              <p>Services: <strong>{r.attributes.specialty.map(s => s.name.trim()).join(', ')}</strong></p>
            </div>
          ) : (
            <div>
              <a onClick={linkAction.bind(this, r.id, false)}>
                <h5>{r.attributes.name}</h5>
              </a>
              <p>Facility type: <strong>{facilityTypes[r.attributes.facilityType]}</strong></p>
            </div>
          )}
        </div>
      );
      /* eslint-enable prettier/prettier */

      switch (r.attributes.facilityType) {
        case FacilityType.VA_HEALTH_FACILITY:
          return <HealthMarker {...iconProps}>{popupContent}</HealthMarker>;
        case FacilityType.VA_CEMETARY:
          return <CemeteryMarker {...iconProps}>{popupContent}</CemeteryMarker>;
        case FacilityType.VA_BENEFITS_FACILITY:
          return <BenefitsMarker {...iconProps}>{popupContent}</BenefitsMarker>;
        case FacilityType.VET_CENTER:
          // eslint-disable-next-line prettier/prettier
          return <VetCenterMarker {...iconProps}>{popupContent}</VetCenterMarker>;
        case undefined:
          if (r.type === LocationType.CC_PROVIDER) {
            // eslint-disable-next-line prettier/prettier
            return <ProviderMarker {...iconProps}>{popupContent}</ProviderMarker>;
          }
          return null;
        default:
          return null;
      }
    });
  };

  renderMobileView = () => {
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    const { currentQuery, selectedResult } = this.props;
    const facilityLocatorMarkers = this.renderFacilityMarkers();

    return (
      /* eslint-disable prettier/prettier */
      <div>
        <div className="columns small-12">
          <SearchControls currentQuery={currentQuery} onChange={this.props.updateSearchQuery}
            onSubmit={this.handleSearch} isMobile={true} />
          <Tabs onSelect={this.centerMap}>
            <TabList>
              <Tab className="small-6 tab">View List</Tab>
              <Tab className="small-6 tab">View Map</Tab>
            </TabList>
            <TabPanel>
              <div aria-live="polite" aria-relevant="additions text" className="facility-search-results">
                <ResultsList isMobile updateUrlParams={this.updateUrlParams} />
                {otherToolsLink}
              </div>
            </TabPanel>
            <TabPanel>
              {otherToolsLink}
              <Map ref="map" center={position} zoom={parseInt(currentQuery.zoomLevel, 10)}
                style={{ width: '100%', maxHeight: '55vh' }} scrollWheelZoom={false}
                zoomSnap={1} zoomDelta={1} onMoveEnd={this.handleBoundsChanged}
                onLoad={this.handleBoundsChanged} onViewReset={this.handleBoundsChanged}>
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                  attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, \
                    <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
                    Imagery © <a href="http://mapbox.com">Mapbox</a>' />
                {facilityLocatorMarkers.length > 0 &&
                  <FeatureGroup
                    ref="facilityMarkers">
                    {facilityLocatorMarkers}
                  </FeatureGroup>
                }
              </Map>
              { selectedResult && (
                <div className="mobile-search-result">
                  <SearchResult result={selectedResult} />
                </div>
              )}
            </TabPanel>
          </Tabs>
        </div>
      </div>
      /* eslint-enable prettier/prettier */
    );
  };

  renderDesktopView = () => {
    // defaults to White House coordinates initially
    const { currentQuery } = this.props;
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    const facilityLocatorMarkers = this.renderFacilityMarkers();

    return (
      /* eslint-disable prettier/prettier */
      <div className="desktop-container">
        <div>
          <SearchControls currentQuery={currentQuery}
            onChange={this.props.updateSearchQuery} onSubmit={this.handleSearch} />
        </div>
        <div className="row">
          <div className="columns usa-width-one-third medium-4 small-12"
            style={{ maxHeight: '75vh', overflowY: 'auto' }} id="searchResultsContainer">
            <div aria-live="polite" aria-relevant="additions text" className="facility-search-results">
              <div>
                <ResultsList updateUrlParams={this.updateUrlParams} />
              </div>
            </div>
          </div>
          <div className="columns usa-width-two-thirds medium-8 small-12" style={{ minHeight: '75vh' }}>
            {otherToolsLink}
            <Map ref="map" center={position} zoomSnap={1} zoomDelta={1}
              zoom={parseInt(currentQuery.zoomLevel, 10)} style={{ minHeight: '75vh', width: '100%' }}
              scrollWheelZoom={false} onMoveEnd={this.handleBoundsChanged}>
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, \
                  <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
                  Imagery © <a href="http://mapbox.com">Mapbox</a>' />
              {facilityLocatorMarkers.length > 0 &&
                <FeatureGroup
                  ref="facilityMarkers">
                  {facilityLocatorMarkers}
                </FeatureGroup>
              }
            </Map>
          </div>
        </div>
      </div>
      /* eslint-enable prettier/prettier */
    );
  };

  render() {
    return (
      /* eslint-disable prettier/prettier */
      <div>
        <div className="title-section">
          <h1>Find VA Locations</h1>
        </div>

        <div className="facility-introtext">
          Find VA locations near you with our facility locator tool. You can search for your nearest 
          VA medical center as well as other health facilities, benefit offices, cemeteries, 
          { ccLocatorEnabled() && <span> community care providers, </span> }
          and Vet Centers. You can also filter your results by service type to find 
          locations that offer the specific service you’re looking for.
        </div>
        { isMobile.any
          ? this.renderMobileView()
          : this.renderDesktopView()
        }
      </div>
      /* eslint-enable prettier/prettier */
    );
  }
}

VAMap.contextTypes = {
  router: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    currentQuery: state.searchQuery,
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
