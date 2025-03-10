import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import LocationInput from '../../../../components/search-form/location';

describe('LocationInput', () => {
  describe('when using the address typeahead feature and progressive disclosure', () => {
    it('should correctly render the autosuggest feature instead of the regular location input field', () => {
      const screen = render(
        <LocationInput
          currentQuery={{
            locationChanged: false,
            geolocationInProgress: false,
            searchString: 'Atlanta, GA',
          }}
          facilitiesUseAddressTypeahead
          geolocateUser={() => {}}
          handleClearInput={() => {}}
          handleGeolocationButtonClick={() => {}}
          handleLocationBlur={() => {}}
          handleQueryChange={() => {}}
          locationInputFieldRef={null}
          onChange={() => {}}
          useProgressiveDisclosure
        />,
      );

      expect(screen.getByTestId('autosuggest-container')).to.exist;
    });
  });
});
