import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import DependentsPage from '../containers/DependentsPage';

const pushSpyZipIsEmpty = sinon.spy();
const pushSpyYearIsEmpty = sinon.spy();

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

const mockStoreZipIsEmpty = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      form: {
        dependents: '',
        year: '',
        zipCode: '',
      },
      pastMode: false,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsZipIsEmpty = {
  editMode: false,
  pastMode: false,
  router: {
    push: pushSpyZipIsEmpty,
  },
  updateZipCodeField: () => {},
  toggleEditMode: () => {},
  dependents: '',
  year: '',
  zipCode: '',
};

const mockStoreZipYearAreEmpty = {
  getState: () => ({
    incomeLimits: {
      editMode: false,
      form: {
        dependents: '',
        year: '',
        zipCode: '',
      },
      pastMode: true,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const propsZipYearAreEmpty = {
  editMode: false,
  pastMode: true,
  router: {
    push: pushSpyYearIsEmpty,
  },
  updateZipCodeField: () => {},
  toggleEditMode: () => {},
  dependents: '',
  year: '',
  zipCode: '',
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

  it('should not allow deep linking to this page if zip is empty', () => {
    render(
      <Provider store={mockStoreZipIsEmpty}>
        <DependentsPage {...propsZipIsEmpty} />
      </Provider>,
    );

    expect(pushSpyZipIsEmpty.withArgs('/').calledOnce).to.be.true;
  });

  it('should not allow deep linking to this page if the year field and zip field are empty and pastMode is true', () => {
    render(
      <Provider store={mockStoreZipYearAreEmpty}>
        <DependentsPage {...propsZipYearAreEmpty} />
      </Provider>,
    );

    expect(pushSpyYearIsEmpty.withArgs('/').calledOnce).to.be.true;
  });
});
