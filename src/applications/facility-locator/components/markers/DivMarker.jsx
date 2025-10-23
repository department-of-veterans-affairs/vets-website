import PropTypes from 'prop-types';
import React from 'react';
import { divIcon } from 'leaflet';
import { Marker } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export default function DivMarker(props) {
  const { className, children, position, onClick = () => {} } = props;
  const icon = divIcon({
    className,
    html: renderToStaticMarkup(children),
  });

  return <Marker icon={icon} position={position} onClick={onClick} />;
}

DivMarker.propTypes = {
  className: PropTypes.string,
  popupContent: PropTypes.element,
};
