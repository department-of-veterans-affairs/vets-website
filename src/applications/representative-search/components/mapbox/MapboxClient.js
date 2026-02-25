import MapboxClient from '@mapbox/mapbox-sdk';
import { mapboxToken } from '../../utils/mapboxToken';

const mapboxClient = new MapboxClient({ accessToken: mapboxToken });
export default mapboxClient;
