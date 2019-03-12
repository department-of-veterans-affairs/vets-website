import MbxClient from '@mapbox/mapbox-sdk';

export const mapboxToken =
  'pk.eyJ1IjoiYWRob2MiLCJhIjoiY2l2Y3VlNWp5MDBoNjJvbHZ2a3R4bnN2cyJ9.2LoUhwRmz2OiCtRirnc6Pw';
export const mbxClient = new MbxClient({ accessToken: mapboxToken });

export default mbxClient;
