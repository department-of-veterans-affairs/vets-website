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

    const errorText = wrapper
      .find('p')
      .at(0)
      .text();
    expect(errorText).to.contain('find any results for');
    expect(errorText).to.contain('Test Input');

    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.contain('An error occurred while fetching facilities.');

    wrapper.unmount();
  });

  it('should handle pagination and call getData with correct URL', async () => {
    const facilityData = {
      data: Array(15)
        .fill()
        .map((_, index) => ({
          id: String(index + 1),
          attributes: {
            facilityCode: String(index + 100),
            name: `VA Facility ${index + 1}`,
            physicalState: 'CA',
            physicalZip: '12345',
          },
        })),
      meta: {
        count: 15,
      },
      links: {
        self: 'test-page-url&page=1&per_page=10',
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

    // Find the pagination component
    const pagination = wrapper.find('VaPagination');
    expect(pagination.exists()).to.be.true;

    // Simulate page change
    pagination.props().onPageSelect({ detail: { page: 2 } });

    // Verify getData was called with correct URL
    expect(mockGetData.calledOnce).to.be.true;
    expect(mockGetData.calledWith('test-page-url&page=2&per_page=10')).to.be
      .true;

    wrapper.unmount();
  });

  it('should handle radio button selection', () => {
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
      ],
      meta: {
        count: 1,
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

    // Find the radio component
    const radio = wrapper.find('VaRadio');
    expect(radio.exists()).to.be.true;

    // Simulate radio selection
    const expectedValue = '123 - VA Facility 1 CA 12345';
    radio.props().onVaValueChange({ detail: { value: expectedValue } });

    // Verify onChange was called with the correct value
    expect(mockOnChange.calledOnce).to.be.true;
    expect(mockOnChange.calledWith(expectedValue)).to.be.true;

    wrapper.unmount();
  });

  it('should handle pagination edge cases', () => {
    const testCases = [
      {
        links: { self: 'test-page-url?page=2' },
        expectedPage: 2,
      },
      {
        links: { self: 'test-page-url' },
        expectedPage: 1,
      },
      {
        links: undefined,
        expectedPage: 1,
      },
      {
        links: { self: 'test-page-url?page=invalid' },
        expectedPage: 1,
      },
    ];

    testCases.forEach(({ links, expectedPage }) => {
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
        ],
        meta: {
          count: 20,
        },
        links,
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

      // Find the pagination component
      const pagination = wrapper.find('VaPagination');
      if (pagination.exists()) {
        expect(pagination.props().page).to.equal(expectedPage);
      }

      wrapper.unmount();
    });
  });
});
