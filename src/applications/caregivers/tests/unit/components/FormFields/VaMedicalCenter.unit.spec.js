import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';

import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import * as focusUtils from 'platform/utilities/ui/focus';
import VaMedicalCenter from '../../../../components/FormFields/VaMedicalCenter';
import content from '../../../../locales/en/content.json';

describe('CG <VaMedicalCenter>', () => {
  const mockRes = {
    data: [
      {
        id: 'vha_528A4',
        uniqueId: '528A4',
        attributes: { name: 'Batavia VA Medical Center' },
      },
      {
        id: 'vha_528A5',
        uniqueId: '528A5',
        attributes: { name: 'Canandaigua VA Medical Center' },
      },
    ],
  };
  const getData = ({
    reviewMode = false,
    submitted = undefined,
    value = undefined,
    formData = {},
  }) => ({
    props: {
      formContext: { reviewMode, submitted },
      id: 'preferredFacility_vaMedicalFacility',
      onChange: sinon.spy(),
      required: true,
      value,
    },
    mockStore: {
      getState: () => ({
        form: {
          data: {
            veteranPreferredFacility: formData,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });
  const subject = ({ mockStore, props }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <VaMedicalCenter {...props} />
      </Provider>,
    );
    const selectors = () => ({
      alert: container.querySelector('va-alert'),
      loader: container.querySelector('va-loading-indicator'),
      name: container.querySelector('[data-testid="cg-facility-name"]'),
      options: container.querySelectorAll('option'),
      vaSelect: container.querySelector(`#${props.id}`),
    });
    return { container, selectors };
  };

  context('when the component renders on form page', () => {
    const { mockStore, props } = getData({});

    it('should render `va-select` component', () => {
      const { selectors } = subject({ mockStore, props });
      expect(selectors().vaSelect).to.exist;
    });

    it('should not render the facility name container', () => {
      const { selectors } = subject({ mockStore, props });
      expect(selectors().name).to.not.exist;
    });
  });

  context('when the component renders in review mode', () => {
    const { mockStore, props } = getData({
      formData: { veteranFacilityState: 'NY' },
      reviewMode: true,
      value: mockRes.data[1].uniqueId,
    });

    it('should render the correct facility name', async () => {
      mockApiRequest(mockRes);
      const { selectors } = subject({ mockStore, props });
      await waitFor(() => {
        const response = mockRes.data[1].attributes.name;
        expect(selectors().name).to.contain.text(response);
      });
    });

    it('should not render any of the select interaction components', async () => {
      const { selectors } = subject({ mockStore, props });
      await waitFor(() => {
        expect(selectors().vaSelect).to.not.exist;
        expect(selectors().loader).to.not.exist;
        expect(selectors().alert).to.not.exist;
      });
    });
  });

  context('when the user selects a facility state', () => {
    it('should render the correct number of options if API call succeeds', async () => {
      mockApiRequest(mockRes);
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
      });
      const { selectors } = subject({ mockStore, props });

      await waitFor(() => {
        expect(selectors().loader).to.exist;
      });

      await waitFor(() => {
        const { alert, options, loader } = selectors();
        expect(options).to.have.lengthOf(mockRes.data.length);
        expect(options[0]).to.have.attr('value', mockRes.data[0].uniqueId);
        expect(alert).to.not.exist;
        expect(loader).to.not.exist;
      });
    });

    it('should render the error alert if API call fails', async () => {
      mockApiRequest(mockRes, false);
      setFetchJSONResponse(
        global.fetch.onCall(0),
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({ status: 503, error: 'error' }),
      );
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
      });
      const { selectors } = subject({ mockStore, props });
      const focusSpy = sinon.spy(focusUtils, 'focusElement');
      const loggingSpy = sinon.spy(Sentry, 'withScope');

      await waitFor(() => {
        expect(selectors().vaSelect).to.not.exist;
        expect(selectors().alert).to.exist;
      });

      await waitFor(() => {
        expect(loggingSpy.called).to.be.true;
        loggingSpy.restore();
      });

      await waitFor(() => {
        expect(focusSpy.args[0][0]).to.eq('.caregivers-error-message');
        focusSpy.restore();
      });
    });
  });

  context('when the user selects a facility from the list', () => {
    it('should call the `onChange` spy', async () => {
      mockApiRequest(mockRes);
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
      });
      const { selectors } = subject({ mockStore, props });
      await waitFor(() => {
        selectors().vaSelect.__events.vaSelect({
          detail: { value: mockRes.data[1].id },
        });
        expect(props.onChange.called).to.be.true;
      });
    });
  });

  context('when no facility has been selected', () => {
    it('should render an error message when the form is submitted', async () => {
      mockApiRequest(mockRes);
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
        submitted: true,
      });
      const { selectors } = subject({ mockStore, props });
      await waitFor(() => {
        expect(selectors().vaSelect).to.have.attr('error');
      });
    });

    it('should render an error message on blur', async () => {
      mockApiRequest(mockRes);
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
      });
      const { selectors } = subject({ mockStore, props });
      await waitFor(() => {
        fireEvent.blur(selectors().vaSelect);
      });
      await waitFor(() => {
        expect(selectors().vaSelect).to.have.attr(
          'error',
          content['validation-default-required'],
        );
      });
    });
  });
});
