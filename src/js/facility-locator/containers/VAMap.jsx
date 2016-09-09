import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchVAFacilities } from '../actions';
import ResultsPane from '../components/ResultsPane';

class VAMap extends Component {
  componentDidMount() {
    this.mapElement = this.refs.map.leafletElement.getBounds();
  }

  render() {
    const position = [38.8976763, -77.03653];
    return (
      <div>
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
          </Map>
        </div>
        <div className="columns medium-3">
          <ResultsPane/>
        </div>
      </div>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchVAFacilities }, dispatch);
}

export default connect(null, mapDispatchToProps)(VAMap);
