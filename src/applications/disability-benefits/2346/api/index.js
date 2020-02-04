import { apiRequest } from '../../../../platform/utilities/api';

export const getDLCBatteryDataApi = () => apiRequest('/dlc/orderstatus/1014/1');
// NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
// export const getDLCSocksDataApi = () => apiRequest('/dlc/orderstatus/1014/2');
export const getDLCAccessoriesDataApi = () =>
  apiRequest('/dlc/orderstatus/1014/3');
export const getUserInformation = formData =>
  apiRequest(`v0/in_progress_forms/MDOT`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      // 'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(formData),
  });
export const updateDLCDataApi = data =>
  apiRequest('/dlc/orderstatus/1014/1', {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
