import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import createCommonStore from '@department-of-veterans-affairs/platform-startup/store';
import { UseMyLocation } from '../../components/school-and-employers/UseMyLocation';

const defaultStore = createCommonStore();

describe('Use my location', () => {
  it('Should show finding your location when in progress', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <UseMyLocation geolocationInProgress />
      </Provider>,
    );
    expect(getByText('Finding your location...')).to.exist;
  });
  it('Should show finding your location when in progress', () => {
    const { getByText } = render(
      <Provider store={defaultStore}>
        <UseMyLocation geolocationInProgress={false} />
      </Provider>,
    );
    expect(getByText('Use my location')).to.exist;
  });
});
