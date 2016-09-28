import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { fetchVAFacilities, updateSearchQuery, searchWithAddress, searchWithCoordinates, fetchVAFacility } from '../actions';
import { map, find } from 'lodash';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { mapboxClient, mapboxToken } from '../components/MapboxClient';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import DivMarker from '../components/markers/DivMarker';
import isMobile from 'ismobilejs';
import NumberedIcon from '../components/markers/NumberedIcon';
import React, { Component } from 'react';
import ResultsList from '../components/ResultsList';
import SearchControls from '../components/SearchControls';
import SearchResult from '../components/SearchResult';

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

    this.props.searchWithCoordinates(currentQuery.position);

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
      this.props.searchWithCoordinates(newQuery.position);
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

    // need to use this because Icons are rendered outside of Router context (Leaflet manipulates the DOM directly)
    const linkAction = (id, e) => {
      e.preventDefault();
      browserHistory.push(`facilities/facility/${id}`);
    };

    return facilities.map(f => {
      return (
        <NumberedIcon key={f.id} position={[f.lat, f.long]} number={f.id} onClick={() => {this.props.fetchVAFacility(f.id, f);}}>
          <a onClick={linkAction.bind(this, f.id)}>
            <h5>{f.attributes.name} asdfasfasdf</h5>
          </a>
          <p>Facility type: {f.type}</p>
        </NumberedIcon>
      );
    });
  }

  renderSelectedFacility() {
    const { selectedFacility } = this.props;

    if (selectedFacility) {
      return <SearchResult facility={selectedFacility}/>;
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
          <SearchControls onChange={this.props.updateSearchQuery} currentQuery={currentQuery} onSearch={this.handleSearch}/>
          <Tabs onSelect={this.centerMap}>
            <TabList>
              <Tab className="small-6 tab">View List</Tab>
              <Tab className="small-6 tab">View Map</Tab>
            </TabList>
            <TabPanel>
              <div className="facility-search-results">
                <p>Search Results near <strong>{currentQuery.context}</strong></p>
                <ResultsList facilities={facilities}/>
              </div>
            </TabPanel>
            <TabPanel>
              <Map ref="map" center={position} zoom={13} style={{ width: '100%', maxHeight: '55vh' }}>
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
        <div className="columns medium-4">
          <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <SearchControls onChange={this.props.updateSearchQuery} currentQuery={currentQuery} onSearch={this.handleSearch}/>
            <hr className="light"/>
            <div className="facility-search-results">
              <p>Search Results near <strong>{currentQuery.context}</strong></p>
              <div>
                <ResultsList facilities={facilities}/>
              </div>
            </div>
          </div>
        </div>
        <div className="medium-8 columns" style={{ minHeight: '75vh' }}>
          <Map ref="map" center={position} zoom={13} style={{ minHeight: '75vh', width: '100%' }}>
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
    );
  }

  render() {
    // render mobile view for mobile devices
    if (isMobile.any) {
      return this.renderMobileView();
    }

    return this.renderDesktopView();
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
    fetchVAFacilities,
    updateSearchQuery,
    searchWithAddress,
    searchWithCoordinates,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VAMap);
