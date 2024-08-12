import MapboxClient from '@mapbox/mapbox-sdk';
import { mapboxToken } from './mapboxToken';

const mapboxClient = new MapboxClient({ accessToken: mapboxToken });
export default mapboxClient;
