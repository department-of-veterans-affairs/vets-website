import React, { Component, PropTypes } from 'react';
import { divIcon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export default class DivMarker extends Component {
  render() {
    const { className, children, popupContent, position } = this.props;
    const icon = divIcon({
      className,
      html: renderToStaticMarkup(children),
    });

    return (
      <Marker icon={icon} position={position}>
        <Popup>
          {popupContent}
        </Popup>
      </Marker>
    );
  }
}

DivMarker.propTypes = {
  className: PropTypes.string,
  popupContent: PropTypes.element,
};
