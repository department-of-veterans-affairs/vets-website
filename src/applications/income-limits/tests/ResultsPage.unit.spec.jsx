import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ResultsPage from '../containers/ResultsPage';

const pushSpyFormIncomplete = sinon.spy();

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

const mockStoreFormIncomplete = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      pastMode: false,
      form: {
        dependents: '',
        year: '',
        zipCode: '',
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsFormIncomplete = {
  dependentsInput: '',
  editMode: false,
  pastMode: false,
  router: {
    push: pushSpyFormIncomplete,
  },
  toggleEditMode: () => {},
  yearInput: '',
  zipCodeInput: '',
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

  it('should not allow deep linking to this page if the form is not complete', () => {
    render(
      <Provider store={mockStoreFormIncomplete}>
        <ResultsPage {...propsFormIncomplete} />
      </Provider>,
    );

    expect(pushSpyFormIncomplete.withArgs('/').calledOnce).to.be.true;
  });
});
