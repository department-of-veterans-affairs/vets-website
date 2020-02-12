import * as Sentry from '@sentry/browser';

import { getVeteranInformation } from '../api';
import {
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
} from '../constants';

export const fetchVeteranInformation = data => ({
  type: FETCH_VETERAN_INFORMATION,
  data,
});

export const fetchVeteranInformationFailure = () => ({
  type: FETCH_VETERAN_INFORMATION_FAILURE,
});

export const getVeteranInformationData = () => async dispatch => {
  try {
    const data = await getVeteranInformation();
    const veteranInformation = {
      veteranFullName: data.formData.veteranFullName,
      gender: data.formData.gender,
      dateOfBirth: data.formData.dateOfBirth,
      veteranAddress: data.formData.veteranAddress,
      email: data.formData.email,
    };
    dispatch(fetchVeteranInformation(veteranInformation));
  } catch (error) {
    dispatch(
      { FETCH_VETERAN_INFORMATION_FAILURE },
      fetchVeteranInformationFailure(
        error,
        Sentry.captureMessage('failed to retrieve data from the api'),
      ),
    );
  }
};
