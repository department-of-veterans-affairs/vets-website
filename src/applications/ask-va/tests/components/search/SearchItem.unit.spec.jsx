import { expect } from 'chai';
import { mount } from 'enzyme';
<<<<<<< HEAD
=======
import * as ui from 'platform/utilities/ui';
>>>>>>> main
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import SearchItem from '../../../components/search/SearchItem';

const mockStore = configureStore([]);

describe('SearchItem Component', () => {
  let store;
  let mockOnChange;
  let mockGetData;
<<<<<<< HEAD
=======
  let focusElementStub;
>>>>>>> main

  beforeEach(() => {
    store = mockStore({
      askVA: {
        searchLocationInput: 'Test Input',
      },
    });

    mockOnChange = sinon.spy();
    mockGetData = sinon.spy();
<<<<<<< HEAD
=======
    focusElementStub = sinon.stub(ui, 'focusElement');
  });

  afterEach(() => {
    focusElementStub.restore();
>>>>>>> main
  });

  it('should render the component with facility data', () => {
    const facilityData = {
      data: [
        {
          id: '1',
          attributes: {
            name: 'VA Facility 1',
            address: {
              physical: {
                city: 'City1',
                state: 'CA',
                zip: '12345',
              },
            },
          },
        },
        {
          id: '2',
          attributes: {
            name: 'VA Facility 2',
            address: {
              physical: {
                city: 'City2',
                state: 'TX',
                zip: '67890',
              },
            },
          },
        },
      ],
      meta: {
        pagination: {
          currentPage: 1,
          totalEntries: 2,
          totalPages: 1,
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <SearchItem
          facilityData={facilityData}
          pageURL="test-url"
          getData={mockGetData}
          onChange={mockOnChange}
        />
      </Provider>,
    );

    expect(
      wrapper
        .find('h3')
        .first()
        .text(),
    ).to.contain('Showing 1-2 of 2 results');
    expect(wrapper.find('va-radio-option')).to.have.lengthOf(2);
    wrapper.unmount();
  });
<<<<<<< HEAD
=======

  it('should not focus when no results are available', () => {
    const facilityData = {
      data: [],
      meta: {
        pagination: {
          currentPage: 0,
          totalEntries: 0,
          totalPages: 0,
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <SearchItem
          facilityData={facilityData}
          pageURL="test-url"
          getData={mockGetData}
          onChange={mockOnChange}
        />
      </Provider>,
    );

    expect(focusElementStub.called).to.be.false;
    wrapper.unmount();
  });

  it('should handle facility selection with complex names containing hyphens', () => {
    const facilityData = {
      data: [
        {
          id: '1',
          attributes: {
            name: 'VA Medical Center - West Wing',
            address: {
              physical: {
                city: 'Test City',
                state: 'TC',
                zip: '12345',
              },
            },
          },
        },
      ],
      meta: {
        pagination: {
          currentPage: 1,
          totalEntries: 1,
          totalPages: 1,
        },
      },
    };

    const dispatchSpy = sinon.spy();
    const mockStoreWithDispatch = {
      ...store,
      dispatch: dispatchSpy,
    };

    const wrapper = mount(
      <Provider store={mockStoreWithDispatch}>
        <SearchItem
          facilityData={facilityData}
          pageURL="test-url"
          getData={mockGetData}
          onChange={mockOnChange}
        />
      </Provider>,
    );

    const radio = wrapper.find('VaRadio');
    const facilityInfo = 'VA Medical Center - West Wing, Test City, TC 12345';
    const selectedValue = `1 - ${facilityInfo}`;
    radio.props().onVaValueChange({ detail: { value: selectedValue } });

    // The component splits on '-' and joins with ' ', creating double spaces
    const expectedPayload = facilityInfo.replace(' - ', '   ');

    expect(mockOnChange.calledOnce).to.be.true;
    expect(mockOnChange.calledWith('1')).to.be.true;
    expect(dispatchSpy.calledOnce).to.be.true;
    expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
      type: 'SET_VA_HEALTH_FACILITY',
      payload: expectedPayload,
    });

    wrapper.unmount();
  });

  it('should handle pagination and call getData with correct URL', () => {
    const facilityData = {
      data: Array(15)
        .fill()
        .map((_, index) => ({
          id: String(index + 1),
          attributes: {
            name: `VA Facility ${index + 1}`,
            address: {
              physical: {
                city: `City${index + 1}`,
                state: 'CA',
                zip: '12345',
              },
            },
          },
        })),
      meta: {
        pagination: {
          currentPage: 1,
          totalEntries: 15,
          totalPages: 2,
        },
      },
    };

    const wrapper = mount(
      <Provider store={store}>
        <SearchItem
          facilityData={facilityData}
          pageURL="test-url"
          getData={mockGetData}
          onChange={mockOnChange}
        />
      </Provider>,
    );

    // Find and verify pagination component
    const pagination = wrapper.find('VaPagination');
    expect(pagination.exists()).to.be.true;
    expect(pagination.props().page).to.equal(1);
    expect(pagination.props().pages).to.equal(2);

    // Test page change
    pagination.props().onPageSelect({ detail: { page: 2 } });
    expect(mockGetData.calledOnce).to.be.true;
    expect(mockGetData.calledWith('test-url&page=2&per_page=10')).to.be.true;

    wrapper.unmount();
  });

  it('should format facility info correctly with various zip code formats', () => {
    const testCases = [
      {
        input: {
          attributes: {
            name: 'VA Facility',
            address: {
              physical: {
                city: 'Test City',
                state: 'TC',
                zip: '12345-6789', // With extension
              },
            },
          },
        },
        expected: 'VA Facility, Test City, TC 12345',
      },
      {
        input: {
          attributes: {
            name: 'VA Facility',
            address: {
              physical: {
                city: 'Test City',
                state: 'TC',
                zip: '12345', // Without extension
              },
            },
          },
        },
        expected: 'VA Facility, Test City, TC 12345',
      },
    ];

    const wrapper = mount(
      <Provider store={store}>
        <SearchItem
          facilityData={{
            data: testCases.map((tc, i) => ({ ...tc.input, id: String(i) })),
            meta: {
              pagination: { currentPage: 1, totalEntries: 2, totalPages: 1 },
            },
          }}
          pageURL="test-url"
          getData={mockGetData}
          onChange={mockOnChange}
        />
      </Provider>,
    );

    const radioOptions = wrapper.find('va-radio-option');
    testCases.forEach((tc, index) => {
      const { label } = radioOptions.at(index).props();
      expect(label).to.equal(tc.expected);
    });

    wrapper.unmount();
  });
>>>>>>> main
});
