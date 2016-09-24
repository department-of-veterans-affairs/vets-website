import { compact } from 'lodash';
import React, { Component } from 'react';

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

    const domain = 'https://api.mapbox.com/v4/mapbox.streets/pin-m-star+88c(';
    const key = ',13/500x300.png?access_token=pk.eyJ1IjoiYXlhbGVsb2VociIsImEiOiJjaWtmdnA1MHAwMDN4dHdtMnBqbGR3djJxIn0.fuqVOKCu8mE-9IdxTa4R8g';
    const mapUrl = `${domain}${long},${lat})/${long},${lat}${key}`;
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
