import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { fetchVAFacilities, updateSearchQuery, searchWithAddress, searchWithCoordinates } from '../actions';
import { map, find } from 'lodash';
import { Map, TileLayer } from 'react-leaflet';
import { mapboxClient, mapboxToken } from '../components/MapboxClient';
import DivMarker from '../components/markers/DivMarker';
import NumberedIcon from '../components/markers/NumberedIcon';
import React, { Component } from 'react';
import ResultsPane from '../components/ResultsPane';

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

    this.mapElement = this.refs.map.leafletElement.getBounds();
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

  renderFacilityMarkers() {
    const facilities = this.props.facilities;

    return facilities.map(f => {
      return (
        <NumberedIcon key={f.id} position={[f.lat, f.long]} number={f.id}>
          <span>{`Facility ${f.id}: ${f.attributes.name}`}</span>
        </NumberedIcon>
      );
    });
  }

  render() {
  // defaults to White House coordinates initially
    const coords = this.props.currentQuery.position;
    const position = [coords.latitude, coords.longitude];
    // used for setting a proper map height
    const mapHeight = window.innerHeight - document.getElementsByClassName('header')[0].clientHeight - 175;

    return (
      <div>
        <div className="columns medium-4">
          <ResultsPane onSearch={this.handleSearch} maxHeight={mapHeight}/>
        </div>
        <div className="medium-8 columns" style={{ minHeight: mapHeight }}>
          <Map ref="map" center={position} zoom={13} style={{ minHeight: mapHeight, width: '100%' }}>
            <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'/>
            <DivMarker position={position} popupContent={<span>You are here</span>}>
              <div className="current-position-icon">
                <i className="fa fa-star"></i>
              </div>
            </DivMarker>
            {this.renderFacilityMarkers()}
          </Map>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentQuery: state.searchQuery,
    facilities: state.facilities.facilities,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchVAFacilities,
    updateSearchQuery,
    searchWithAddress,
    searchWithCoordinates,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VAMap);
