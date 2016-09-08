import React, { Component } from 'react';

class HowToGetHere extends Component {
  render() {
    if (!this.props.info) {
      return (
        <div></div>
      );
    }
    const domain = 'https://api.mapbox.com/v4/mapbox.streets/pin-m-star+88c(';
    const key = ',13/500x300.png?access_token=pk.eyJ1IjoiYXlhbGVsb2VociIsImEiOiJjaWtmdnA1MHAwMDN4dHdtMnBqbGR3djJxIn0.fuqVOKCu8mE-9IdxTa4R8g';
    const src = `${domain}${this.props.info.longitude},${this.props.info.latitude})/${this.props.info.longitude},${this.props.info.latitude}${key}`;
    const domain2 = 'https://www.google.com/maps/dir/';
    const address = this.props.info.address;
    const src2 = `${domain2}${address.street1} ${address.street2} ${address.city} ${address.state} ${address.zip}`;
    return (
      <div>
        <a target="_blank" href={src2}>Driving Directions</a>
        <img src={src} alt="Static map"/>
      </div>

    );
  }
}

export default HowToGetHere;
