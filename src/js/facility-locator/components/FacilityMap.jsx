import { mapboxToken } from './MapboxClient';
import React, { Component } from 'react';

class HowToGetHere extends Component {
  render() {
    if (!this.props.info) {
      return (
        <div></div>
      );
    }
    const { attributes: { lat, long } } = this.props.info;

    const mapUrl = `https://api.mapbox.com/v4/mapbox.streets/pin-l-star+cd2026(${long},${lat})/${long},${lat},16/500x300.png?access_token=${mapboxToken}`;

    return (
      <div className="mb2">
        <h4>View on Map</h4>
        <hr className="title"/>
        <img src={mapUrl} alt="Static map"/>
      </div>
    );
  }
}

export default HowToGetHere;
