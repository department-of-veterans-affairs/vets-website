import { compact } from 'lodash';
import React, { Component } from 'react';
import { mapboxToken } from './MapboxClient';

class HowToGetHere extends Component {
  render() {
    if (!this.props.info) {
      return (
        <div></div>
      );
    }
    const { attributes: { lat, long, address } } = this.props.info;
    const addressString = [
      compact([address.building, address.street, address.suite]).join(' '),
      `${address.city}, ${address.state} ${address.zip}-${address.zip4}`
    ];

    const mapUrl = `https://api.mapbox.com/v4/mapbox.streets/pin-l-star+cd2026(${long},${lat})/${long},${lat},16/500x300.png?access_token=${mapboxToken}`;

    const domain2 = 'https://maps.google.com?saddr=Current+Location&daddr=';
    const directionsUrl = `${domain2}${addressString}`;
    return (
      <div>
        <a target="_blank" href={directionsUrl}>Driving Directions</a>
        <img src={mapUrl} alt="Static map"/>
      </div>

    );
  }
}

export default HowToGetHere;
