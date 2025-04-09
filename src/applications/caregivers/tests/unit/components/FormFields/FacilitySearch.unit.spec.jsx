import React from 'react';
import '../../../test-helpers';
import { render, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import * as bboxFetch from '../../../../actions/fetchMapBoxGeocoding';
import * as facilitiesFetch from '../../../../actions/fetchFacilities';
import FacilitySearch from '../../../../components/FormFields/FacilitySearch';
import content from '../../../../locales/en/content.json';
import {
  mockFetchChildFacilityResponse,
  mockFetchChildFacilityWithCaregiverSupportResponse,
  mockFetchFacilitiesResponse,
  mockFetchParentFacilityResponse,
  mockFetchFacilitiesResponseWithoutCaregiverSupport,
  mockFetchParentFacilityResponseWithoutCaregiverSupport,
} from '../../../mocks/fetchFacility';

describe('CG <FacilitySearch>', () => {
  const inputVaSearchInput = (
    container,
    value,
    selector = 'va-search-input',
    submit = true,
  ) => {
    const vaTextInput = $(selector, container);
    vaTextInput.value = value;

    const event = new CustomEvent('input', {
      bubbles: true,
      detail: { value },
    });
    vaTextInput.dispatchEvent(event);

    if (submit) {
      const submitEvent = new CustomEvent('submit', { bubbles: true });
      fireEvent(vaTextInput, submitEvent);
    }
  };

  const onChange = sinon.spy();
  const goBack = sinon.spy();
  const goForward = sinon.spy();
  const goToPath = sinon.spy();
  const dispatch = sinon.spy();

  const getData = ({ reviewMode = false, submitted = false, data = {} }) => ({
    props: {
      formContext: { reviewMode, submitted },
      onChange,
      data,
      goBack,
      goForward,
      goToPath,
    },
    mockStore: {
      getState: () => ({
        form: { data: {} },
        user: {
          login: { currentlyLoggedIn: true },
          profile: { loading: false },
        },
      }),
      subscribe: () => {},
      dispatch,
    },
  });

  const subject = ({ props, mockStore }) => {
    const { container, getByText, queryByText, queryByRole } = render(
      <Provider store={mockStore}>
        <FacilitySearch {...props} />
      </Provider>,
    );
    const selectors = () => ({
      input: container.querySelector('va-search-input'),
      loader: container.querySelector('va-loading-indicator'),
      radioList: container.querySelector('va-radio'),
      searchInputError: queryByRole('alert'),
      moreFacilities: container.vaButtonGetByText(
        content['form-facilities-load-more-button'],
      ),
      ariaLiveStatus: queryByRole('status'),
      formNavButtons: {
        back: getByText('Back'),
        forward: getByText('Continue'),
      },
    });
    return { container, selectors, getByText, queryByText };
  };

  afterEach(() => {
    goBack.reset();
    goForward.reset();
    dispatch.reset();
    goToPath.reset();
  });

  context('when the component renders on the form page', () => {
    it('should render `va-search-input`', () => {
      const { props, mockStore } = getData({});
      const { selectors, queryByText } = subject({ props, mockStore });
      expect(selectors().input).to.exist;
      expect(selectors().radioList).not.to.exist;
      expect(selectors().moreFacilities).not.to.exist;
      expect(selectors().ariaLiveStatus).not.to.exist;
      expect(queryByText(content['form-facilities-search-label'])).to.exist;
      expect(queryByText(content['validation-required-label'])).to.exist;
    });
  });

  context('when search is attempted with valid data', () => {
    const lat = 1;
    const long = 2;
    const perPage = 5;
    const radius = 500;
    const mapBoxSuccessResponse = { center: [long, lat] };
    let mapboxStub;
    let facilitiesStub;

    beforeEach(() => {
      mapboxStub = sinon.stub(bboxFetch, 'fetchMapBoxGeocoding');
      facilitiesStub = sinon.stub(facilitiesFetch, 'fetchFacilities');
    });

    afterEach(() => {
      mapboxStub.restore();
      facilitiesStub.restore();
    });

    it('should fetch list of facilities to select on success', async () => {
      const { props, mockStore } = getData({});
      const { selectors, container } = subject({ props, mockStore });
      mapboxStub.resolves(mapBoxSuccessResponse);
      facilitiesStub.resolves(mockFetchFacilitiesResponse);

      await waitFor(() => {
        inputVaSearchInput(container, 'Tampa', selectors().input);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.exist;
        expect(selectors().loader).to.not.exist;
        expect(selectors().ariaLiveStatus.textContent).to.eq('');
        expect(selectors().input).to.not.have.attr('error');
        sinon.assert.calledWith(mapboxStub, 'Tampa');
        sinon.assert.calledWith(facilitiesStub, {
          lat,
          long,
          perPage,
          radius,
          page: 1,
        });
      });
    });

    it('only renders query value that was searched for', async () => {
      const { props, mockStore } = getData({});
      const { container, getByText, selectors } = subject({ props, mockStore });
      mapboxStub.resolves(mapBoxSuccessResponse);
      facilitiesStub.resolves(mockFetchFacilitiesResponse);

      await waitFor(() => {
        inputVaSearchInput(container, 'Tampa', selectors().input);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        inputVaSearchInput(container, 'Denver', selectors().input);
      });

      await waitFor(() => {
        expect(getByText('“Tampa”')).to.exist;
      });
    });

    context('caregiverSupport callback', () => {
      it('calls dispatch callback with facility object that offers CaregiverSupport', async () => {
        const { props, mockStore } = getData({});
        const { container, selectors } = subject({ props, mockStore });
        const facilitiesResponse = mockFetchChildFacilityWithCaregiverSupportResponse;
        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.resolves(facilitiesResponse);

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
        });

        const [selectedFacility] = facilitiesResponse.facilities;

        selectors().radioList.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });
        await waitFor(() => {
          expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
          expect(dispatch.firstCall.args[0].data).to.deep.include({
            'view:plannedClinic': {
              veteranSelected: selectedFacility,
              caregiverSupport: selectedFacility,
            },
          });
        });
      });

      it('calls dispatch callback with facility object whose parent is loaded and offers CaregiverSupport', async () => {
        const { props, mockStore } = getData({});
        const { container, selectors } = subject({ props, mockStore });
        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.resolves(mockFetchFacilitiesResponse);

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
        });

        const [
          selectedFacility,
          parentFacility,
        ] = mockFetchFacilitiesResponse.facilities;

        selectors().radioList.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });

        await waitFor(() => {
          expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
          expect(dispatch.firstCall.args[0].data).to.deep.include({
            'view:plannedClinic': {
              veteranSelected: selectedFacility,
              caregiverSupport: parentFacility,
            },
          });
        });
      });

      it('calls dispatch callback with facility object whose parent is loaded and does not offer CaregiverSupport', async () => {
        const { props, mockStore } = getData({});
        const { container, selectors } = subject({ props, mockStore });
        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.resolves(
          mockFetchFacilitiesResponseWithoutCaregiverSupport,
        );

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
        });

        const [selectedFacility] = mockFetchFacilitiesResponse.facilities;

        selectors().radioList.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });

        await waitFor(() => {
          expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
          expect(dispatch.firstCall.args[0].data).to.deep.include({
            'view:plannedClinic': {
              veteranSelected: selectedFacility,
              caregiverSupport: undefined,
            },
          });
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(selectors().radioList).to.have.attr(
            'error',
            content['error--facilities-parent-facility'],
          );
        });
      });

      it('calls dispatch callback with facility object whose parent is not loaded and offers CaregiverSupport', async () => {
        const { props, mockStore } = getData({});
        const { container, selectors } = subject({ props, mockStore });
        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.onFirstCall().resolves(mockFetchChildFacilityResponse);

        const parentFacilityResponse = mockFetchParentFacilityResponse;
        facilitiesStub.onSecondCall().resolves(parentFacilityResponse);

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
        });

        const [selectedFacility] = mockFetchChildFacilityResponse.facilities;

        selectors().radioList.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });

        await waitFor(() => {
          sinon.assert.calledWith(mapboxStub, 'Tampa');
          sinon.assert.calledWith(facilitiesStub, { facilityIds: ['vha_757'] });
          expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
          expect(dispatch.firstCall.args[0].data).to.deep.include({
            'view:plannedClinic': {
              veteranSelected: selectedFacility,
              caregiverSupport: parentFacilityResponse.facilities[0],
            },
          });
        });
      });

      it('calls dispatch callback with facility object whose parent is not loaded and does not offer CaregiverSupport', async () => {
        const { props, mockStore } = getData({});
        const { container, selectors } = subject({ props, mockStore });
        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.onFirstCall().resolves(mockFetchChildFacilityResponse);

        const parentFacilityResponse = mockFetchParentFacilityResponseWithoutCaregiverSupport;
        facilitiesStub.onSecondCall().resolves(parentFacilityResponse);

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
        });

        const [selectedFacility] = mockFetchChildFacilityResponse.facilities;

        selectors().radioList.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });

        await waitFor(() => {
          expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
          expect(dispatch.firstCall.args[0].data).to.deep.include({
            'view:plannedClinic': {
              veteranSelected: selectedFacility,
              caregiverSupport: undefined,
            },
          });
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(selectors().radioList).to.have.attr(
            'error',
            content['error--facilities-parent-facility'],
          );
        });
      });

      it('fails to retrieve parent facility', async () => {
        const { props, mockStore } = getData({});
        const { container, selectors } = subject({ props, mockStore });
        const facilitiesResponse = mockFetchChildFacilityResponse;
        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.onFirstCall().resolves(facilitiesResponse);

        facilitiesStub.onSecondCall().resolves({
          type: 'SEARCH_FAILED',
          errorMessage: 'Some bad error occurred.',
        });

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
        });

        const [selectedFacility] = facilitiesResponse.facilities;

        selectors().radioList.__events.vaValueChange({
          detail: { value: selectedFacility.id },
        });

        await waitFor(() => {
          expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
          expect(dispatch.firstCall.args[0].data).to.deep.include({
            'view:plannedClinic': {
              veteranSelected: selectedFacility,
              caregiverSupport: undefined,
            },
          });
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(selectors().searchInputError.textContent).to.eq(
            'ErrorSome bad error occurred.',
          );
          expect(selectors().searchInputError.parentElement).to.have.class(
            'caregiver-facilities-search-input-error',
          );
        });
      });
    });

    it('loads radio value from formData veteranSelected when set', async () => {
      const facilityId = 'my_facility_id';
      const { props, mockStore } = getData({
        data: {
          'view:plannedClinic': { veteranSelected: { id: facilityId } },
        },
      });
      const { container, selectors } = subject({ props, mockStore });
      const facilitiesResponse = mockFetchFacilitiesResponse;
      mapboxStub.resolves(mapBoxSuccessResponse);
      facilitiesStub.resolves(facilitiesResponse);

      await waitFor(() => {
        inputVaSearchInput(container, 'Tampa', selectors().input);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.exist;
        expect(selectors().loader).to.not.exist;
        expect(selectors().radioList.value).to.equal(facilityId);
      });
    });

    it('sets error when trying to click goForward when facilities are rendered but none selected', async () => {
      const { props, mockStore } = getData({});
      const { container, selectors } = subject({ props, mockStore });
      const facilities = mockFetchFacilitiesResponse;
      mapboxStub.resolves(mapBoxSuccessResponse);
      facilitiesStub.resolves(facilities);

      await waitFor(() => {
        inputVaSearchInput(container, 'Tampa', selectors().input);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.exist;
        expect(selectors().loader).to.not.exist;
      });

      await waitFor(() => {
        userEvent.click(selectors().formNavButtons.forward);
      });

      await waitFor(() => {
        expect(goForward.calledOnce).to.be.false;
        expect(selectors().radioList).to.have.attr(
          'error',
          content['validation-facilities--default-required'],
        );
      });
    });

    context('more facilities buttons', () => {
      it('successfully loads 1 more facility on click', async () => {
        const { props, mockStore } = getData({});
        const { selectors, getByText, container } = subject({
          props,
          mockStore,
        });

        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub
          .onFirstCall()
          .resolves(mockFetchChildFacilityWithCaregiverSupportResponse);
        facilitiesStub.onSecondCall().resolves(mockFetchParentFacilityResponse);

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(selectors().input).to.not.have.attr('error');
          expect(getByText(/Showing 1-1 of 1 facilities for/)).to.exist;
          expect(selectors().ariaLiveStatus.textContent).to.eq('');
        });

        await waitFor(() => {
          userEvent.click(selectors().moreFacilities);
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.exist;
          expect(selectors().ariaLiveStatus.textContent).to.eq('');
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(getByText(/Showing 1-2 of 2 facilities for/)).to.exist;
          expect(selectors().input).to.not.have.attr('error');
          expect(selectors().ariaLiveStatus.textContent).to.eq(
            '1 new facility loaded. Showing 2 facilities matching your search criteria.',
          );
        });

        await waitFor(() => {
          sinon.assert.calledWith(mapboxStub, 'Tampa');
          sinon.assert.calledWith(facilitiesStub, {
            lat,
            long,
            perPage,
            radius,
            page: 2,
          });
          expect(mapboxStub.callCount).to.equal(1);
          // This is 3 because there is an existing bug that using submit with the va-search-input component triggers two requests
          // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/3117
          expect(facilitiesStub.callCount).to.equal(3);
        });
      });

      it('successfully loads 2 more facilities on click', async () => {
        const { props, mockStore } = getData({});
        const { selectors, getByText, container } = subject({
          props,
          mockStore,
        });

        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub
          .onFirstCall()
          .resolves(mockFetchChildFacilityWithCaregiverSupportResponse);
        facilitiesStub.onSecondCall().resolves(mockFetchFacilitiesResponse);

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(selectors().input).to.not.have.attr('error');
          expect(getByText(/Showing 1-1 of 1 facilities for/)).to.exist;
          expect(selectors().ariaLiveStatus.textContent).to.eq('');
        });

        await waitFor(() => {
          userEvent.click(selectors().moreFacilities);
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.exist;
          expect(selectors().ariaLiveStatus.textContent).to.eq('');
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(getByText(/Showing 1-3 of 3 facilities for/)).to.exist;
          expect(selectors().input).to.not.have.attr('error');
          expect(selectors().ariaLiveStatus.textContent).to.eq(
            '2 new facilities loaded. Showing 3 facilities matching your search criteria.',
          );
        });

        await waitFor(() => {
          sinon.assert.calledWith(mapboxStub, 'Tampa');
          sinon.assert.calledWith(facilitiesStub, {
            lat,
            long,
            perPage,
            radius,
            page: 2,
          });
          expect(mapboxStub.callCount).to.equal(1);
          // This is 3 because there is an existing bug that using submit with the va-search-input component triggers two requests
          // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/3117
          expect(facilitiesStub.callCount).to.equal(3);
        });
      });

      it('handles error loading more facilities on click', async () => {
        const { props, mockStore } = getData({});
        const { selectors, getByText, container } = subject({
          props,
          mockStore,
        });

        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.onFirstCall().resolves(mockFetchFacilitiesResponse);
        facilitiesStub.onSecondCall().resolves({
          type: 'SEARCH_FAILED',
          errorMessage: 'Some bad error occurred.',
        });

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(selectors().input).to.not.have.attr('error');
          expect(getByText(/Showing 1-2 of 2 facilities for/)).to.exist;
        });

        await waitFor(() => {
          userEvent.click(selectors().moreFacilities);
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(selectors().searchInputError.textContent).to.eq(
            'ErrorSome bad error occurred.',
          );
          expect(getByText(/Showing 1-2 of 2 facilities for/)).to.exist;
        });
      });

      it('only renders more facilities button when totalEntries is greater than facilities total', async () => {
        const { props, mockStore } = getData({});
        const { selectors, getByText, container } = subject({
          props,
          mockStore,
        });

        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.resolves({
          ...mockFetchFacilitiesResponse,
          meta: {
            pagination: {
              currentPage: 1,
              perPage: 5,
              totalEntries: 2,
              totalPages: 3,
            },
          },
        });

        await waitFor(() => {
          inputVaSearchInput(container, 'Tampa', selectors().input);
          expect(selectors().loader).to.exist;
        });

        await waitFor(() => {
          expect(selectors().radioList).to.exist;
          expect(selectors().loader).to.not.exist;
          expect(selectors().input).to.not.have.attr('error');
          expect(getByText(/Showing 1-2 of 2 facilities for/)).to.exist;
          expect(selectors().moreFacilities).not.to.exist;
        });
      });
    });

    context('handles api errors', () => {
      context('mapbox errors', () => {
        it('should render SEARCH_FAILED when mapbox fetch fails', async () => {
          const { props, mockStore } = getData({});
          const { container, selectors } = subject({ props, mockStore });
          mapboxStub.resolves({
            errorMessage: 'Some bad error occurred.',
            type: 'SEARCH_FAILED',
          });
          await waitFor(() => {
            inputVaSearchInput(container, 'Tampa', selectors().input);
            expect(selectors().loader).to.exist;
          });

          await waitFor(() => {
            expect(selectors().radioList).to.not.exist;
            expect(selectors().loader).to.not.exist;
            expect(selectors().searchInputError.textContent).to.eq(
              'ErrorSome bad error occurred.',
            );
          });
        });

        it('should render NO_SEARCH_RESULTS when mapbox fetch returns nothing', async () => {
          const { props, mockStore } = getData({});
          const { container, selectors } = subject({ props, mockStore });
          mapboxStub.resolves({
            errorMessage: 'No search results found.',
            type: 'NO_SEARCH_RESULTS',
          });

          await waitFor(() => {
            inputVaSearchInput(container, 'Tampa', selectors().input);
            expect(selectors().loader).to.exist;
          });

          await waitFor(() => {
            expect(selectors().radioList).to.not.exist;
            expect(selectors().loader).to.not.exist;
            expect(selectors().searchInputError.textContent).to.eq(
              'ErrorNo search results found.',
            );
          });
        });
      });

      context('facilities errors', () => {
        it('should render appropriate error message when facilities fetch fails', async () => {
          const { props, mockStore } = getData({});
          const { container, selectors } = subject({ props, mockStore });
          mapboxStub.resolves(mapBoxSuccessResponse);
          facilitiesStub.resolves({
            type: 'SEARCH_FAILED',
            errorMessage: 'Some bad error occurred.',
          });

          await waitFor(() => {
            inputVaSearchInput(container, 'Tampa', selectors().input);
            expect(selectors().loader).to.exist;
          });

          await waitFor(() => {
            expect(selectors().radioList).to.not.exist;
            expect(selectors().loader).to.not.exist;
            expect(selectors().searchInputError.textContent).to.eq(
              'ErrorSome bad error occurred.',
            );
          });
        });
      });
    });
  });

  context('formNavButtons', () => {
    it('renders back and forward buttons', () => {
      const { props, mockStore } = getData({});
      const { selectors } = subject({ props, mockStore });
      expect(selectors().formNavButtons.back).to.exist;
      expect(selectors().formNavButtons.forward).to.exist;
    });

    it('calls goBack callback on click', () => {
      const { props, mockStore } = getData({});
      const { selectors } = subject({ props, mockStore });
      userEvent.click(selectors().formNavButtons.back);
      expect(goBack.calledOnce).to.be.true;
    });

    context('goForward', () => {
      it('calls goForward callback when facility is set', () => {
        const { props, mockStore } = getData({
          data: {
            'view:plannedClinic': { caregiverSupport: { id: 'my id' } },
          },
        });
        const { selectors } = subject({ props, mockStore });
        userEvent.click(selectors().formNavButtons.forward);
        expect(goForward.calledOnce).to.be.true;
      });

      context('facility is not set', () => {
        it('renders error when trying to click goForward without submitting search', () => {
          const { props, mockStore } = getData({});
          const { container, selectors, getByText } = subject({
            props,
            mockStore,
          });
          inputVaSearchInput(container, 'Tampa', selectors().input, false);
          userEvent.click(selectors().formNavButtons.forward);
          expect(goForward.calledOnce).to.be.false;
          expect(selectors().searchInputError.textContent).to.eq(
            `Error${content['validation-facilities--submit-search-required']}`,
          );
          expect(selectors().searchInputError.parentElement).to.have.class(
            'caregiver-facilities-search-input-error',
          );
          expect(getByText(content['validation-required-label'])).to.exist;
        });

        it('renders error when trying to click goForward when no search value is present', () => {
          const { props, mockStore } = getData({});
          const { selectors, getByText } = subject({ props, mockStore });
          userEvent.click(selectors().formNavButtons.forward);
          expect(goForward.calledOnce).to.be.false;
          expect(selectors().searchInputError.textContent).to.eq(
            `Error${content['validation-facilities--search-required']}`,
          );
          expect(selectors().searchInputError.parentElement).to.have.class(
            'caregiver-facilities-search-input-error',
          );
          expect(getByText(content['validation-required-label'])).to.exist;
        });
      });
    });

    context('review mode', () => {
      beforeEach(() => {
        Object.defineProperty(window, 'location', {
          value: { search: '?review=true' },
          configurable: true,
        });
      });

      it('calls goToPath to review page on back click', () => {
        const { props, mockStore } = getData({});
        const { selectors } = subject({ props, mockStore });
        userEvent.click(selectors().formNavButtons.back);
        expect(goToPath.calledWith('/review-and-submit')).to.be.true;
      });

      context('goForward', () => {
        it('calls goToPath callback to review page on forward click when selected facility has caregiver support', () => {
          const { props, mockStore } = getData({
            data: {
              'view:plannedClinic': {
                caregiverSupport: { id: 'my id' },
                veteranSelected: { id: 'my id' },
              },
            },
          });
          const { selectors } = subject({ props, mockStore });
          userEvent.click(selectors().formNavButtons.forward);
          expect(goToPath.calledWith('/review-and-submit')).to.be.true;
        });

        it('calls goToPath callback to facility confirmation on forward click when selected facility does not have caregiver support', () => {
          const { props, mockStore } = getData({
            data: {
              'view:plannedClinic': {
                caregiverSupport: { id: 'my id' },
                veteranSelected: { id: 'other id' },
              },
            },
          });
          const { selectors } = subject({ props, mockStore });
          userEvent.click(selectors().formNavButtons.forward);
          expect(
            goToPath.calledWith(
              '/veteran-information/va-medical-center/confirm?review=true',
            ),
          ).to.be.true;
        });
      });
    });
  });
});
