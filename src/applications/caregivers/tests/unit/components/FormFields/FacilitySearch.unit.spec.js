import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

import { inputVaTextInput } from 'platform/testing/unit/helpers';
import * as bboxFetch from '../../../../actions/fetchMapBoxGeocoding';
import * as facilitiesFetch from '../../../../actions/fetchFacilities';
import FacilitySearch from '../../../../components/FormFields/FacilitySearch';
import { mockFetchFacilitiesResponse } from '../../../mocks/responses';
import content from '../../../../locales/en/content.json';

describe('CG <FacilitySearch>', () => {
  const onChange = sinon.spy();
  const getData = ({
    reviewMode = false,
    submitted = false,
    formData = {},
  }) => ({
    props: {
      formContext: { reviewMode, submitted },
      onChange,
      formData,
    },
  });
  const subject = ({ props }) => {
    const { container } = render(<FacilitySearch {...props} />);
    const selectors = () => ({
      button: container.querySelector('va-button'),
      input: container.querySelector('va-text-input'),
      loader: container.querySelector('va-loading-indicator'),
      radioList: container.querySelector('va-radio'),
    });
    return { container, selectors };
  };

  context('when the component renders on the form page', () => {
    it('should render `va-text-input`', () => {
      const { selectors } = subject({ props: {} });
      expect(selectors().input).to.exist;
    });
  });

  context('when search is attempted with no data', () => {
    it('should render error message ', async () => {
      const { selectors } = subject({ props: {} });
      await waitFor(() => {
        const message = content['validation-facilities--default-required'];
        userEvent.click(selectors().button);
        expect(selectors().input).to.have.attr('error', message);
      });
    });
  });

  context('when search is attempted with valid data', () => {
    const successResponse = { center: [1, 2] };
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
      const { props } = getData({});
      const { container, selectors } = subject({ props });
      mapboxStub.resolves(successResponse);
      facilitiesStub.resolves(mockFetchFacilitiesResponse);

      await waitFor(() => {
        inputVaTextInput(container, 'Tampa', selectors().input);
        userEvent.click(selectors().button);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.exist;
        expect(selectors().loader).to.not.exist;
        expect(selectors().input).to.not.have.attr('error');
      });
    });

    it('calls onChange callback with facility object', async () => {
      const { props } = getData({});
      const { container, selectors } = subject({ props });
      const facilities = mockFetchFacilitiesResponse;
      mapboxStub.resolves(successResponse);
      facilitiesStub.resolves(facilities);

      await waitFor(() => {
        inputVaTextInput(container, 'Tampa', selectors().input);
        userEvent.click(selectors().button);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.exist;
        expect(selectors().loader).to.not.exist;
      });

      const selectedFacility = facilities[0];

      selectors().radioList.__events.vaValueChange({
        detail: { value: selectedFacility.id },
      });
      expect(onChange.calledWith({ veteranSelected: selectedFacility })).to.be
        .true;
    });

    it('loads radio value from formData veteranSelected when set', async () => {
      const facilityId = 'my_facility_id';
      const { props } = getData({
        formData: { veteranSelected: { id: facilityId } },
      });
      const { container, selectors } = subject({ props });
      const facilities = mockFetchFacilitiesResponse;
      mapboxStub.resolves(successResponse);
      facilitiesStub.resolves(facilities);

      await waitFor(() => {
        inputVaTextInput(container, 'Tampa', selectors().input);
        userEvent.click(selectors().button);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.exist;
        expect(selectors().loader).to.not.exist;
        expect(selectors().radioList.value).to.equal(facilityId);
      });
    });

    context('handles errors', () => {
      context('mapbox errors', () => {
        it('should render SEARCH_FAILED when mapbox fetch fails', async () => {
          const mapboxErrorResponse = {
            errorMessage: 'Some bad error occurred.',
            type: 'SEARCH_FAILED',
          };
          const { props } = getData({});
          const { container, selectors } = subject({ props });
          mapboxStub.resolves(mapboxErrorResponse);

          await waitFor(() => {
            inputVaTextInput(container, 'Tampa', selectors().input);
            userEvent.click(selectors().button);
            expect(selectors().loader).to.exist;
          });

          await waitFor(() => {
            expect(selectors().radioList).to.not.exist;
            expect(selectors().loader).to.not.exist;
            expect(selectors().input).to.have.attr(
              'error',
              mapboxErrorResponse.errorMessage,
            );
          });
        });

        it('should render NO_SEARCH_RESULTS when mapbox fetch returns nothing', async () => {
          const mapboxErrorResponse = {
            errorMessage: 'No search results found.',
            type: 'NO_SEARCH_RESULTS',
          };
          const { props } = getData({});
          const { container, selectors } = subject({ props });
          mapboxStub.resolves(mapboxErrorResponse);

          await waitFor(() => {
            inputVaTextInput(container, 'Tampa', selectors().input);
            userEvent.click(selectors().button);
            expect(selectors().loader).to.exist;
          });

          await waitFor(() => {
            expect(selectors().radioList).to.not.exist;
            expect(selectors().loader).to.not.exist;
            expect(selectors().input).to.have.attr(
              'error',
              mapboxErrorResponse.errorMessage,
            );
          });
        });
      });

      context('facilities errors', () => {
        it('should render appropriate error message when facilities fetch fails', async () => {
          const { props } = getData({});
          const { container, selectors } = subject({ props });
          mapboxStub.resolves(successResponse);
          facilitiesStub.resolves({
            type: 'SEARCH_FAILED',
            errorMessage: 'Some bad error occurred.',
          });

          await waitFor(() => {
            inputVaTextInput(container, 'Tampa', selectors().input);
            userEvent.click(selectors().button);
            expect(selectors().loader).to.exist;
          });

          await waitFor(() => {
            expect(selectors().radioList).to.not.exist;
            expect(selectors().loader).to.not.exist;
            expect(selectors().input).to.have.attr(
              'error',
              'Some bad error occurred.',
            );
          });
        });
      });
    });
  });
});
