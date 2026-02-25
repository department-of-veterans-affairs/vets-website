import MapboxClient from '@mapbox/mapbox-sdk';
import { mapboxToken } from '../utils/mapboxToken';

const mapboxClient = new MapboxClient({
  accessToken: mapboxToken || 'pk.eyJ1IjoicGxhY2Vob2xkZXIifQ==',
});
export default mapboxClient;
