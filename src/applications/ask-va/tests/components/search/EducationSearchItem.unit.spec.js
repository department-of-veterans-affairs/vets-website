import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import EducationSearchItem from '../../../components/search/EducationSearchItem';

const mockStore = configureStore([]);

describe('EducationSearchItem', () => {
  let store;
  let mockOnChange;
  let mockGetData;

  beforeEach(() => {
    store = mockStore({
      askVA: {
        searchLocationInput: 'Test Input',
      },
    });

    mockOnChange = sinon.spy();
    mockGetData = sinon.spy();
  });

  it('should render the component with facility data', () => {
    const facilityData = {
      data: [
        {
          id: '1',
          attributes: {
            facilityCode: '123',
            name: 'VA Facility 1',
            physicalState: 'CA',
            physicalZip: '12345',
          },
        },
        {
          id: '2',
          attributes: {
            facilityCode: '456',
            name: 'VA Facility 2',
            physicalState: 'TX',
            physicalZip: '67890',
          },
        },
      ],
      meta: {
        count: 20,
      },
    };

    const dataError = {
      hasError: false,
      errorMessage: '',
    };

    const wrapper = mount(
      <Provider store={store}>
        <EducationSearchItem
          facilityData={facilityData}
          dataError={dataError}
          onChange={mockOnChange}
          pageURL="test-page-url"
          getData={mockGetData}
        />
      </Provider>,
    );

    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).to.contain('Showing 2 results for');
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.contain(
      'The results are listed from nearest to farthest from your location.',
    );

    wrapper.unmount();
  });

  it('should handle errors and display an error message', () => {
    const facilityData = { data: [] };

    const dataError = {
      hasError: true,
      errorMessage: 'An error occurred while fetching facilities.',
    };

    const wrapper = mount(
      <Provider store={store}>
        <EducationSearchItem
          facilityData={facilityData}
          dataError={dataError}
          onChange={mockOnChange}
          pageURL="test-page-url"
          getData={mockGetData}
        />
      </Provider>,
    );

    expect(
      wrapper
        .find('p')
        .at(0)
        .text(),
    ).to.contain('We didn’t find any results for');
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.contain('An error occurred while fetching facilities.');

    wrapper.unmount();
  });
});
