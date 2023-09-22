import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import DependentsPage from '../containers/DependentsPage';

const mockStoreStandard = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      form: {
        dependents: '',
        year: '',
        zipCode: '10108',
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
  dependents: '',
  year: '',
  zipCode: '10108',
};

describe('Dependents Page', () => {
  it('should correctly load the dependents page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <DependentsPage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('il-dependents')).to.exist;
  });
});
