import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { fetchVAFacilities, updateSearchQuery } from '../actions';
import { map } from 'lodash';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { mapboxClient, mapboxToken } from '../components/MapboxClient';
import React, { Component } from 'react';
import ResultsPane from '../components/ResultsPane';
import TownHall from '../components/markers/TownHall';

class VAMap extends Component {

  constructor(props) {
    super(props);

    this.state = this.generateInitialState();
  }

  componentDidMount() {
    const { location } = this.props;
    const { shouldGeolocate, position } = this.state;

    if (location.query.address) {
      // populate search bar with address in Url
      this.props.updateSearchQuery(location.query.address);
    }

    this.props.fetchVAFacilities({
      latitude: position[0],
      longitude: position[1],
    });

    this.mapElement = this.refs.map.leafletElement.getBounds();
    if ('geolocation' in navigator && shouldGeolocate) {
      navigator.geolocation.getCurrentPosition((currentPosition) => {
        this.setState({
          position: [currentPosition.coords.latitude, currentPosition.coords.longitude],
        }, () => {
          this.updateUrlParams({
            location: [currentPosition.coords.latitude, currentPosition.coords.longitude].join(','),
          });
          this.props.fetchVAFacilities(currentPosition.coords);
          this.reverseGeocode(currentPosition.coords);
        });
      });
    } else if (!location.query.address) {
      this.reverseGeocode({
        latitude: position[0],
        longitude: position[1],
      });
    }
  }

  // pushes coordinates to URL so that map link is useful for sharing
  updateUrlParams(params) {
    const { location } = this.props;

    const queryParams = map({
      ...location.query,
      ...params,
    }, (v, k) => {
      return `${k}=${v}`;
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
      this.props.updateSearchQuery(placeName);
      this.updateUrlParams({
        address: placeName,
      });
    });
  }

  // defaults to White House coordinates if there are not coords in URL
  generateInitialState = () => {
    const { location } = this.props;

    if ('location' in location.query) {
      const position = location.query.location.split(',').map(Number);
      return {
        position,
      };
    }
    return {
      position: [38.8976763, -77.03653],
      shouldGeolocate: true,
    };
  }

  render() {
    const { position } = this.state;

    return (
      <div>
        <div className="columns medium-3">
          <ResultsPane/>
        </div>
        <div className="medium-9 columns">
          <Map ref="map" center={position} zoom={13} >
            <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`}
                attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'/>
            <Marker position={position}>
              <Popup>
                <span>You are here.</span>
              </Popup>
            </Marker>
            <TownHall position={[38.8983294, -77.0295762]}>
              <span>Town hall</span>
            </TownHall>
          </Map>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchVAFacilities,
    updateSearchQuery,
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(VAMap);
