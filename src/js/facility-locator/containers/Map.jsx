import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

export default class VAMap extends React.Component {

  render() {
    const position = [38.8976763, -77.03653];
    return (
    <Map center={position} zoom={13}>
      <TileLayer
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      <Marker position={position}>
        <Popup>
          <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
        </Popup>
      </Marker>
    </Map>
    );
  }
}
