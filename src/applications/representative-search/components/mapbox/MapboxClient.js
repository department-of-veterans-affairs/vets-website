import MapboxClient from '@mapbox/mapbox-sdk';
import { mapboxToken } from '../../utils/mapboxToken';

// Fallback token is a structurally valid placeholder so the SDK doesn't throw
// at module load time when no real token is set (e.g. unit tests in CI).
const mapboxClient = new MapboxClient({
  accessToken: mapboxToken || 'pk.eyJ1IjoicGxhY2Vob2xkZXIifQ==',
});
export default mapboxClient;
