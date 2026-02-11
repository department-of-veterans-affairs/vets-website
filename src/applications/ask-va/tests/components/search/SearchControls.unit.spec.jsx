import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import SearchControls from '../../../components/search/SearchControls';

export const mockStore = configureStore([]);

describe('SearchControls Component', () => {
  let store;
  let mockOnSubmit;
  let mockLocateUser;

  beforeEach(() => {
    store = mockStore({
      askVA: {
        currentUserLocation: null,
        searchLocationInput: '',
        getLocationInProgress: false,
        getLocationError: false,
      },
    });

    mockOnSubmit = sinon.spy();
    mockLocateUser = sinon.spy();
  });

  it('should render the component correctly', () => {
    const wrapper = mount(
      <Provider store={store}>
        <SearchControls
          onSubmit={mockOnSubmit}
          locateUser={mockLocateUser}
          searchTitle="Search"
          searchHint="Enter your location"
        />
      </Provider>,
    );

    expect(wrapper.find('label').text()).to.contain('Search');
    expect(wrapper.find('p.search-hint-text').text()).to.equal(
      'Enter your location',
    );
    expect(wrapper.find('input#street-city-state-zip')).to.have.lengthOf(1);

    wrapper.unmount();
  });

  it('should handle location input change', () => {
    const wrapper = mount(
      <Provider store={store}>
        <SearchControls
          onSubmit={mockOnSubmit}
          locateUser={mockLocateUser}
          searchTitle="Search"
        />
      </Provider>,
    );

    const input = wrapper.find('input#street-city-state-zip');
    input.simulate('change', { target: { value: 'New York' } });

    expect(wrapper.find('input#street-city-state-zip').props().value).to.equal(
      'New York',
    );
    wrapper.unmount();
  });

  it('should handle form submission', () => {
    const wrapper = mount(
      <Provider store={store}>
        <SearchControls
          onSubmit={mockOnSubmit}
          locateUser={mockLocateUser}
          searchTitle="Search"
        />
      </Provider>,
    );

    const input = wrapper.find('input#street-city-state-zip');
    input.simulate('change', { target: { value: 'New York' } });
    wrapper.find('#facility-search').simulate('click', { preventDefault() {} });

    expect(mockOnSubmit.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should display loading indicator when geolocation is in progress', () => {
    store = mockStore({
      askVA: {
        currentUserLocation: null,
        searchLocationInput: '',
        getLocationInProgress: true,
        getLocationError: false,
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <SearchControls
          onSubmit={mockOnSubmit}
          locateUser={mockLocateUser}
          geolocationInProgress
          searchTitle="Search"
        />
      </Provider>,
    );

    expect(wrapper.find('va-loading-indicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should display error message when geolocation fails', () => {
    store = mockStore({
      askVA: {
        currentUserLocation: null,
        searchLocationInput: '',
        getLocationInProgress: false,
        getLocationError: true,
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <SearchControls
          onSubmit={mockOnSubmit}
          locateUser={mockLocateUser}
          geoCodeError
          searchTitle="Search"
        />
      </Provider>,
    );

    expect(wrapper.find('span.usa-input-error-message')).to.have.lengthOf(1);
    expect(wrapper.find('span.usa-input-error-message').text()).to.contain(
      'Fill in a city or facility name',
    );
    wrapper.unmount();
  });
});
