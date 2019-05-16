import MapboxClient from 'mapbox';
import { mapboxToken } from '../utils/mapboxToken';

export const mapboxClient = new MapboxClient(mapboxToken);

export default mapboxClient;
