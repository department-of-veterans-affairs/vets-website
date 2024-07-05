import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewPage from '../containers/ReviewPage';

const pushSpyStandard = sinon.spy();
const pushSpyPast = sinon.spy();

const mockStoreStandard = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      pastMode: false,
      form: {
        dependents: '2',
        zipCode: '10108',
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsStandard = {
  dependentsInput: '2',
  editMode: false,
  pastMode: false,
  router: {
    push: pushSpyStandard,
  },
  toggleEditMode: () => {},
  updateLimitsResults: () => {},
  zipCodeInput: '10108',
};

const mockStorePast = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      pastMode: true,
      form: {
        dependents: '3',
        year: '2016',
        zipCode: '60507',
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsPast = {
  dependentsInput: '3',
  editMode: false,
  pastMode: true,
  router: {
    push: pushSpyPast,
  },
  toggleEditMode: () => {},
  updateLimitsResults: () => {},
  yearInput: '2016',
  zipCodeInput: '60507',
};

describe('Review Page', () => {
  it('should correctly load the review page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('review-zip').textContent).to.equal(
      'Zip code: 10108',
    );

    expect(screen.getByTestId('review-dependents').textContent).to.equal(
      'Number of dependents: 2',
    );
  });

  it('should correctly load the review page in the past flow', () => {
    const screen = render(
      <Provider store={mockStorePast}>
        <ReviewPage {...propsPast} />
      </Provider>,
    );

    expect(screen.getByTestId('review-year').textContent).to.equal(
      'Year: 2016',
    );

    expect(screen.getByTestId('review-zip').textContent).to.equal(
      'Zip code: 60507',
    );

    expect(screen.getByTestId('review-dependents').textContent).to.equal(
      'Number of dependents: 3',
    );
  });
});
