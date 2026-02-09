import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import EducationFacilitySearch from '../../components/EducationFacilitySearch';
import * as mapboxModule from '../../utils/mapbox';

describe('EducationFacilitySearch', () => {
  let apiRequestStub;
  let convertLocationStub;

  const mockFacilityData = {
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
    meta: { count: 20 },
  };

  function setupStore(initialState) {
    return configureStore({
      reducer: (state, action) => {
        if (action.type === 'userCoordinates') {
          return {
            ...state,
            askVA: {
              ...state.askVA,
              currentUserLocation: action.payload,
            },
          };
        }
        return state;
      },
      preloadedState: { ...initialState, askVA: { searchLocationInput: '' } },
    });
  }

  function renderWithStore(extraState = {}) {
    const store = setupStore(extraState);
    return {
      store,
      view: render(
        <Provider store={store}>
          <EducationFacilitySearch />
        </Provider>,
      ),
    };
  }

  beforeEach(() => {
    apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    convertLocationStub = sinon.stub(mapboxModule, 'convertLocation');
  });

  afterEach(() => {
    apiRequestStub.restore();
    convertLocationStub.restore();
  });

  it('should render the empty component correctly', () => {
    const { view } = renderWithStore();

    const searchInput = view.getByRole('searchbox', {
      name: /search for your school/i,
    });

    const useLocationBtn = view.getByRole('button', {
      name: /use my location/i,
    });

    const searchBtn = view.getByRole('button', {
      name: /search/i,
    });

    expect(searchInput).to.exist;
    expect(useLocationBtn).to.exist;
    expect(searchBtn).to.exist;
  });

  it('should handle search submission with school name', async () => {
    const searchTerm = 'Test school';

    apiRequestStub.resolves(mockFacilityData);

    const { view } = renderWithStore();

    const searchInput = view.getByRole('searchbox', {
      name: /search for your school/i,
    });
    const searchBtn = view.getByRole('button', {
      name: /search/i,
    });

    userEvent.type(searchInput, searchTerm);
    userEvent.click(searchBtn);

    expect(view.container.querySelector('va-loading-indicator')).to.exist;
    expect(apiRequestStub.called).to.be.true;

    // Confirm URL is correct
    const requestUrl = apiRequestStub.firstCall.args[0];
    const params = new URL(requestUrl).searchParams;
    expect(params.has('name')).to.be.true;
    expect(params.get('name')).to.equal(searchTerm);

    // Confirm results are rendering
    const resultsDescription = await view.findByText(/showing 2 results for/i);
    expect(resultsDescription).to.exist;

    const radioOptions = view.container.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(2);
  });

  it('should handle search submission with school code', async () => {
    const searchTerm = '123';

    const shortMockFacilityData = {
      data: [mockFacilityData.data[0]],
      meta: { count: 1 },
    };

    apiRequestStub.resolves(shortMockFacilityData);

    const { view } = renderWithStore();

    const searchInput = view.getByRole('searchbox', {
      name: /search for your school/i,
    });
    const searchBtn = view.getByRole('button', {
      name: /search/i,
    });

    userEvent.type(searchInput, searchTerm);
    userEvent.click(searchBtn);

    expect(view.container.querySelector('va-loading-indicator')).to.exist;
    expect(apiRequestStub.called).to.be.true;

    // Confirm URL is correct
    const requestUrl = apiRequestStub.firstCall.args[0];
    const path = new URL(requestUrl).pathname;
    const facilityCode = path.split('/').pop();
    expect(facilityCode).to.equal(searchTerm);

    // Confirm results are rendering
    const resultsDescription = await view.findByText(/showing 1 results for/i);
    expect(resultsDescription).to.exist;

    const radioOptions = view.container.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(1);
  });

  it('should handle error when no results found', async () => {
    const failingSearchTerm = 'this will fail';
    apiRequestStub.resolves({ data: [] });
    const { view } = renderWithStore();

    const searchInput = view.getByRole('searchbox', {
      name: /search for your school/i,
    });
    const searchBtn = view.getByRole('button', { name: /search/i });

    userEvent.type(searchInput, failingSearchTerm);
    userEvent.click(searchBtn);

    expect(view.container.querySelector('va-loading-indicator')).to.exist;
    expect(apiRequestStub.called).to.be.true;

    // Confirm URL is correct
    const requestUrl = apiRequestStub.firstCall.args[0];
    const params = new URL(requestUrl).searchParams;
    expect(params.has('name')).to.be.true;
    expect(params.get('name')).to.equal(failingSearchTerm);

    // Confirm results are rendering
    const errorMsg = await view.findByText(
      "Check the spelling of the school's name or city you entered",
    );
    expect(errorMsg).to.exist;
  });

  it('should handle location-based search', async () => {
    const mockLocationResponse = {
      zipCode: [{ text: '90210' }],
    };

    const mockFacilityResponse = {
      data: [{ attributes: { name: 'Local School' } }],
    };

    convertLocationStub.resolves(mockLocationResponse);
    apiRequestStub.resolves(mockFacilityResponse);

    const { store, view } = renderWithStore();

    const locateMeBtn = view.getByRole('button', { name: /use my location/i });

    userEvent.click(locateMeBtn);
    store.dispatch({ type: 'userCoordinates', payload: 'a new value' });

    waitFor(() => {
      expect(convertLocationStub.called).to.be.true;
      expect(apiRequestStub.called).to.be.true;
      expect(view.container.querySelector('va-loading-indicator')).to.exist;

      const requestUrl = apiRequestStub.firstCall.args[0];
      const params = new URL(requestUrl).searchParams;
      expect(params.has('name')).to.be.true;
      expect(params.get('name')).to.equal(mockLocationResponse.zipCode[0].text);
    });
  });

  it('should display a previously saved value', async () => {
    const initialValue = '12345678 - TEST SCHOOL';
    const { view } = renderWithStore({
      form: { data: { school: initialValue } },
    });

    // Should be just 1 option shown
    const radioOptions = view.container.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(1);

    // Single option shown should show previously stored answer
    const initialOption = view.container.querySelector(
      `va-radio-option[label="${initialValue}"]`,
    );
    expect(initialOption.outerHTML).to.include('checked="true"');
  });

  it('should NOT display the previously saved value on new text search', async () => {
    const searchTerm = 'Test school';
    const initialValue = '12345678 - TEST SCHOOL';
    apiRequestStub.resolves(mockFacilityData);

    const { view } = renderWithStore({
      form: {
        data: {
          school: initialValue,
        },
      },
    });

    // Initial option shows at start
    const getInitialOption = () =>
      view.container.querySelector(`va-radio-option[label="${initialValue}"]`);
    expect(getInitialOption()).to.exist;

    // Run a new search
    const searchInput = view.getByRole('searchbox', {
      name: /search for your school/i,
    });
    const searchBtn = view.getByRole('button', {
      name: /search/i,
    });

    userEvent.type(searchInput, searchTerm);
    userEvent.click(searchBtn);

    expect(getInitialOption()).to.not.exist;
    expect(view.container.querySelector('va-loading-indicator')).to.exist;
    expect(apiRequestStub.called).to.be.true;

    // Confirm results are rendering
    const resultsDescription = await view.findByText(/showing 2 results for/i);
    expect(resultsDescription).to.exist;

    const radioOptions = view.container.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(2);

    // Confirm original value is gone
    radioOptions.forEach(option => {
      expect(option.outerHTML).to.not.include(initialValue);
    });
  });
});
