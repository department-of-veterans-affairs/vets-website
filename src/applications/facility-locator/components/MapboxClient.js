import MapboxClient from '@mapbox/mapbox-sdk';
import { mapboxToken } from '../utils/mapboxToken';

export const mapboxClient = new MapboxClient({ accessToken: mapboxToken });

export default mapboxClient;
