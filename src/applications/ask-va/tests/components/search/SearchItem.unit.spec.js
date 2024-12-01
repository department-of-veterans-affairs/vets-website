import { expect } from 'chai';
import { mount } from 'enzyme';
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
});
