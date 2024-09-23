import React from 'react';
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
} from '../../../mocks/responses';

describe('CG <FacilitySearch>', () => {
  const inputVaSearchInput = (
    container,
    value,
    selector = 'va-search-input',
  ) => {
    const vaTextInput = $(selector, container);
    vaTextInput.value = value;

    const event = new CustomEvent('input', {
      bubbles: true,
      detail: { value },
    });
    vaTextInput.dispatchEvent(event);

    const submitEvent = new CustomEvent('submit', { bubbles: true });
    fireEvent(vaTextInput, submitEvent);
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
      moreFacilities: queryByText('Load more facilities'),
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
      expect(queryByText(content['form-facilities-search-label'])).to.exist;
      expect(queryByText('(*Required)')).to.exist;
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

    it('calls dispatch callback with facility object that offers CaregiverSupport', async () => {
      const { props, mockStore } = getData({});
      const { container, selectors } = subject({ props, mockStore });
      const facilities = mockFetchChildFacilityWithCaregiverSupportResponse;
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

      const [selectedFacility] = facilities;

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

    it('calls dispatch callback with facility object whose parent offers CaregiverSupport and is loaded', async () => {
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

      const [selectedFacility, parentFacility] = facilities;

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

    it('calls dispatch callback with facility object whose parent offers CaregiverSupport and is not loaded', async () => {
      const { props, mockStore } = getData({});
      const { container, selectors } = subject({ props, mockStore });
      const facilities = mockFetchChildFacilityResponse;
      mapboxStub.resolves(mapBoxSuccessResponse);
      facilitiesStub.onFirstCall().resolves(facilities);

      const parentFacility = mockFetchParentFacilityResponse;
      facilitiesStub.onSecondCall().resolves([parentFacility]);

      await waitFor(() => {
        inputVaSearchInput(container, 'Tampa', selectors().input);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.exist;
        expect(selectors().loader).to.not.exist;
      });

      const [selectedFacility] = facilities;

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
            caregiverSupport: parentFacility,
          },
        });
      });
    });

    it('fails to retrieve parent facility', async () => {
      const { props, mockStore } = getData({});
      const { container, selectors } = subject({ props, mockStore });
      const facilities = mockFetchChildFacilityResponse;
      mapboxStub.resolves(mapBoxSuccessResponse);
      facilitiesStub.onFirstCall().resolves(facilities);

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

      const [selectedFacility] = facilities;

      selectors().radioList.__events.vaValueChange({
        detail: { value: selectedFacility.id },
      });

      await waitFor(() => {
        expect(dispatch.firstCall.args[0].type).to.eq('SET_DATA');
        expect(dispatch.firstCall.args[0].data).to.deep.include({
          'view:plannedClinic': {
            veteranSelected: selectedFacility,
            caregiverSupport: null,
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

    it('loads radio value from formData veteranSelected when set', async () => {
      const facilityId = 'my_facility_id';
      const { props, mockStore } = getData({
        data: {
          'view:plannedClinic': { veteranSelected: { id: facilityId } },
        },
      });
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

    context('clicking more facilities', () => {
      it('successfully loads more facilities', async () => {
        const { props, mockStore } = getData({});
        const { selectors, getByText, container } = subject({
          props,
          mockStore,
        });

        mapboxStub.resolves(mapBoxSuccessResponse);
        facilitiesStub.resolves(mockFetchFacilitiesResponse);

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
          expect(getByText(/Showing 1-4 of 4 facilities for/)).to.exist;
          expect(selectors().input).to.not.have.attr('error');
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

      it('handles error loading more facilities', async () => {
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

      it('renders error when trying to click goForward when no facilities are rendered', () => {
        const { props, mockStore } = getData({});
        const { selectors, getByText } = subject({ props, mockStore });
        userEvent.click(selectors().formNavButtons.forward);
        expect(goForward.calledOnce).to.be.false;
        expect(selectors().searchInputError.textContent).to.eq(
          `Error${content['validation-facilities--default-required']}`,
        );
        expect(selectors().searchInputError.parentElement).to.have.class(
          'caregiver-facilities-search-input-error',
        );
        expect(getByText('(*Required)')).to.exist;
      });
    });

    context('review mode', () => {
      beforeEach(() => {
        global.window.location = { search: '?review=true' };
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
