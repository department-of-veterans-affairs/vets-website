import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import sinon from 'sinon';

import LicenseCertificationSearchForm from '../../containers/LicenseCertificationSearchForm';
import Dropdown from '../../components/Dropdown';
import LicenseCertificationKeywordSearch from '../../components/LicenseCertificationKeywordSearch';

const mockStore = configureStore([thunk]);

describe('LicenseCertificationSearchForm', () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      licenseCertificationSearch: {
        hasFetchedOnce: true,
        fetchingLc: false,
        filteredResults: [],
        error: null,
      },
    };
    store = mockStore(initialState);
  });

  afterEach(() => {
    cleanup();
  });

  const mountComponent = (
    path = '/licenses-certifications-and-prep-courses',
  ) => {
    return mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[path]}>
          <Route path="/licenses-certifications-and-prep-courses">
            <LicenseCertificationSearchForm />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should render the form when not fetching and has fetched once', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('form')).to.have.lengthOf(1);
    expect(wrapper.find(Dropdown)).to.have.lengthOf(1);
    expect(wrapper.find(LicenseCertificationKeywordSearch)).to.have.lengthOf(1);
    expect(wrapper.find('va-button')).to.have.lengthOf(2);
    wrapper.unmount();
  });

  it('should show loading indicator when fetching', () => {
    store = mockStore({
      licenseCertificationSearch: {
        ...initialState.licenseCertificationSearch,
        fetchingLc: true,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('va-loading-indicator')).to.have.lengthOf(1);
    expect(wrapper.find('form')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should show error component when error exists', () => {
    store = mockStore({
      licenseCertificationSearch: {
        ...initialState.licenseCertificationSearch,
        error: 'Test error',
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('LicesnseCertificationServiceError')).to.have.lengthOf(
      1,
    );
    wrapper.unmount();
  });

  it('should clear input when clear button is clicked', () => {
    const wrapper = mountComponent();

    // First set a value
    const keywordSearch = wrapper.find(LicenseCertificationKeywordSearch);
    keywordSearch.prop('onUpdateAutocompleteSearchTerm')('test-name');

    // Then clear it
    keywordSearch.prop('handleClearInput')();

    const updatedKeywordSearch = wrapper.find(
      LicenseCertificationKeywordSearch,
    );
    expect(updatedKeywordSearch.prop('inputValue')).to.equal('');

    wrapper.unmount();
  });

  it('should handle form submission', () => {
    const historyPushSpy = sinon.spy();
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={['/licenses-certifications-and-prep-courses']}
        >
          <Route path="/licenses-certifications-and-prep-courses">
            <LicenseCertificationSearchForm
              history={{ push: historyPushSpy }}
            />
          </Route>
        </MemoryRouter>
      </Provider>,
    );

    // Set form values
    const dropdown = wrapper.find(Dropdown);
    dropdown.prop('onChange')({ target: { value: 'test-category' } });

    const keywordSearch = wrapper.find(LicenseCertificationKeywordSearch);
    keywordSearch.prop('onUpdateAutocompleteSearchTerm')('test-name');

    // Submit form
    wrapper
      .find('va-button')
      .first()
      .prop('onClick')();

    // Verify store actions
    const actions = store.getActions();
    expect(actions.length).to.be.greaterThan(0);

    wrapper.unmount();
  });
});
