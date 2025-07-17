import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { Provider } from 'react-redux';
import * as bboxFetch from '../../../../actions/fetchMapBoxGeocoding';
import * as facilitiesFetch from '../../../../actions/fetchFacilities';
import FacilitySearch from '../../../../components/FormFields/FacilitySearch';
import { inputVaSearchInput, runSearch } from '../../../test-helpers';
import content from '../../../../locales/en/content.json';
import {
  mockFetchChildFacilityResponse,
  mockFetchChildFacilityWithCaregiverSupportResponse,
  mockFetchFacilitiesResponse,
  mockFetchParentFacilityResponse,
  mockFetchFacilitiesResponseWithoutCaregiverSupport,
  mockFetchParentFacilityResponseWithoutCaregiverSupport,
} from '../../../mocks/fetchFacility';

// declare error message content
const ERROR_MSG_PARENT = content['error--facilities-parent-facility'];
const ERROR_MSG_REQUIRED = content['validation-facilities--search-required'];
const ERROR_MSG_DEFAULT = content['validation-facilities--default-required'];

describe('CG <FacilitySearch>', () => {
  const lat = 1;
  const long = 2;
  const perPage = 5;
  const radius = 500;
  const query = 'Tampa';
  const mapBoxSuccessResponse = { center: [long, lat] };
  let mockLogger;
  let dispatch;
  let mapboxStub;
  let facilitiesStub;

  const subject = ({ data = {} } = {}) => {
    const props = { data, goForward: f => f, goBack: f => f, goToPath: f => f };
    const mockStore = { getState: () => {}, subscribe: () => {}, dispatch };
    const { container, getByText, queryByRole, queryByText } = render(
      <Provider store={mockStore}>
        <FacilitySearch {...props} />
      </Provider>,
    );
    const selectors = () => ({
      continueBtn: queryByRole('button', { name: /Continue/i }),
      loadMoreBtn: container.vaButtonGetByText(
        content['form-facilities-load-more-button'],
      ),
      ariaLiveStatus: queryByRole('status'),
      searchInputError: queryByRole('alert'),
      vaRadio: container.querySelector('va-radio'),
      vaSearchInput: container.querySelector('va-search-input'),
      vaLoadingIndicator: container.querySelector('va-loading-indicator'),
    });
    return { container, selectors, getByText, queryByText };
  };

  beforeEach(() => {
    mockLogger = { warn: sinon.spy() };
    dispatch = sinon.spy();

    mapboxStub = sinon
      .stub(bboxFetch, 'fetchMapBoxGeocoding')
      .resolves(mapBoxSuccessResponse);
    facilitiesStub = sinon
      .stub(facilitiesFetch, 'fetchFacilities')
      .resolves(mockFetchFacilitiesResponse);

    Object.defineProperty(window, 'DD_LOGS', {
      value: { logger: mockLogger },
      configurable: true,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  context('when the facilities fetch succeeds', () => {
    it('should render `vaRadio` to allow for option selection', async () => {
      const { selectors, container } = subject();

      await runSearch({ container, query });
      await waitFor(() => {
        const {
          ariaLiveStatus,
          vaLoadingIndicator,
          vaSearchInput,
          vaRadio,
        } = selectors();
        expect(vaRadio).to.exist;
        expect(vaLoadingIndicator).to.not.exist;
        expect(ariaLiveStatus.textContent).to.eq('');
        expect(vaSearchInput).to.not.have.attr('error');
      });

      sinon.assert.calledWithExactly(mapboxStub, 'Tampa');
      sinon.assert.calledWithExactly(facilitiesStub, {
        lat,
        long,
        perPage,
        radius,
        page: 1,
      });
    });

    it('should render the query value that was utilized for the search', async () => {
      const { container, queryByText } = subject();
      await runSearch({ container, query });
      await waitFor(() => expect(queryByText('“Tampa”')).to.exist);
    });

    it('should not render `Load more` button when total count less than the per page value', async () => {
      const { container, selectors } = subject();
      const totalEntries = 2;

      facilitiesStub.resolves({
        ...mockFetchFacilitiesResponse,
        meta: {
          pagination: {
            currentPage: 1,
            totalPages: 3,
            totalEntries,
            perPage,
          },
        },
      });

      await runSearch({ container, query });
      await waitFor(() => {
        const { loadMoreBtn } = selectors();
        expect(loadMoreBtn).to.not.exist;
      });
    });

    it('should apply the appropriate value prop to `vaRadio` when the value exists in form data', async () => {
      const facilityId = 'my_facility_id';
      const { container, selectors } = subject({
        data: {
          'view:plannedClinic': { veteranSelected: { id: facilityId } },
        },
      });
      await runSearch({ container, query });
      await waitFor(() => {
        const { vaRadio } = selectors();
        expect(vaRadio).to.exist;
        expect(vaRadio.value).to.eq(facilityId);
      });
    });

    it('should render error when trying to click the continue button before selecting facility', async () => {
      const { container, selectors } = subject();
      const { continueBtn } = selectors();

      await runSearch({ container, query });
      await waitFor(() => {
        const { vaRadio } = selectors();
        expect(vaRadio).to.exist;
      });
      fireEvent.click(continueBtn);
      await waitFor(() => {
        const { vaRadio } = selectors();
        expect(vaRadio).to.have.attr('error', ERROR_MSG_DEFAULT);
      });
    });
  });

  context('when the facilities fetch fails', () => {
    it('should correctly handle error when Mapbox fetch fails', async () => {
      const { container, selectors } = subject();
      const errorMessage = 'Some bad error occurred.';

      mapboxStub.resolves({ errorMessage, type: 'SEARCH_FAILED' });
      inputVaSearchInput({ container, query });

      await waitFor(() => {
        const { searchInputError } = selectors();
        expect(searchInputError.textContent).to.eq(`Error${errorMessage}`);
      });
    });

    it('should correctly handle error when Mapbox fetch returns empty', async () => {
      const { container, selectors } = subject();
      const errorMessage = 'No search results found.';

      mapboxStub.resolves({ errorMessage, type: 'NO_SEARCH_RESULTS' });
      inputVaSearchInput({ container, query });

      await waitFor(() => {
        const { searchInputError } = selectors();
        expect(searchInputError.textContent).to.eq(`Error${errorMessage}`);
      });
    });

    it('should correctly handle error when query is invalid', async () => {
      const { container, selectors } = subject();
      inputVaSearchInput({ container, query: '  ' });
      await waitFor(() => {
        const { searchInputError } = selectors();
        expect(searchInputError.textContent).to.eq(
          `Error${ERROR_MSG_REQUIRED}`,
        );
      });
    });

    it('should correctly handle error when Facilities fetch fails', async () => {
      const { container, selectors } = subject();
      const errorMessage = 'Some bad error occurred.';

      facilitiesStub.resolves({ errorMessage, type: 'SEARCH_FAILED' });
      inputVaSearchInput({ container, query });

      await waitFor(() => {
        const { searchInputError } = selectors();
        expect(searchInputError.textContent).to.eq(`Error${errorMessage}`);
      });
    });

    it('should correctly handle error when parent facility fetch fails', async () => {
      const { container, selectors } = subject();
      const facilitiesResponse = mockFetchChildFacilityResponse;
      const [selectedFacility] = facilitiesResponse.facilities;
      const errorMessage = 'Some bad error occurred.';
      const parentElClass = 'caregiver-facilities-search-input-error';

      facilitiesStub.onFirstCall().resolves(facilitiesResponse);
      facilitiesStub.resolves({ errorMessage, type: 'SEARCH_FAILED' });

      await runSearch({ container, query });
      await waitFor(() => {
        const { vaRadio } = selectors();
        vaRadio.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });
      });
      await waitFor(() => {
        const { searchInputError } = selectors();
        expect(searchInputError.textContent).to.eq(`Error${errorMessage}`);
        expect(searchInputError.parentElement).to.have.class(parentElClass);
      });

      sinon.assert.calledOnceWithExactly(dispatch, {
        type: 'SET_DATA',
        data: {
          'view:plannedClinic': {
            veteranSelected: selectedFacility,
            caregiverSupport: undefined,
          },
        },
      });
    });

    it('should correctly handle error when `Load more` fetch fails', async () => {
      const { container, selectors, queryByText } = subject();
      const errorMessage = 'Some bad error occurred.';
      const statusMessage = /Showing 1-2 of 2 facilities for/;

      facilitiesStub.onFirstCall().resolves(mockFetchFacilitiesResponse);
      facilitiesStub.resolves({ errorMessage, type: 'SEARCH_FAILED' });

      await runSearch({ container, query });
      await waitFor(() => expect(queryByText(statusMessage)).to.exist);

      const { loadMoreBtn } = selectors();
      fireEvent.click(loadMoreBtn);

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });
      await waitFor(() => {
        const { searchInputError } = selectors();
        expect(searchInputError.textContent).to.eq(`Error${errorMessage}`);
        expect(queryByText(statusMessage)).to.exist;
      });
    });
  });

  /* 
   * NOTE: There is an existing bug with the va-search-input component triggers two submit requests.
   * We need to handle the fact that this does exist, but also don't let the test break if it gets
   * fixed.
   * 
   * https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/3117
   */
  context('when the `Load more` button is clicked', () => {
    it('should successfully load 1 more facility', async () => {
      const { container, selectors, queryByText } = subject();

      facilitiesStub
        .onFirstCall()
        .resolves(mockFetchChildFacilityWithCaregiverSupportResponse);
      facilitiesStub.resolves(mockFetchParentFacilityResponse);

      await runSearch({ container, query });
      await waitFor(() => {
        const { ariaLiveStatus } = selectors();
        expect(queryByText(/Showing 1-1 of 1 facilities for/)).to.exist;
        expect(ariaLiveStatus.textContent).to.eq('');
      });

      const { loadMoreBtn } = selectors();
      fireEvent.click(loadMoreBtn);

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });
      await waitFor(() => {
        const { ariaLiveStatus } = selectors();
        // Check for *either* 1-2 or 1-3 message to tolerate bug mention above
        const statusMatch =
          queryByText(/Showing 1-2 of 2 facilities for/) ||
          queryByText(/Showing 1-3 of 3 facilities for/);
        expect(statusMatch).to.exist;
        expect(ariaLiveStatus.textContent).to.include(
          'facilities matching your search criteria.',
        );
      });

      sinon.assert.calledOnceWithExactly(mapboxStub, query);
      sinon.assert.calledWithExactly(facilitiesStub, {
        lat,
        long,
        perPage,
        radius,
        page: 2,
      });

      // Extra: tolerate double call issue, for now
      expect(facilitiesStub.callCount).to.be.at.least(2);
      expect(facilitiesStub.callCount).to.be.at.most(3);
    });

    it('should successfully load 2 more facilities', async () => {
      const { container, selectors, queryByText } = subject();

      facilitiesStub
        .onFirstCall()
        .resolves(mockFetchChildFacilityWithCaregiverSupportResponse);

      await runSearch({ container, query });
      await waitFor(() => {
        const { ariaLiveStatus } = selectors();
        expect(queryByText(/Showing 1-1 of 1 facilities for/)).to.exist;
        expect(ariaLiveStatus.textContent).to.eq('');
      });

      const { loadMoreBtn } = selectors();
      fireEvent.click(loadMoreBtn);

      await waitFor(() => {
        const { vaLoadingIndicator } = selectors();
        expect(vaLoadingIndicator).to.exist;
      });
      await waitFor(() => {
        const { ariaLiveStatus } = selectors();
        // Check for *either* 1-2 or 1-3 message to tolerate bug mention above
        const statusMatch =
          queryByText(/Showing 1-3 of 3 facilities for/) ||
          queryByText(/Showing 1-5 of 5 facilities for/);
        expect(statusMatch).to.exist;
        expect(ariaLiveStatus.textContent).to.include(
          'facilities matching your search criteria.',
        );
      });

      sinon.assert.calledOnceWithExactly(mapboxStub, query);
      sinon.assert.calledWithExactly(facilitiesStub, {
        lat,
        long,
        perPage,
        radius,
        page: 2,
      });

      // Extra: tolerate double call issue, for now
      expect(facilitiesStub.callCount).to.be.at.least(2);
      expect(facilitiesStub.callCount).to.be.at.most(3);
    });
  });

  context('when a facility is selected from the list', () => {
    it('should call dispatch action with facility object that offers support services', async () => {
      const { container, selectors } = subject();
      const facilitiesResponse = mockFetchChildFacilityWithCaregiverSupportResponse;
      const [selectedFacility] = facilitiesResponse.facilities;

      facilitiesStub.resolves(facilitiesResponse);

      await runSearch({ container, query });
      await waitFor(() => {
        const { vaRadio } = selectors();
        vaRadio.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });
      });

      sinon.assert.calledOnceWithExactly(dispatch, {
        type: 'SET_DATA',
        data: {
          'view:plannedClinic': {
            veteranSelected: selectedFacility,
            caregiverSupport: selectedFacility,
          },
        },
      });
    });

    it('should call dispatch action with facility object whose parent is loaded & offers support services', async () => {
      const { container, selectors } = subject();
      const [
        selectedFacility,
        parentFacility,
      ] = mockFetchFacilitiesResponse.facilities;

      await runSearch({ container, query });
      await waitFor(() => {
        const { vaRadio } = selectors();
        vaRadio.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });
      });

      sinon.assert.calledOnceWithExactly(dispatch, {
        type: 'SET_DATA',
        data: {
          'view:plannedClinic': {
            veteranSelected: selectedFacility,
            caregiverSupport: parentFacility,
          },
        },
      });
    });

    it('should call dispatch action with facility object whose parent is loaded & does not offer support services', async () => {
      const { container, selectors } = subject();
      const [selectedFacility] = mockFetchFacilitiesResponse.facilities;

      facilitiesStub.resolves(
        mockFetchFacilitiesResponseWithoutCaregiverSupport,
      );

      await runSearch({ container, query });
      await waitFor(() => {
        const { vaRadio } = selectors();
        vaRadio.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });
      });
      await waitFor(() => {
        const { vaRadio } = selectors();
        expect(vaRadio).to.have.attr('error', ERROR_MSG_PARENT);
      });

      sinon.assert.calledOnce(mockLogger.warn);
      sinon.assert.calledWithExactly(dispatch, {
        type: 'SET_DATA',
        data: {
          'view:plannedClinic': {
            veteranSelected: selectedFacility,
            caregiverSupport: undefined,
          },
        },
      });
    });

    it('should call dispatch action with facility object whose parent is not loaded and offers support services', async () => {
      const { container, selectors } = subject();
      const parentFacilityResponse = mockFetchParentFacilityResponse;
      const [selectedFacility] = mockFetchChildFacilityResponse.facilities;

      facilitiesStub.onFirstCall().resolves(mockFetchChildFacilityResponse);
      facilitiesStub.resolves(parentFacilityResponse);

      await runSearch({ container, query });
      await waitFor(() => {
        const { vaRadio } = selectors();
        vaRadio.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });
      });

      sinon.assert.calledWithExactly(mapboxStub, 'Tampa');
      sinon.assert.calledWithExactly(facilitiesStub, {
        facilityIds: ['vha_757'],
      });
      sinon.assert.calledOnceWithExactly(dispatch, {
        type: 'SET_DATA',
        data: {
          'view:plannedClinic': {
            veteranSelected: selectedFacility,
            caregiverSupport: parentFacilityResponse.facilities[0],
          },
        },
      });
    });

    it('should call dispatch action with facility object whose parent is not loaded and does not offer support services', async () => {
      const { container, selectors } = subject();
      const [selectedFacility] = mockFetchChildFacilityResponse.facilities;

      facilitiesStub.onFirstCall().resolves(mockFetchChildFacilityResponse);
      facilitiesStub.resolves(
        mockFetchParentFacilityResponseWithoutCaregiverSupport,
      );

      await runSearch({ container, query });
      await waitFor(() => {
        const { vaRadio } = selectors();
        vaRadio.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });
      });
      await waitFor(() => {
        const { vaRadio } = selectors();
        expect(vaRadio).to.have.attr('error', ERROR_MSG_PARENT);
      });

      sinon.assert.calledOnce(mockLogger.warn);
      sinon.assert.calledOnceWithExactly(dispatch, {
        type: 'SET_DATA',
        data: {
          'view:plannedClinic': {
            veteranSelected: selectedFacility,
            caregiverSupport: undefined,
          },
        },
      });
    });
  });
});
