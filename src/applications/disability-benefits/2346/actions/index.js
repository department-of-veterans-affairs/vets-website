import { getVeteranInformation } from '../api';
import {
  FETCH_VETERAN_ADDRESS_FAILURE,
  FETCH_VETERAN_ADDRESS_SUCCESS,
  FETCH_VETERAN_INFORMATION,
  FETCH_VETERAN_INFORMATION_FAILURE,
} from '../constants';

export const fetchVeteranAddressSuccess = data => ({
  type: FETCH_VETERAN_ADDRESS_SUCCESS,
  data,
});

export const fetchVeteranAddressFailure = () => ({
  type: FETCH_VETERAN_ADDRESS_FAILURE,
});

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

export const getVeteranAddressInfo = () => async dispatch => {
  try {
    const data = await getVeteranInformation();
    const veteranAddresses = {
      veteranAddress: data.formData.veteranAddress,
      email: data.formData.email,
    };
    dispatch(fetchVeteranAddressSuccess(veteranAddresses));
  } catch (error) {
    dispatch(
      fetchVeteranAddressFailure(error, 'failed to retrieve data from api'),
    );
  }
};
