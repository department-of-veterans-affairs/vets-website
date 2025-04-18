import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import AddressAutosuggest from '../../../../components/search-form/location/AddressAutosuggest';

describe('LocationInput', () => {
  describe('when using the address typeahead feature and progressive disclosure', () => {
    it('should correctly render the autosuggest feature instead of the regular location input field', () => {
      const screen = render(
        <AddressAutosuggest
          currentQuery={{
            locationChanged: false,
            geolocationInProgress: false,
            searchString: 'Atlanta, GA',
          }}
          geolocateUser={() => {}}
          handleClearInput={() => {}}
          locationInputFieldRef={null}
          onChange={() => {}}
          useProgressiveDisclosure
        />,
      );

      expect(screen.getByTestId('autosuggest-container')).to.exist;
    });
  });
});
