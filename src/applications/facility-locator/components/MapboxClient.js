import MapboxClient1 from '@mapbox/mapbox-sdk';
import MapboxClient2 from 'mapbox'; // TODO remove dependency after QA

import { mapboxToken } from '../utils/mapboxToken';
import environments from '../../../platform/utilities/environment';

/**
 New: @mapbox/mapbox-sdk is initialized with the accessToken key as an object

 The conditional is for using the SDK version according to the environment ( New SDK in staging temporarily for QA)
 TODO: remove this logic after new sdk tested in staging

 MapboxClient1 : New SDK
 MapboxClient2 : Current SDK
*/
export const mapboxClient = environments.isStaging()
  ? new MapboxClient1({ accessToken: mapboxToken })
  : new MapboxClient2(mapboxToken);

export default mapboxClient;
