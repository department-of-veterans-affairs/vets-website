import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { fetchVAFacilities } from '../actions';
import { map } from 'lodash';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import MapboxClient from 'mapbox';
import React, { Component } from 'react';
import ResultsPane from '../components/ResultsPane';
import TownHall from '../components/markers/TownHall';

class VAMap extends Component {

  constructor(props) {
    super(props);

    // TODO (bshyong): Use env variables for mapbox token
    this.mapboxClient = new MapboxClient('pk.eyJ1IjoiYXlhbGVsb2VociIsImEiOiJjaWtmdnA1MHAwMDN4dHdtMnBqbGR3djJxIn0.fuqVOKCu8mE-9IdxTa4R8g');

    this.state = this.generateInitialState();
  }

  componentDidMount() {
    const { location } = this.props;
    const { shouldGeolocate } = this.state;


    // TODO (bshyong): move geolocation/geocoding functionality to another function
    this.mapElement = this.refs.map.leafletElement.getBounds();
    if ('geolocation' in navigator && shouldGeolocate) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          position: [position.coords.latitude, position.coords.longitude],
        }, () => {
          // pushes coordinates to URL so that map link is useful for sharing
          const queryParams = map({
            ...location.query,
            location: [position.coords.latitude, position.coords.longitude].join(','),
          }, (v, k) => {
            return `${k}=${v}`;
          }).join('&');

          browserHistory.push(`${location.pathname}?${queryParams}`);
          // TODO (bshyong): use reverse Geocoding API (mapbox?) to translate coords to addresses
          this.mapboxClient.geocodeReverse(position.coords, {
            types: 'address',
          }, (err, res) => {
            // TODO (bshyong): fire action to update currentQuery in reducer
            // TODO (bshyong): handle error case
            console.log(res.features[0].place_name)
          });
        });
      });
    }
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
                url="https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXlhbGVsb2VociIsImEiOiJjaWtmdnA1MHAwMDN4dHdtMnBqbGR3djJxIn0.fuqVOKCu8mE-9IdxTa4R8g"
                attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'/>
            <Marker position={position}>
              <Popup>
                <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
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
  return bindActionCreators({ fetchVAFacilities }, dispatch);
}

export default connect(null, mapDispatchToProps)(VAMap);
