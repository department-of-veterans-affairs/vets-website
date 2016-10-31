import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { updateSearchQuery, searchWithAddress, searchWithBounds, fetchVAFacility } from '../actions';
import { map, find } from 'lodash';
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

  componentDidMount() {
    const { location, currentQuery } = this.props;
    let shouldGeolocate = true;

    this.updateUrlParams({
      location: [currentQuery.position.latitude, currentQuery.position.longitude].join(','),
      context: currentQuery.context,
    });

    // populate search bar with address in Url
    if (location.query.address) {
      this.props.updateSearchQuery({
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
  }

  componentWillReceiveProps(nextProps) {
    const { currentQuery } = this.props;
    const newQuery = nextProps.currentQuery;

    if (currentQuery.position !== newQuery.position) {
      this.updateUrlParams({
        location: `${newQuery.position.latitude},${newQuery.position.longitude}`,
        context: newQuery.context,
      });
    }
  }

  // pushes coordinates to URL so that map link is useful for sharing
  // TODO (bshyong): try out existing query-string npm library
  updateUrlParams(params) {
    const { location } = this.props;

    const queryParams = map({
      ...location.query,
      ...params,
    }, (v, k) => {
      if (v) { return `${k}=${v}`; }
      return null;
    }).join('&');
    browserHistory.push(`${location.pathname}?${queryParams}`);
  }

  // takes obj of form {latitude: 0, longitude: 0}
  reverseGeocode(position) {
    mapboxClient.geocodeReverse(position, {
      types: 'address',
    }, (err, res) => {
      // TODO (bshyong): handle error case
      const placeName = res.features[0].place_name;
      const zipCode = find(res.features[0].context, (v) => {
        return v.id.includes('postcode');
      }).text;

      this.props.updateSearchQuery({
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

    this.updateUrlParams({
      address: currentQuery.searchString,
    });
    this.props.searchWithAddress(currentQuery);
    this.handleBoundsChanged();
  }

  handleBoundsChanged = () => {
    const { currentQuery: { facilityType, serviceType } } = this.props;
    const bounds = this.refs.map.leafletElement.getBounds();
    const boundsArray = [
      bounds._southWest.lng,
      bounds._southWest.lat,
      bounds._northEast.lng,
      bounds._northEast.lat,
    ];

    this.props.updateSearchQuery({
      bounds: boundsArray,
    });

    this.props.searchWithBounds(boundsArray, facilityType, serviceType);
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
      browserHistory.push(`/facilities/facility/${id}`);
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
    const { currentQuery, facilities } = this.props;

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
                <ResultsList facilities={facilities} isMobile/>
              </div>
            </TabPanel>
            <TabPanel>
              <Map ref="map" center={position} zoom={12} style={{ width: '100%', maxHeight: '55vh' }} scrollWheelZoom={false}>
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                    attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'/>
                <DivMarker position={position} popupContent={<span>You are here</span>}>
                  <div className="current-position-icon">
                    <i className="fa fa-star"></i>
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
    const { currentQuery, facilities } = this.props;
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
                <ResultsList facilities={facilities}/>
              </div>
            </div>
          </div>
          <div className="columns medium-8 small-12" style={{ minHeight: '75vh' }}>
            <Map ref="map" center={position} zoom={12} style={{ minHeight: '75vh', width: '100%' }} scrollWheelZoom={false} onMoveEnd={this.handleBoundsChanged} onLoad={this.handleBoundsChanged} onViewReset={this.handleBoundsChanged}>
              <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                  attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'/>
              <DivMarker position={position} popupContent={<span>You are here</span>}>
                <div className="current-position-icon">
                  <i className="fa fa-star"></i>
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
