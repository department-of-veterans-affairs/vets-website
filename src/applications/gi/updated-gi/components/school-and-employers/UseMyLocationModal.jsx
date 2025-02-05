import React from 'react';
import { useDispatch } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { clearGeocodeError } from '../../../actions';

export const UseMyLocationModal = ({ geocodeError, focusLocationInput }) => {
  const dispatch = useDispatch();

  return (
    <VaModal
      modalTitle={
        geocodeError === 1
          ? 'We need to use your location'
          : "We couldn't locate you"
      }
      onCloseEvent={() => {
        focusLocationInput();
        dispatch(clearGeocodeError());
      }}
      status="warning"
      visible={geocodeError > 0}
    >
      <p>
        {geocodeError === 1
          ? 'Please enable location sharing in your browser to use this feature.'
          : 'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.'}
      </p>
    </VaModal>
  );
};
