import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import ResultsPage from '../containers/ResultsPage';

const mockStoreStandard = {
  getState: () => ({
    incomeLimits: {
      form: {
        dependents: '2',
        year: '2015',
        zipCode: '10108',
      },
      pastMode: false,
      results: {
        // eslint-disable-next-line camelcase
        gmt_threshold: 56000,
        // eslint-disable-next-line camelcase
        national_threshold: 48000,
        // eslint-disable-next-line camelcase
        pension_threshold: 34000,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsStandard = {
  dependentsInput: '2',
  pastMode: false,
  results: {
    // eslint-disable-next-line camelcase
    gmt_threshold: 56000,
    // eslint-disable-next-line camelcase
    national_threshold: 48000,
    // eslint-disable-next-line camelcase
    pension_threshold: 34000,
  },
  router: {
    push: () => {},
  },
  zipCodeInput: '10108',
  yearInput: '2015',
};

describe('Results Page', () => {
  it('should correctly load the results page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ResultsPage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('il-results')).to.exist;
  });
});
