import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import VeteranInformationComponent from '../../../../config/chapters/veteran-information/veteran-information/VeteranInformationComponent';

describe('Veteran Information Component', () => {
  const generateStore = (userProfile = {}) => ({
    dispatch: sinon.spy(),
    subscribe: sinon.spy(),
    getState: () => ({
      user: { profile: userProfile },
    }),
  });

  const renderComponent = (formData = {}, userProfile = {}) => {
    const mockStore = generateStore(userProfile);
    return render(
      <Provider store={mockStore}>
        <VeteranInformationComponent formData={formData} />
      </Provider>,
    );
  };

  it('Should render a div with the expected class names', () => {
    const { container } = renderComponent();
    const divElement = container.querySelector(
      '.vads-u-border--1px.vads-u-border-color--gray-medium.vads-u-padding-x--2.vads-u-padding-y--1',
    );
    expect(divElement).to.not.be.null;
  });

  it('Should render an empty profile object', () => {
    const { queryByText } = renderComponent(
      { veteranInformation: { ssnLastFour: '1234' } },
      {},
    );
    expect(queryByText(/Name/)).to.not.be.null;
  });

  it('Should render the veteran’s full name with suffix', () => {
    const { queryByText } = renderComponent(
      { veteranInformation: { ssnLastFour: '1234' } },
      {
        dob: '1975-11-06T22:21:04.417Z',
        gender: 'M',
        userFullName: {
          first: 'Bob',
          middle: undefined,
          last: 'Hope',
          suffix: 'Senior',
        },
      },
    );
    expect(queryByText(/Bob Hope, Senior/)).to.not.be.null;
  });

  it('Should render the veteran’s name without suffix', () => {
    const { queryByText } = renderComponent(
      { veteranInformation: { ssnLastFour: '1234' } },
      {
        dob: '1975-11-06T22:21:04.417Z',
        gender: 'M',
        userFullName: {
          first: 'Bob',
          middle: undefined,
          last: 'Hope',
        },
      },
    );
    expect(queryByText(/Bob Hope/)).to.not.be.null;
  });

  it('Should render masked SSN when last four digits are available', () => {
    const { queryByText } = renderComponent(
      { veteranInformation: { ssnLastFour: '1234' } },
      {
        dob: '1975-11-06T22:21:04.417Z',
        gender: 'M',
        userFullName: { first: 'Bob', last: 'Hope' },
      },
    );
    expect(queryByText(/Last 4 digits of Social Security number/)).to.not.be
      .null;
  });

  it('Should render date of birth', () => {
    const { queryByText } = renderComponent(
      { veteranInformation: { ssnLastFour: '1234' } },
      {
        dob: '1975-11-06T22:21:04.417Z',
        gender: 'M',
        userFullName: { first: 'Bob', last: 'Hope' },
      },
    );
    expect(queryByText(/Date of birth/)).to.not.be.null;
  });
});
