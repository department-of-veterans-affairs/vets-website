import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ZipCodePage from '../containers/ZipCodePage';

const pushSpyPastIsNull = sinon.spy();
const pushSpyYearIsEmpty = sinon.spy();

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

const mockStorePastIsNull = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      form: {
        year: '',
        zipCode: '',
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
  updateZipCodeField: () => {},
  updateZipValError: () => {},
  toggleEditMode: () => {},
  year: '',
  zipCode: '',
};

const mockStoreYearIsEmpty = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      form: {
        year: '',
        zipCode: '',
      },
      pastMode: true,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsYearIsEmpty = {
  editMode: false,
  pastMode: true,
  router: {
    push: pushSpyYearIsEmpty,
  },
  updateZipCodeField: () => {},
  updateZipValError: () => {},
  toggleEditMode: () => {},
  year: '',
  zipCode: '',
};

describe('Zip Code Page', () => {
  it.skip('should correctly load the zip code page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ZipCodePage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('il-zipCode')).to.exist;
  });

  it.skip('should not allow deep linking to this page if pastMode is null', () => {
    render(
      <Provider store={mockStorePastIsNull}>
        <ZipCodePage {...propsPastIsNull} />
      </Provider>,
    );

    expect(pushSpyPastIsNull.withArgs('introduction').calledOnce).to.be.true;
  });

  it.skip('should not allow deep linking to this page if the year field is empty and pastMode is true', () => {
    render(
      <Provider store={mockStoreYearIsEmpty}>
        <ZipCodePage {...propsYearIsEmpty} />
      </Provider>,
    );

    expect(pushSpyYearIsEmpty.withArgs('introduction').calledOnce).to.be.true;
  });
});
