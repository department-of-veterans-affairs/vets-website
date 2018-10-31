/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { mapboxClient, mapboxToken } from '../components/MapboxClient';
import isMobile from 'ismobilejs';
import { map, compact, isEmpty, debounce } from 'lodash';
import {
  updateSearchQuery,
  genBBoxFromAddress,
  searchWithBounds,
  fetchVAFacility
} from '../actions';
import SearchControls from '../components/SearchControls';
import ResultsList from '../components/ResultsList';
import SearchResult from '../components/SearchResult';
import CemeteryMarker from '../components/markers/CemeteryMarker';
import HealthMarker from '../components/markers/HealthMarker';
import BenefitsMarker from '../components/markers/BenefitsMarker';
import VetCenterMarker from '../components/markers/VetCenterMarker';
import ProviderMarker from '../components/markers/ProviderMarker';
import { facilityTypes } from '../config';
import { LocationType, FacilityType, BOUNDING_RADIUS } from '../constants';
import { areGeocodeEqual } from '../utils/helpers';

const otherToolsLink = (<p>
  Can’t find what you’re looking for? <a href="https://www.va.gov/directory/guide/home.asp">Try using our other tools to search.</a>
</p>);

// This isn't valid JSX 2.x, better to get used to it now
/* eslint-disable react/jsx-boolean-value */
class VAMap extends Component {

  constructor(props) {
    super(props);

    this.zoomOut = debounce(() => this.refs.map.leafletElement.zoomOut(BOUNDING_RADIUS), 2500, {
      leading: true,
    });

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
    this.props.updateSearchQuery({
      facilityType: location.query.facilityType,
      serviceType: location.query.serviceType,
    });

    if (location.query.address) {
      // Unneccesary, genBBoxFromAddress fires the same action at the end
      /* this.props.updateSearchQuery({
        searchString: location.query.address,
      }); */
      this.props.genBBoxFromAddress({
        searchString: location.query.address,
        context: location.query.context,
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((currentPosition) => {
        // Unnecessary, genBBoxFromCoords updates the query too
        // this.props.updateSearchQuery({
        //   position: currentPosition.coords,
        // });
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
        location: `${newQuery.position.latitude},${newQuery.position.longitude}`,
        context: newQuery.context,
        address: newQuery.searchString,
      });
    }

    // Reset to page 1 if zoom level changes
    if ((currentQuery.zoomLevel !== newQuery.zoomLevel) && (currentQuery.currentPage !== 1)) {
      resultsPage = 1;
    }

    if (newQuery.bounds && (currentQuery.bounds !== newQuery.bounds) && !newQuery.searchBoundsInProgress) {
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
    const { currentQuery } = prevProps;
    const newQuery = this.props.currentQuery;

    const shouldUpdateSearchQuery = (
      isEmpty(this.props.results) &&
      !newQuery.inProgress &&
      currentQuery.inProgress &&
      newQuery.bounds &&
      parseInt(newQuery.zoomLevel, 10) > 2 &&
      !newQuery.error
    );

    if (shouldUpdateSearchQuery) {
      if (isMobile.any) {
        // manual zoom-out for mobile
        this.props.updateSearchQuery({
          bounds: [
            newQuery.bounds[0] - BOUNDING_RADIUS,
            newQuery.bounds[1] - BOUNDING_RADIUS,
            newQuery.bounds[2] + BOUNDING_RADIUS,
            newQuery.bounds[3] + BOUNDING_RADIUS,
          ],
        });
      } else {
        this.zoomOut();
      }
    }

    if (!isEmpty(this.props.results) || currentQuery.inProgress) {
      this.zoomOut.cancel();
    }
  }

  componentWillUnmount() {
    // call the func returned by browserHistory.listen to unbind the listener
    this.listener();
  }

  /**
   * Presumably handles the case if a user manually makes a change to the
   * address bar and thereby updates the location as tracked by ReactRouter?
   * (i.e. route changes not handled through the Router)
   *
   * @param {Object} location ReactRouter location object
   */
  syncStateWithLocation = (location) => {
    if (
      location.query.address
      && this.props.currentQuery.searchString !== location.query.address
      && !this.props.currentQuery.inProgress
    ) {
      this.props.genBBoxFromAddress({
        searchString: location.query.address,
        context: location.query.context,
      });
    }
  }

  /**
   * Regenerates the URL based on the given parameters so that
   * the map link stays useful for sharing.
   *
   * @param {Object} params Object containing the current search fields
   */
  updateUrlParams = (params) => {
    // TODO (bshyong): try out existing query-string npm library
    const { location, currentQuery } = this.props;
    const queryParams = compact(map({
      ...location.query,
      zoomLevel: currentQuery.zoomLevel,
      page: currentQuery.currentPage,
      address: currentQuery.searchString,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      ...params,
    }, (value, key) => {
      if (value) { return `${key}=${value}`; }
      return null;
    })).join('&');

    browserHistory.push(`/facilities${location.pathname}?${queryParams}`);
  };

  /**
   * Generates a bounding box from a lat/long geocoordinate.
   *
   *  @param position Has shape: `{latitude: x, longitude: y}`
   */
  genBBoxFromCoords = (position) => {
    mapboxClient.geocodeReverse(position, {
      types: 'address',
    }, (err, res) => {
      const coordinates = res.features[0].center;
      const placeName = res.features[0].place_name;
      const zipCode = res.features[0].context.find(v => v.id.includes('postcode')).text || '';

      this.props.updateSearchQuery({
        bounds: res.features[0].bbox || [
          coordinates[0] - BOUNDING_RADIUS,
          coordinates[1] - BOUNDING_RADIUS,
          coordinates[0] + BOUNDING_RADIUS,
          coordinates[1] + BOUNDING_RADIUS,
        ],
        searchString: placeName,
        context: zipCode,
        position
      });

        this.updateUrlParams({
          address: placeName,
          context: zipCode,
        });
      },
    );
  }

  handleSearch = () => {
    const { currentQuery } = this.props;

    this.updateUrlParams({
      address: currentQuery.searchString,
    });

    this.props.genBBoxFromAddress(currentQuery);
  }

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
            Array.from(document.getElementsByClassName('facility-result')).forEach(e => {
              e.classList.remove('active');
            });
            searchResult.classList.add('active');
            document.getElementById('searchResultsContainer').scrollTop = searchResult.offsetTop;
          }
          this.props.fetchVAFacility(r.id, r);
        },
      };

      const popupContent = (
        <div>
          { (r.type === LocationType.CC_PROVIDER) ? (
            <div>
              <a onClick={linkAction.bind(this, r.id, true)}>
                <h5>{r.attributes.name}</h5>
              </a>
              <h6>{r.attributes.orgName}</h6>
              <p>Services: <strong>{r.attributes.specialty.map(s => s.name).join(', ')}</strong></p>
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

      switch (r.attributes.facilityType) {
        case FacilityType.VA_HEALTH_FACILITY:
          return (
            <HealthMarker {...iconProps}>
              {popupContent}
            </HealthMarker>
          );
        case FacilityType.VA_CEMETARY:
          return (
            <CemeteryMarker {...iconProps}>
              {popupContent}
            </CemeteryMarker>
          );
        case FacilityType.VA_BENEFITS_FACILITY:
          return (
            <BenefitsMarker {...iconProps}>
              {popupContent}
            </BenefitsMarker>
          );
        case FacilityType.VET_CENTER:
          return (
            <VetCenterMarker {...iconProps}>
              {popupContent}
            </VetCenterMarker>
          );
        case undefined:
          if (r.type === LocationType.CC_PROVIDER) {
            return (
              <ProviderMarker {...iconProps}>
                {popupContent}
              </ProviderMarker>
            );
          }
          return null;
        default: return null;
      }
    });
  }

  renderMobileView = () => {
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    const { currentQuery, results, pagination, selectedResult } = this.props;

    return (
      <div>
        <div className="columns small-12">
          <SearchControls currentQuery={currentQuery} onChange={this.props.updateSearchQuery} onSubmit={this.handleSearch} isMobile={true} />
          <Tabs onSelect={this.centerMap}>
            <TabList>
              <Tab className="small-6 tab">View List</Tab>
              <Tab className="small-6 tab">View Map</Tab>
            </TabList>
            <TabPanel>
              <div aria-live="polite" aria-relevant="additions text" className="facility-search-results">
                <ResultsList results={results} pagination={pagination} isMobile
                  currentQuery={currentQuery} updateUrlParams={this.updateUrlParams} />
                {otherToolsLink}
              </div>
            </TabPanel>
            <TabPanel>
              {otherToolsLink}
              <Map ref="map" center={position} zoom={parseInt(currentQuery.zoomLevel, 10)}
                style={{ width: '100%', maxHeight: '55vh' }} scrollWheelZoom={false}
                zoomSnap={0.5} zoomDelta={0.5} onMoveEnd={this.handleBoundsChanged}
                onLoad={this.handleBoundsChanged} onViewReset={this.handleBoundsChanged}>
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                  attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, \
                    <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
                    Imagery © <a href="http://mapbox.com">Mapbox</a>' />
                <FeatureGroup ref="facilityMarkers">
                  {this.renderFacilityMarkers()}
                </FeatureGroup>
              </Map>
              { selectedResult &&
                <div className="mobile-search-result">
                  <SearchResult result={selectedResult} />
                </div>
              }
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }

  renderDesktopView = () => {
    // defaults to White House coordinates initially
    const { currentQuery, results, pagination } = this.props;
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];

    return (
      <div className="desktop-container">
        <div>
          <SearchControls
            currentQuery={currentQuery}
            onChange={this.props.updateSearchQuery}
            onSubmit={this.handleSearch}
          />
        </div>
        <div className="row">
          <div className="columns usa-width-one-third medium-4 small-12"
            style={{ maxHeight: '75vh', overflowY: 'auto' }} id="searchResultsContainer">
            <div aria-live="polite" aria-relevant="additions text" className="facility-search-results">
              <div>
                <ResultsList results={results} pagination={pagination}
                  currentQuery={currentQuery} updateUrlParams={this.updateUrlParams} />
              </div>
            </div>
          </div>
          <div className="columns usa-width-two-thirds medium-8 small-12" style={{ minHeight: '75vh' }}>
            {otherToolsLink}
            <Map ref="map" center={position} zoomSnap={0.5} zoomDelta={0.5}
              zoom={parseInt(currentQuery.zoomLevel, 10)} style={{ minHeight: '75vh', width: '100%' }}
              scrollWheelZoom={false} onMoveEnd={this.handleBoundsChanged}>
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, \
                  <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, \
                  Imagery © <a href="http://mapbox.com">Mapbox</a>' />
              <FeatureGroup ref="facilityMarkers">
                {this.renderFacilityMarkers()}
              </FeatureGroup>
            </Map>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="title-section">
          <h1>Find Facilities and Services</h1>
        </div>
        { isMobile.any
          ? this.renderMobileView()
          : this.renderDesktopView()
        }
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
    results: state.searchResult.results,
    pagination: state.searchResult.pagination,
    selectedResult: state.searchResult.selectedResult,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchVAFacility,
    updateSearchQuery,
    genBBoxFromAddress,
    searchWithBounds,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAMap);
