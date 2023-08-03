import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ZipCodePage from '../containers/ZipCodePage';

const mockStoreStandard = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      form: {
        year: '',
        zipCode: '',
      },
      pastMode: false,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsStandard = {
  editMode: false,
  pastMode: false,
  router: {
    push: () => {},
  },
  updateZipCodeField: () => {},
  toggleEditMode: () => {},
  year: '',
  zipCode: '',
};

describe('Zip Code Page', () => {
  it('should correctly load the zip code page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ZipCodePage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('il-zipCode')).to.exist;
  });
});
