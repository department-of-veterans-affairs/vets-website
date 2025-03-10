import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import createCommonStore from 'platform/startup/store';
import VeteranInformationComponent from '../../../../config/chapters/veteran-information/veteran-information/VeteranInformationComponent';

const defaultStore = createCommonStore();

describe('Veteran Information Component', () => {
  it('Should render a div with the specific class names', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <VeteranInformationComponent />
      </Provider>,
    );

    const divElement = container.querySelector(
      '.vads-u-border--1px.vads-u-border-color--gray-medium.vads-u-padding-x--2.vads-u-padding-y--1',
    );

    expect(divElement).to.not.be.null;
  });

  it('should render empty profile object', () => {
    const formData = { veteranInformation: { ssnLastFour: '1234' } };
    const store = {
      getState: () => ({
        user: {
          profile: {},
        },
      }),
      dispatch: () => {},
      subscribe: () => {},
    };
    const { queryByText } = render(
      <Provider store={store}>
        <VeteranInformationComponent formData={formData} />
      </Provider>,
    );

    expect(queryByText(/Name/)).to.not.be.null;
  });

  it('should render name and suffix', () => {
    const formData = { veteranInformation: { ssnLastFour: '1234' } };
    const store = {
      getState: () => ({
        user: {
          profile: {
            dob: '1975-11-06T22:21:04.417Z',
            gender: 'M',
            userFullName: {
              first: 'Bob',
              middle: undefined,
              last: 'Hope',
              suffix: 'Senior',
            },
          },
        },
      }),
      dispatch: () => {},
      subscribe: () => {},
    };
    const { queryByText } = render(
      <Provider store={store}>
        <VeteranInformationComponent formData={formData} />
      </Provider>,
    );
    expect(queryByText(/Name/)).to.not.be.null;
  });

  it('should render name w/o suffix', () => {
    const formData = { veteranInformation: { ssnLastFour: '1234' } };
    const store = {
      getState: () => ({
        user: {
          profile: {
            dob: '1975-11-06T22:21:04.417Z',
            gender: 'M',
            userFullName: {
              first: 'Bob',
              middle: undefined,
              last: 'Hope',
              suffix: undefined,
            },
          },
        },
      }),
      dispatch: () => {},
      subscribe: () => {},
    };
    const { queryByText } = render(
      <Provider store={store}>
        <VeteranInformationComponent formData={formData} />
      </Provider>,
    );
    expect(queryByText(/Name/)).to.not.be.null;
  });

  it('should render ssn last four', () => {
    const formData = { veteranInformation: { ssnLastFour: '1234' } };
    const store = {
      getState: () => ({
        user: {
          profile: {
            dob: '1975-11-06T22:21:04.417Z',
            gender: 'M',
            userFullName: {
              first: 'Bob',
              middle: undefined,
              last: 'Hope',
              suffix: undefined,
            },
          },
        },
      }),
      dispatch: () => {},
      subscribe: () => {},
    };
    const { queryByText } = render(
      <Provider store={store}>
        <VeteranInformationComponent formData={formData} />
      </Provider>,
    );
    expect(queryByText(/Last 4 digits of Social Security number/)).to.not.be
      .null;
  });

  it('should render dob', () => {
    const formData = { veteranInformation: { ssnLastFour: '1234' } };
    const store = {
      getState: () => ({
        user: {
          profile: {
            dob: '1975-11-06T22:21:04.417Z',
            gender: 'M',
            userFullName: {
              first: 'Bob',
              middle: undefined,
              last: 'Hope',
              suffix: undefined,
            },
          },
        },
      }),
      dispatch: () => {},
      subscribe: () => {},
    };
    const { queryByText } = render(
      <Provider store={store}>
        <VeteranInformationComponent formData={formData} />
      </Provider>,
    );
    expect(queryByText(/Date of birth/)).to.not.be.null;
  });
});
