import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import YearPage from '../containers/YearPage';

const pushSpyPastIsNull = sinon.spy();

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

const mockStorePastIsNull = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      form: {
        year: '2015',
      },
      pastMode: null,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsPastIsNull = {
  editMode: false,
  pastMode: null,
  router: {
    push: pushSpyPastIsNull,
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

  it('should not allow deep linking to this page if pastMode is null', () => {
    render(
      <Provider store={mockStorePastIsNull}>
        <YearPage {...propsPastIsNull} />
      </Provider>,
    );

    expect(pushSpyPastIsNull.withArgs('introduction').calledOnce).to.be.true;
  });
});
