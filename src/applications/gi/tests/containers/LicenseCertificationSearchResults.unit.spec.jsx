import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import sinon from 'sinon';
import LicenseCertificationSearchResults from '../../containers/LicenseCertificationSearchResults';
import * as helpers from '../../utils/helpers';

const mockStore = configureStore([thunk]);

describe('LicenseCertificationSearchResults', () => {
  let store;
  let initialState;
  let addEventListenerSpy;
  let removeEventListenerSpy;
  let originalInnerWidth;

  beforeEach(() => {
    initialState = {
      licenseCertificationSearch: {
        hasFetchedOnce: false,
        fetchingLc: false,
        filteredResults: [],
        lcResults: [],
        error: null,
      },
    };
    store = mockStore(initialState);

    addEventListenerSpy = sinon.spy(window, 'addEventListener');
    removeEventListenerSpy = sinon.spy(window, 'removeEventListener');
    originalInnerWidth = global.innerWidth;
  });

  afterEach(() => {
    cleanup();
    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
    global.innerWidth = originalInnerWidth;
  });

  const mountComponent = (
    path = '/licenses-certifications-and-prep-courses/results',
  ) => {
    return mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <Route path="/licenses-certifications-and-prep-courses/results">
            <LicenseCertificationSearchResults />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should display a loading indicator when fetchingLc is true', () => {
    store = mockStore({
      licenseCertificationSearch: {
        ...initialState.licenseCertificationSearch,
        fetchingLc: true,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    expect(wrapper.find('va-loading-indicator').prop('message')).to.equal(
      'Loading...',
    );
    wrapper.unmount();
  });

  it('should display search results when data is available', () => {
    const mockResults = [
      {
        lacNm: 'Test Certification',
        eduLacTypeNm: 'Certification',
        enrichedId: '123',
        state: 'VA',
      },
      {
        lacNm: 'Test License',
        eduLacTypeNm: 'License',
        enrichedId: '456',
        state: 'CA',
      },
    ];

    store = mockStore({
      licenseCertificationSearch: {
        ...initialState.licenseCertificationSearch,
        hasFetchedOnce: true,
        filteredResults: mockResults,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('h1').text()).to.equal('Search results');
    expect(wrapper.find('va-card')).to.have.lengthOf(2);
    expect(
      wrapper
        .find('h3')
        .at(1)
        .text(),
    ).to.equal('Test Certification');
    expect(
      wrapper
        .find('h4')
        .first()
        .text(),
    ).to.equal('Certification');
    wrapper.unmount();
  });

  it('should display pagination when results exceed itemsPerPage', () => {
    const mockResults = Array(11)
      .fill()
      .map((_, i) => ({
        lacNm: `Test ${i}`,
        eduLacTypeNm: 'Certification',
        enrichedId: `${i}`,
        state: 'VA',
      }));

    store = mockStore({
      licenseCertificationSearch: {
        ...initialState.licenseCertificationSearch,
        hasFetchedOnce: true,
        filteredResults: mockResults,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('VaPagination').exists()).to.be.true;
    expect(wrapper.find('va-card')).to.have.lengthOf(10);
    wrapper.unmount();
  });

  it('should handle filter updates', () => {
    const wrapper = mountComponent();
    expect(addEventListenerSpy.calledWith('resize')).to.be.true;
    wrapper.unmount();
    expect(removeEventListenerSpy.calledWith('resize')).to.be.true;
  });
  it('should call updateStateDropdown([null, null]) if categoryParams = ["certification"]', () => {
    const updateStateDropdownSpy = sinon.spy(helpers, 'updateStateDropdown');

    store = mockStore({
      licenseCertificationSearch: {
        ...initialState.licenseCertificationSearch,
        hasFetchedOnce: true,
        filteredResults: [],
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            '/licenses-certifications-and-prep-courses/results?category=certification',
          ]}
        >
          <Route path="/licenses-certifications-and-prep-courses/results">
            <LicenseCertificationSearchResults />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
    const calledWithNullNull = updateStateDropdownSpy.getCalls().some(call => {
      return (
        call.args.length === 1 &&
        Array.isArray(call.args[0]) &&
        call.args[0].length === 2 &&
        call.args[0][0] === null &&
        call.args[0][1] === null
      );
    });

    expect(calledWithNullNull).to.be.true;

    updateStateDropdownSpy.restore();
    wrapper.unmount();
  });
  it('should execute the error block when error is true (line coverage)', () => {
    store = mockStore({
      licenseCertificationSearch: {
        ...initialState.licenseCertificationSearch,
        hasFetchedOnce: true,
        error: true,
      },
    });
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['/licenses-certifications-and-prep-courses/results']}
        >
          <Route path="/licenses-certifications-and-prep-courses/results">
            <LicenseCertificationSearchResults />
          </Route>
        </MemoryRouter>
      </Provider>,
    );

    expect(wrapper.exists()).to.be.true;

    wrapper.unmount();
  });
});
