import {
  getDLCAccessoriesDataApi,
  getDLCBatteryDataApi,
  // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
  // getDLCSocksDataApi,
  updateDLCDataApi,
  getVeteranInformation,
} from '../api';
import {
  FETCH_ACCESSORIES_DATA_FAILURE,
  FETCH_ACCESSORIES_DATA_SUCCESS,
  FETCH_BATTERY_DATA_FAILURE,
  FETCH_BATTERY_DATA_SUCCESS,
  UPDATE_DATA_FAILURE,
  UPDATE_DATA_SUCCESS,
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
} from '../constants';

export const fetchBatteryDataSuccess = data => ({
  type: FETCH_BATTERY_DATA_SUCCESS,
  data,
});

export const fetchBatteryDataFailure = () => ({
  type: FETCH_BATTERY_DATA_FAILURE,
});

// NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
//
// export const fetchSocksDataSuccess = data => ({
//   type: FETCH_SOCKS_DATA_SUCCESS,
//   data,
// });

// export const fetchSocksDataFailure = () => ({
//   type: FETCH_SOCKS_DATA_FAILURE,
// });

export const fetchAccessoriesDataSuccess = data => ({
  type: FETCH_ACCESSORIES_DATA_SUCCESS,
  data,
});

export const fetchAccessoriesDataFailure = () => ({
  type: FETCH_ACCESSORIES_DATA_FAILURE,
});

export const updateDataSuccess = () => ({
  type: UPDATE_DATA_SUCCESS,
});

export const updateDataFailure = () => ({
  type: UPDATE_DATA_FAILURE,
});

export const fetchVeteranInformation = data => ({
  type: FETCH_VETERAN_INFORMATION,
  data,
});

export const fetchVeteranInformationFailure = () => ({
  type: FETCH_VETERAN_INFORMATION_FAILURE,
});

export const getDLCBatteryData = () => async dispatch => {
  try {
    const batteryData = await getDLCBatteryDataApi();
    dispatch(fetchBatteryDataSuccess(batteryData));
  } catch (error) {
    dispatch(
      fetchBatteryDataFailure(error, 'failed to retrieve data from the api'),
    );
  }
};

// NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
// export const getDLCSocksData = () => async dispatch => {
//   try {
//     const socksData = await getDLCSocksDataApi();
//     dispatch(fetchSocksDataSuccess(socksData));
//   } catch (error) {
//     dispatch(fetchSocksDataFailure(error, 'failed to retrieve data from api'));
//   }
// };

export const getDLCAccessoriesData = () => async dispatch => {
  try {
    const accessoriesData = await getDLCAccessoriesDataApi();
    dispatch(fetchAccessoriesDataSuccess(accessoriesData));
  } catch (error) {
    dispatch(
      fetchAccessoriesDataFailure(
        error,
        'failed to retrieve data from the api',
      ),
    );
  }
};

export const getVeteranInformationData = () => async dispatch => {
  try {
    const data = await getVeteranInformation();
    const veteranInformation = {
      veteranFullName: data.formData.veteranFullName,
      gender: data.formData.gender,
      dateOfBirth: data.formData.dateOfBirth,
    };
    dispatch(fetchVeteranInformation(veteranInformation));
  } catch (error) {
    dispatch(
      fetchVeteranInformationFailure(
        error,
        'failed to retrieve data from the api',
      ),
    );
  }
};

export const updateDLCData = id => async dispatch => {
  try {
    const data = await updateDLCDataApi();
    dispatch({ type: UPDATE_DATA_SUCCESS, id, payload: data });
  } catch (error) {
    dispatch({ type: UPDATE_DATA_FAILURE, payload: error });
  }
};
