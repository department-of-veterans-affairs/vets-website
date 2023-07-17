import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import ReviewPage from '../containers/ReviewPage';

const pushSpyStandard = sinon.spy();
const pushSpyPast = sinon.spy();
const pushSpyFormIncomplete = sinon.spy();

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

describe('Review Page', () => {
  it.skip('should correctly load the review page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('review-zip').textContent).to.equal(
      'Nisci orci: 10108',
    );

    expect(screen.getByTestId('review-dependents').textContent).to.equal(
      'Malesuada felis ultrices: 2',
    );
  });

  it.skip('should correctly load the review page in the past flow', () => {
    const screen = render(
      <Provider store={mockStorePast}>
        <ReviewPage {...propsPast} />
      </Provider>,
    );

    expect(screen.getByTestId('review-year').textContent).to.equal(
      'Vitae: 2016',
    );

    expect(screen.getByTestId('review-zip').textContent).to.equal(
      'Nisci orci: 60507',
    );

    expect(screen.getByTestId('review-dependents').textContent).to.equal(
      'Malesuada felis ultrices: 3',
    );
  });

  it.skip('should call the correct function when the Edit link is used in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ReviewPage {...propsStandard} />
      </Provider>,
    );

    userEvent.click(screen.getAllByText('Edit')[1]);
    expect(pushSpyStandard.withArgs('dependents').calledOnce).to.be.true;
  });

  it.skip('should call the correct function when the Edit link is used in the past flow', () => {
    const screen = render(
      <Provider store={mockStorePast}>
        <ReviewPage {...propsPast} />
      </Provider>,
    );

    userEvent.click(screen.getAllByText('Edit')[0]);
    expect(pushSpyPast.withArgs('year').calledOnce).to.be.true;
  });

  it.skip('should not allow deep linking to this page if the form is not complete', () => {
    render(
      <Provider store={mockStoreFormIncomplete}>
        <ReviewPage {...propsFormIncomplete} />
      </Provider>,
    );

    expect(pushSpyFormIncomplete.withArgs('introduction').calledOnce).to.be
      .true;
  });
});
