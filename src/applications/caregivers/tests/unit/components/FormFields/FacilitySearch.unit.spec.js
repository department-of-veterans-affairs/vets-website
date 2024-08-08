import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { inputVaTextInput } from 'platform/testing/unit/helpers';
import * as bboxFetch from '../../../../actions/fetchMapBoxBBoxCoordinates';
import * as facilitiesFetch from '../../../../actions/fetchFacilities';
import FacilitySearch from '../../../../components/FormFields/FacilitySearch';
import { mockLightHouseFacilitiesResponseWithTransformedAddresses } from '../../../mocks/responses';
import content from '../../../../locales/en/content.json';

describe('CG <FacilitySearch>', () => {
  const getData = ({ reviewMode = false, submitted = false, value = '' }) => ({
    props: {
      formContext: { reviewMode, submitted },
      onChange: sinon.spy(),
      value,
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
        fireEvent.click(selectors().button);
        expect(selectors().input).to.have.attr('error', message);
      });
    });
  });

  context('when search is attempted with valid data', () => {
    const coordinates = [-82.452606, 27.964157, -80.452606, 29.964157];
    let coordinatesStub;
    let facilitiesStub;

    beforeEach(() => {
      coordinatesStub = sinon.stub(bboxFetch, 'fetchMapBoxBBoxCoordinates');
      facilitiesStub = sinon.stub(facilitiesFetch, 'fetchFacilities');
    });

    afterEach(() => {
      coordinatesStub.restore();
      facilitiesStub.restore();
    });

    it('should fetch list of facilities to select on success', async () => {
      const { props } = getData({});
      const { container, selectors } = subject({ props });
      coordinatesStub.resolves(coordinates);
      facilitiesStub.resolves(
        mockLightHouseFacilitiesResponseWithTransformedAddresses.data,
      );

      await waitFor(() => {
        inputVaTextInput(container, 'Tampa', selectors().input);
        fireEvent.click(selectors().button);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.exist;
        expect(selectors().loader).to.not.exist;
        expect(selectors().input).to.not.have.attr('error');
      });
    });

    it('should render appropriate error message when bbox coordinate fetch fails', async () => {
      const { props } = getData({});
      const { container, selectors } = subject({ props });
      coordinatesStub.rejects({ errorMessage: 'Some bad error occurred.' });

      await waitFor(() => {
        inputVaTextInput(container, 'Tampa', selectors().input);
        fireEvent.click(selectors().button);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.not.exist;
        expect(selectors().loader).to.not.exist;
        expect(selectors().input).to.have.attr('error');
      });
    });

    it('should render appropriate error message when facilities fetch fails', async () => {
      const { props } = getData({});
      const { container, selectors } = subject({ props });
      coordinatesStub.resolves(coordinates);
      facilitiesStub.rejects({ errorMessage: 'Some bad error occurred.' });

      await waitFor(() => {
        inputVaTextInput(container, 'Tampa', selectors().input);
        fireEvent.click(selectors().button);
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        expect(selectors().radioList).to.not.exist;
        expect(selectors().loader).to.not.exist;
        expect(selectors().input).to.have.attr('error');
      });
    });
  });
});
