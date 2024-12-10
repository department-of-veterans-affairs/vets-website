import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import createCommonStore from 'platform/startup/store';
import VeteranInformationComponent from '../../../../config/chapters/veteran-information/veteran-information/VeteranInformationComponent';

const defaultStore = createCommonStore();

describe('Veteran Information Component', () => {
  it('Should Render a div with the specific class name', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <VeteranInformationComponent />
      </Provider>,
    );

    const divElement = container.querySelector('.blue-bar-block');
    expect(divElement).to.not.be.null;
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
    expect(queryByText(/Social Security number/)).to.not.be.null;
  });

  it('should render vaFile last 4', () => {
    const formData = { veteranInformation: { vaFileLastFour: '1234' } };
    const store = {
      getState: () => ({
        user: {
          profile: {
            dob: 'something',
            gender: 'M',
            userFullName: {
              first: 'Bob',
              middle: undefined,
              last: 'Hope',
              suffix: 'Jr',
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
    expect(queryByText(/VA file number/)).to.not.be.null;
  });
});
