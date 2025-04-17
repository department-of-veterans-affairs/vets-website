import environment from 'platform/utilities/environment';

const CONNECTED_DEVICES_BASE_URL = `${environment.API_URL}/dhp_connected_devices`;

export const FETCH_CONNECTED_DEVICES = `${CONNECTED_DEVICES_BASE_URL}/veteran-device-records`;
