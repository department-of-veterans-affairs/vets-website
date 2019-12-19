import MapboxClient1 from '@mapbox/mapbox-sdk';
import MapboxClient2 from 'mapbox'; // TODO remove dependency after QA

import { mapboxToken } from '../utils/mapboxToken';

export const mapboxClient =
  process.env.BUILDTYPE === 'vagovstaging'
    ? new MapboxClient1({ accessToken: mapboxToken })
    : new MapboxClient2(mapboxToken);

export default mapboxClient;
