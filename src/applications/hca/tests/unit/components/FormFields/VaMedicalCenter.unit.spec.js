import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockApiRequest,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';

import VaMedicalCenter from '../../../../components/FormFields/VaMedicalCenter';

describe('hca <VaMedicalCenter>', () => {
  const mockData = [
    {
      id: 'vha_528A4',
      uniqueId: '528A4',
      name: 'ZBatavia VA Medical Center',
    },
    {
      id: 'vha_528A5',
      uniqueId: '528A5',
      name: 'Canandaigua VA Medical Center',
    },
  ];
  const getData = ({
    reviewMode = false,
    submitted = false,
    formData = {},
  }) => ({
    mockStore: {
      getState: () => ({
        form: {
          data: {
            'view:preferredFacility': formData,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
    props: {
      formContext: { reviewMode, submitted },
      idSchema: {
        'view:facilityState': { $id: 'preferredFacility_facilityState' },
        vaMedicalFacility: { $id: 'preferredFacility_vaMedicalFacility' },
      },
      onChange: sinon.spy(),
      formData,
      schema: {
        required: ['view:facilityState', 'vaMedicalFacility'],
      },
      errorSchema: {
        'view:facilityState': { __errors: 'state required' },
        vaMedicalFacility: { __errors: 'facility required' },
      },
    },
  });

  context('when the component renders on form page', () => {
    const { mockStore, props } = getData({});

    it('should render both `va-select` fields', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const stateSelector = container.querySelector(
        `#${props.idSchema['view:facilityState'].$id}`,
      );
      expect(stateSelector).to.exist;
      const facilitySelector = container.querySelector(
        `#${props.idSchema.vaMedicalFacility.$id}`,
      );
      expect(facilitySelector).to.exist;
    });

    it('should not render the containers from review mode', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const stateSelector = container.querySelector(
        '[data-testid="hca-facility-state"]',
      );
      expect(stateSelector).to.not.exist;
      const facilitySelector = container.querySelector(
        '[data-testid="hca-facility-name"]',
      );
      expect(facilitySelector).to.not.exist;
    });
  });

  context('when the component renders in review mode', () => {
    const { mockStore, props } = getData({
      formData: {
        'view:facilityState': 'NY',
        vaMedicalFacility: mockData[1].uniqueId,
      },
      reviewMode: true,
    });

    it('should render the correct state and facility name', async () => {
      mockApiRequest(mockData);
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );

      const stateSelector = container.querySelector(
        '[data-testid="hca-facility-state"]',
      );
      await waitFor(() => {
        expect(stateSelector).to.contain.text('New York');
      });

      const facilitySelector = container.querySelector(
        '[data-testid="hca-facility-name"]',
      );
      await waitFor(() => {
        expect(facilitySelector).to.contain.text(mockData[1].name);
      });
    });

    it('should not render the loading indicator', async () => {
      mockApiRequest(mockData);
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-loading-indicator');
      await waitFor(() => {
        expect(selector).to.not.exist;
      });
    });

    it('should not render the select input', async () => {
      mockApiRequest(mockData);
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-select');
      await waitFor(() => {
        expect(selector).to.not.exist;
      });
    });

    it('should not render the server error alert', async () => {
      mockApiRequest(mockData);
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-alert');
      await waitFor(() => {
        expect(selector).to.not.exist;
      });
    });
  });

  context('when the user selects a facility state', () => {
    it('should render the correct number of options, resorted in alphabetical order by name, if API call succeeds', async () => {
      mockApiRequest(mockData);
      const { mockStore, props } = getData({
        formData: { 'view:facilityState': 'NY' },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );

      await waitFor(() => {
        const options = container.querySelectorAll(
          `#${props.idSchema.vaMedicalFacility.$id} option`,
        );
        const alert = container.querySelector('va-alert');

        expect(options).to.have.lengthOf(mockData.length);
        expect(options[0]).to.have.attr('value', mockData[1].uniqueId);
        expect(options[1]).to.have.attr('value', mockData[0].uniqueId);
        expect(alert).to.not.exist;
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
        formData: { 'view:facilityState': 'NY' },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      await waitFor(() => {
        const vaSelectState = container.querySelector(
          `#${props.idSchema['view:facilityState'].$id}`,
        );
        const vaSelectFacility = container.querySelector(
          `#${props.idSchema.vaMedicalFacility.$id}`,
        );
        const alert = container.querySelector('va-alert');

        expect(vaSelectState).to.not.exist;
        expect(vaSelectFacility).to.not.exist;
        expect(alert).to.exist;
      });
    });
  });

  context('when the user selects a facility from the list', () => {
    it('should call the `onChange` spy', async () => {
      mockApiRequest(mockData);
      const { mockStore, props } = getData({
        formData: { 'view:facilityState': 'NY' },
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );

      await waitFor(() => {
        const selector = container.querySelector(
          `#${props.idSchema.vaMedicalFacility.$id}`,
        );

        selector.__events.vaSelect({
          target: {
            name: props.idSchema.vaMedicalFacility.$id,
            value: mockData[1].id,
          },
        });

        expect(props.onChange.called).to.be.true;
      });
    });
  });

  context(
    'when the form is submitted without a selected facility',
    async () => {
      it('should render an error message on the facility field', async () => {
        const { mockStore, props } = getData({
          formData: {},
          submitted: true,
        });
        const { container } = render(
          <Provider store={mockStore}>
            <VaMedicalCenter {...props} />
          </Provider>,
        );
        await waitFor(() => {
          const selector = container.querySelector(
            `#${props.idSchema.vaMedicalFacility.$id}`,
          );
          expect(selector).to.have.attr('error', 'Please provide a response');
        });
      });
    },
  );

  context('when submitted without a selected state or facility', async () => {
    it('should render error messages for both fields', async () => {
      const { mockStore, props } = getData({
        formData: {},
        submitted: true,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      await waitFor(() => {
        const vaSelectState = container.querySelector(
          `#${props.idSchema['view:facilityState'].$id}`,
        );
        const vaSelectFacility = container.querySelector(
          `#${props.idSchema.vaMedicalFacility.$id}`,
        );
        expect(vaSelectState).to.have.attr(
          'error',
          'Please provide a response',
        );
        expect(vaSelectFacility).to.have.attr(
          'error',
          'Please provide a response',
        );
      });
    });
  });

  context(
    'when the form is submitted with both state and facility selected',
    async () => {
      it('should not render error messages', async () => {
        mockApiRequest(mockData);
        const { mockStore, props } = getData({
          formData: {
            'view:facilityState': 'NY',
            vaMedicalFacility: mockData[0].uniqueId,
          },
          submitted: true,
        });
        const { container } = render(
          <Provider store={mockStore}>
            <VaMedicalCenter {...props} />
          </Provider>,
        );
        await waitFor(() => {
          const vaSelectState = container.querySelector(
            `#${props.idSchema['view:facilityState'].$id}`,
          );
          const vaSelectFacility = container.querySelector(
            `#${props.idSchema.vaMedicalFacility.$id}`,
          );
          const alert = container.querySelector('va-alert');

          expect(alert).to.not.exist;
          expect(vaSelectState).to.not.have.attr('error');
          expect(vaSelectFacility).to.not.have.attr('error');
        });
      });
    },
  );
});
