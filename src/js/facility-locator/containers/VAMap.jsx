import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchVAFacilities } from '../actions';

class VAMap extends Component {
  componentDidMount() {
    this.mapElement = this.refs.map.leafletElement.getBounds();
  }

  render() {
    const position = [38.8976763, -77.03653];
    return (
      <Map ref="map" center={position} zoom={13} >
        <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchVAFacilities }, dispatch);
}

export default connect(null, mapDispatchToProps)(VAMap);
