import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import YearPage from '../containers/YearPage';

const mockStoreStandard = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      form: {
        year: '2015',
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
  updateYearField: () => {},
  toggleEditMode: () => {},
  yearInput: '2015',
};

describe('Year Page', () => {
  it('should correctly load the year page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <YearPage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('il-year')).to.exist;
  });
});
