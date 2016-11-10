import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { updateSearchQuery, searchWithAddress, searchWithBounds, fetchVAFacility } from '../actions';
import { map, find, compact } from 'lodash';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { mapboxClient, mapboxToken } from '../components/MapboxClient';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import DivMarker from '../components/markers/DivMarker';
import isMobile from 'ismobilejs';
import CemeteryMarker from '../components/markers/CemeteryMarker';
import HealthMarker from '../components/markers/HealthMarker';
import BenefitsMarker from '../components/markers/BenefitsMarker';
import React, { Component } from 'react';
import ResultsList from '../components/ResultsList';
import SearchControls from '../components/SearchControls';
import MobileSearchResult from '../components/MobileSearchResult';

class VAMap extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  };

  componentDidMount() {
    const { location, currentQuery } = this.props;
    let shouldGeolocate = true;

    this.props.updateSearchQuery({
      zoomLevel: location.query.zoomLevel || currentQuery.zoomLevel,
      currentPage: location.query.page || currentQuery.currentPage,
    });

    // populate search bar with parameters from URL
    if (location.query.address) {
      this.props.searchWithAddress({
        searchString: location.query.address,
        context: location.query.context,
      });
    }

    if (location.query.location) {
      shouldGeolocate = false;
      const coords = location.query.location.split(',').map(Number);
      this.props.updateSearchQuery({
        position: {
          latitude: coords[0],
          longitude: coords[1],
        }
      });

      if (!location.query.address) {
        this.reverseGeocode({
          latitude: coords[0],
          longitude: coords[1],
        });
      }
    }

    if (navigator.geolocation && shouldGeolocate) {
      navigator.geolocation.getCurrentPosition((currentPosition) => {
        this.props.updateSearchQuery({
          position: currentPosition.coords,
        });
        this.updateUrlParams({
          location: [currentPosition.coords.latitude, currentPosition.coords.longitude].join(','),
        });
        this.reverseGeocode(currentPosition.coords);
      });
    }

    Tabs.setUseDefaultStyles(false);

    this.props.searchWithBounds(currentQuery.bounds, currentQuery.facilityType, currentQuery.serviceType, currentQuery.currentPage);
  }

  componentWillReceiveProps(nextProps) {
    const { currentQuery } = this.props;
    const newQuery = nextProps.currentQuery;

    if (currentQuery.position !== newQuery.position) {
      this.updateUrlParams({
        location: `${newQuery.position.latitude},${newQuery.position.longitude}`,
        context: newQuery.context,
        address: newQuery.searchString,
      });
    }

    // reset to page 1 if zoom level changes
    if ((currentQuery.zoomLevel !== newQuery.zoomLevel) && (currentQuery.currentPage !== 1)) {
      this.props.updateSearchQuery({
        currentPage: 1,
      });
    }

    if (newQuery.bounds && (currentQuery.bounds !== newQuery.bounds)) {
      this.props.searchWithBounds(newQuery.bounds, newQuery.facilityType, newQuery.serviceType, newQuery.currentPage);
    }
  }

  // pushes coordinates to URL so that map link is useful for sharing
  // TODO (bshyong): try out existing query-string npm library
  updateUrlParams = (params) => {
    const { location, currentQuery } = this.props;

    const queryParams = compact(map({
      ...location.query,
      zoomLevel: currentQuery.zoomLevel,
      page: currentQuery.currentPage,
      address: currentQuery.searchString,
      ...params,
    }, (v, k) => {
      if (v) { return `${k}=${v}`; }
      return null;
    })).join('&');

    browserHistory.push(`/facilities${location.pathname}?${queryParams}`);
  }

  // takes obj of form {latitude: 0, longitude: 0}
  reverseGeocode(position) {
    mapboxClient.geocodeReverse(position, {
      types: 'address',
    }, (err, res) => {
      const coordinates = res.features[0].center;
      const placeName = res.features[0].place_name;
      const zipCode = find(res.features[0].context, (v) => {
        return v.id.includes('postcode');
      }).text;

      this.props.updateSearchQuery({
        bounds: res.features[0].bbox || [
          coordinates[0] - 0.5,
          coordinates[1] - 0.5,
          coordinates[0] + 0.5,
          coordinates[1] + 0.5,
        ],
        searchString: placeName,
        context: zipCode,
      });

      this.updateUrlParams({
        address: placeName,
        context: zipCode,
      });
    });
  }

  handleSearch = () => {
    const { currentQuery } = this.props;

    if (currentQuery.searchString && currentQuery.searchString.trim() !== '') {
      this.updateUrlParams({
        address: currentQuery.searchString,
      });

      this.props.searchWithAddress(currentQuery);
    }
  }

  handleBoundsChanged = () => {
    const { currentQuery } = this.props;
    const { position } = currentQuery;

    let center = {
      lat: position.latitude,
      lng: position.longitude,
    };
    let boundsArray = currentQuery.bounds;
    let zoom = currentQuery.zoomLevel;

    if (this.refs.map) {
      center = this.refs.map.leafletElement.getCenter();
      zoom = this.refs.map.leafletElement.getZoom();
      const bounds = this.refs.map.leafletElement.getBounds();

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
  }

  centerMap = () => {
    setTimeout(() => {
      if (this.refs.map && this.refs.facilityMarkers) {
        this.refs.map.leafletElement.fitBounds(
          this.refs.facilityMarkers.leafletElement.getBounds()
        );
      }
    }, 1);
  }

  renderFacilityMarkers() {
    const { facilities } = this.props;

    /* eslint-disable camelcase */
    const facilityTypes = {
      va_health_facility: 'Health',
      va_cemetery: 'Cemetery',
      va_benefits_facility: 'Benefits',
    };
    /* eslint-enable camelcase */

    // need to use this because Icons are rendered outside of Router context (Leaflet manipulates the DOM directly)
    const linkAction = (id, e) => {
      e.preventDefault();
      this.context.router.push(`facility/${id}`);
    };

    return facilities.map(f => {
      const iconProps = {
        key: f.id,
        position: [f.attributes.lat, f.attributes.long],
        onClick: () => {
          const searchResult = document.getElementById(f.id);
          if (searchResult) {
            Array.from(document.getElementsByClassName('facility-result')).forEach((e) => {
              e.classList.remove('active');
            });
            searchResult.classList.add('active');
            document.getElementById('searchResultsContainer').scrollTop = searchResult.offsetTop;
          }
          this.props.fetchVAFacility(f.id, f);
        },
      };

      const popupContent = (
        <div>
          <a onClick={linkAction.bind(this, f.id)}>
            <h5>{f.attributes.name}</h5>
          </a>
          <p>Facility type: <strong>{facilityTypes[f.attributes.facility_type]}</strong></p>
        </div>
      );

      switch (f.attributes.facility_type) {
        case 'va_health_facility':
          return (
            <HealthMarker {...iconProps}>
              {popupContent}
            </HealthMarker>
          );
        case 'va_cemetery':
          return (
            <CemeteryMarker {...iconProps}>
              {popupContent}
            </CemeteryMarker>
          );
        case 'va_benefits_facility':
          return (
            <BenefitsMarker {...iconProps}>
              {popupContent}
            </BenefitsMarker>
          );
        default: return null;
      }
    });
  }

  renderSelectedFacility() {
    const { selectedFacility } = this.props;

    if (selectedFacility) {
      return (
        <div className="mobile-search-result">
          <MobileSearchResult facility={selectedFacility}/>
        </div>
      );
    }

    return null;
  }

  renderMobileView() {
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    const { currentQuery, facilities, pagination } = this.props;

    return (
      <div>
        <div className="columns small-12">
          <SearchControls onChange={this.props.updateSearchQuery} currentQuery={currentQuery} onSearch={this.handleSearch} isMobile/>
          <Tabs onSelect={this.centerMap}>
            <TabList>
              <Tab className="small-6 tab">View List</Tab>
              <Tab className="small-6 tab">View Map</Tab>
            </TabList>
            <TabPanel>
              <div className="facility-search-results">
                <p>Search Results near <strong>"{currentQuery.context}"</strong></p>
                <ResultsList facilities={facilities} pagination={pagination} isMobile currentQuery={currentQuery} updateUrlParams={this.updateUrlParams}/>
              </div>
            </TabPanel>
            <TabPanel>
              <Map ref="map" center={position} zoom={parseInt(currentQuery.zoomLevel, 10)} style={{ width: '100%', maxHeight: '55vh' }} scrollWheelZoom={false} onMoveEnd={this.handleBoundsChanged} onLoad={this.handleBoundsChanged} onViewReset={this.handleBoundsChanged}>
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                    attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'/>
                <DivMarker position={position} popupContent={<span>You are here</span>}>
                  <div className="current-position-icon map-marker">
                  </div>
                </DivMarker>
                <FeatureGroup ref="facilityMarkers">
                  {this.renderFacilityMarkers()}
                </FeatureGroup>
              </Map>
              {this.renderSelectedFacility()}
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }

  renderDesktopView() {
    // defaults to White House coordinates initially
    const { currentQuery, facilities, pagination } = this.props;
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];

    return (
      <div>
        <div>
          <SearchControls onChange={this.props.updateSearchQuery} currentQuery={currentQuery} onSearch={this.handleSearch}/>
        </div>
        <div className="row">
          <div className="columns medium-4 small-12" style={{ maxHeight: '75vh', overflowY: 'auto' }} id="searchResultsContainer">
            <div className="facility-search-results">
              <p>Search Results near <strong>"{currentQuery.context}"</strong></p>
              <div>
                <ResultsList facilities={facilities} pagination={pagination} currentQuery={currentQuery} updateUrlParams={this.updateUrlParams}/>
              </div>
            </div>
          </div>
          <div className="columns medium-8 small-12" style={{ minHeight: '75vh' }}>
            <Map ref="map" center={position} zoom={parseInt(currentQuery.zoomLevel, 10)} style={{ minHeight: '75vh', width: '100%' }} scrollWheelZoom={false} onMoveEnd={this.handleBoundsChanged} onLoad={this.handleBoundsChanged} onViewReset={this.handleBoundsChanged}>
              <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                  attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'/>
              <DivMarker position={position} popupContent={<span>You are here</span>}>
                <div className="current-position-icon map-marker">
                </div>
              </DivMarker>
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
    // render mobile view for mobile devices
    return (
      <div>
        <div className="title-section">
          <h3>Facility and Service Locator</h3>
        </div>
        {isMobile.any ? this.renderMobileView() : this.renderDesktopView()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentQuery: state.searchQuery,
    facilities: state.facilities.facilities,
    pagination: state.facilities.pagination,
    selectedFacility: state.facilities.selectedFacility,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchVAFacility,
    updateSearchQuery,
    searchWithAddress,
    searchWithBounds,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VAMap);
