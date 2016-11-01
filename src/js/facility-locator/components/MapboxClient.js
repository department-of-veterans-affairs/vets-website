import MapboxClient from 'mapbox';

export const mapboxToken = 'pk.eyJ1IjoiYXlhbGVsb2VociIsImEiOiJjaWtmdnA1MHAwMDN4dHdtMnBqbGR3djJxIn0.fuqVOKCu8mE-9IdxTa4R8g';
export const mapboxClient = new MapboxClient(mapboxToken);

export default mapboxClient;
