import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import VaMedicalCenter from '../../../components/FormFields/VaMedicalCenter';

describe('CG <VaMedicalCenter>', () => {
  const mockData = [
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
  ];
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

  context('when the component renders on form page', () => {
    const { mockStore, props } = getData({});

    it('should render `va-select` component', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selectors = {
        input: container.querySelector(`#${props.id}`),
      };
      expect(selectors.input).to.exist;
    });

    it('should not render the facility name container', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="cg-facility-name"]',
      );
      expect(selector).to.not.exist;
    });
  });

  context('when the component renders in review mode', () => {
    const { mockStore, props } = getData({
      formData: { veteranFacilityState: 'NY' },
      reviewMode: true,
      value: mockData[1].uniqueId,
    });

    it('should render the correct facility name', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="cg-facility-name"]',
      );
      waitFor(() => {
        expect(selector).to.contain.text(mockData[1].attributes.name);
      });
    });

    it('should not render the loading indicator', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-loading-indicator');
      waitFor(() => {
        expect(selector).to.not.exist;
      });
    });

    it('should not render the select input', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector(`#${props.id}`);
      waitFor(() => {
        expect(selector).to.not.exist;
      });
    });

    it('should not render the server error alert', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-alert');
      waitFor(() => {
        expect(selector).to.not.exist;
      });
    });
  });

  context('when the user selects a facility state', () => {
    it('should render the correct number of options if API call succeeds', async () => {
      mockApiRequest(mockData);
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selectors = {
        options: container.querySelectorAll('option'),
        alert: container.querySelector('va-alert'),
      };
      waitFor(() => {
        expect(selectors.options).to.have.lengthOf(mockData.length + 1);
        expect(selectors.options[1]).to.have.attr(
          'value',
          mockData[0].uniqueId,
        );
        expect(selectors.alert).to.not.exist;
      });
    });

    it('should render the error alert if API call fails', async () => {
      mockApiRequest(mockData, false);
      setFetchJSONResponse(
        global.fetch.onCall(0),
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject({ status: 503, error: 'error' }),
      );
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selectors = {
        vaSelect: container.querySelector(`#${props.id}`),
        alert: container.querySelector('va-alert'),
      };
      waitFor(() => {
        expect(selectors.vaSelect).to.not.exist;
        expect(selectors.alert).to.exist;
      });
    });
  });

  context('when the user selects a facility from the list', () => {
    it('should call the `onChange` spy', async () => {
      mockApiRequest(mockData);
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector(`#${props.id}`);

      waitFor(() => {
        selector.__events.vaSelect({
          detail: { value: mockData[1].id },
        });

        expect(props.onChange.called).to.be.true;
      });
    });
  });

  context('when the form is submitted without facility selected', async () => {
    it('should render an error message', () => {
      const { mockStore, props } = getData({
        formData: { veteranFacilityState: 'NY' },
        submitted: true,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector(`#${props.id}`);
      waitFor(() => {
        expect(selector).to.have.attr('error', 'Please provide a response');
      });
    });
  });
});
