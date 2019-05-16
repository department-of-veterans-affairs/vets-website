import MapboxClient from 'mapbox';
import { mapboxToken } from './MapboxToken';

export const mapboxClient = new MapboxClient(mapboxToken);

export default mapboxClient;
