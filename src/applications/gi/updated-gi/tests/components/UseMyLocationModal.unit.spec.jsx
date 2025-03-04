import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { UseMyLocationModal } from '../../components/school-and-employers/UseMyLocationModal';

const defaultStore = createCommonStore();

describe('Use my location modal', () => {
  it('Renders enable location modal', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <UseMyLocationModal geocodeError={1} />
      </Provider>,
    );
    expect(
      getByText(
        'Please enable location sharing in your browser to use this feature.',
      ),
    ).to.exist;
  });
  it('Renders couldnt locate modal', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <UseMyLocationModal geocodeError={0} />
      </Provider>,
    );
    expect(
      getByText(
        'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.',
      ),
    ).to.exist;
  });
});
