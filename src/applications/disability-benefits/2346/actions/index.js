import * as Sentry from '@sentry/browser';
import {
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
  FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION,
  FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION_FAILURE,
} from '../constants';

export const fetchVeteranInformation = data => ({
  type: FETCH_VETERAN_INFORMATION,
  data,
});

export const fetchVeteranInformationFailure = error => ({
  type: FETCH_VETERAN_INFORMATION_FAILURE,
  error,
});

export const fetchReOrderBatteryAndAccessoriesInformation = data => ({
  type: FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION,
  data,
});

export const fetchReOrderBatteryAndAccessoriesInformationFailure = error => ({
  type: FETCH_REORDER_BATTERY_AND_ACCESSORIES_INFORMATION_FAILURE,
  error,
});

export const getVeteranInformationData = data => async dispatch => {
  try {
    const veteranInformation = {
      fullName: data.formData.fullName,
      gender: data.formData.gender,
      dateOfBirth: data.formData.dateOfBirth,
      veteranAddress: data.formData.veteranAddress,
      email: data.formData.email,
    };
    dispatch(fetchVeteranInformation(veteranInformation));
  } catch (error) {
    // eslint-disable-next-line no-unused-expressions
    Sentry.captureMessage('failed to retrieve data from the api');
    dispatch(fetchVeteranInformationFailure(error));
  }
};

export const getReOrderBatteryAndAccessoriesInformationData = data => async dispatch => {
  try {
    const batteryAndAccessoriesInformation = {
      supplies: data.formData.supplies,
    };
    dispatch(
      fetchReOrderBatteryAndAccessoriesInformation(
        batteryAndAccessoriesInformation,
      ),
    );
  } catch (error) {
    dispatch(
      fetchReOrderBatteryAndAccessoriesInformationFailure(
        error,
        Sentry.captureMessage('failed to retrieve data from the api'),
      ),
    );
  }
};
