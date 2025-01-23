import React from 'react';
import * as api from 'platform/utilities/api';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as Sentry from '@sentry/browser';
import { expect } from 'chai';
import sinon from 'sinon';
import VaMedicalCenter from '../../../../components/FormFields/VaMedicalCenter';

describe('hca <VaMedicalCenter>', () => {
  const mockData = [
    {
      id: 'vha_528A5',
      uniqueId: '528A5',
      name: 'Canandaigua VA Medical Center',
    },
    {
      id: 'vha_528A4',
      uniqueId: '528A4',
      name: 'Batavia VA Medical Center',
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

  const subject = ({ mockStore, props }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <VaMedicalCenter {...props} />
      </Provider>,
    );
    const selectors = () => ({
      stateField: container.querySelector(
        `#${props.idSchema['view:facilityState'].$id}`,
      ),
      facilityField: container.querySelector(
        `#${props.idSchema.vaMedicalFacility.$id}`,
      ),
      facilityOptions: container.querySelectorAll(
        `#${props.idSchema.vaMedicalFacility.$id} option`,
      ),
      stateReviewField: container.querySelector(
        '[data-testid="hca-facility-state"]',
      ),
      facilityReviewField: container.querySelector(
        '[data-testid="hca-facility-name"]',
      ),
      vaAlert: container.querySelector('va-alert'),
      vaSelect: container.querySelectorAll('va-select'),
      vaLoadingIndicator: container.querySelector('va-loading-indicator'),
    });
    return { container, selectors };
  };

  let apiRequestStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
  });

  afterEach(() => {
    apiRequestStub.restore();
  });

  it('should render appropriate components when not in review mode', () => {
    const { mockStore, props } = getData({});
    const { selectors } = subject({ mockStore, props });
    const components = selectors();
    expect(components.stateField).to.exist;
    expect(components.facilityField).to.exist;
    expect(components.stateReviewField).to.not.exist;
    expect(components.facilityReviewField).to.not.exist;
  });

  it('should render appropriate components when in review mode', async () => {
    apiRequestStub.resolves(mockData);

    const { mockStore, props } = getData({
      formData: {
        'view:facilityState': 'NY',
        vaMedicalFacility: mockData[1].uniqueId,
      },
      reviewMode: true,
    });
    const { selectors } = subject({ mockStore, props });

    await waitFor(() => {
      const components = selectors();
      expect(components.vaAlert).to.not.exist;
      expect(components.vaLoadingIndicator).to.not.exist;
      expect(components.vaSelect).to.have.lengthOf(0);
      expect(components.stateReviewField).to.contain.text('New York');
      expect(components.facilityReviewField).to.contain.text(mockData[1].name);
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
    });
  });

  it('should correctly handle errors when the facility API call fails and then succeeds', async () => {
    const errorResponse = { status: 503, error: 'error' };

    apiRequestStub.onFirstCall().rejects(errorResponse);
    apiRequestStub.onSecondCall().resolves(mockData);

    const { mockStore, props } = getData({
      formData: { 'view:facilityState': 'NY' },
    });
    const spy = sinon.spy(Sentry, 'withScope');
    const { selectors } = subject({ mockStore, props });

    await waitFor(() => {
      const { stateField, facilityField, vaAlert } = selectors();
      expect(stateField).to.exist;
      expect(facilityField).to.exist;
      expect(vaAlert).to.exist;
    });

    await waitFor(() => {
      expect(spy.called).to.be.true;
      spy.restore();
    });

    await waitFor(() => {
      selectors().stateField.__events.vaSelect({
        target: {
          value: 'OH',
          name: 'root_view:preferredFacility_view:facilityState',
        },
      });
    });

    await waitFor(() => {
      const { stateField, facilityField, vaAlert } = selectors();
      expect(selectors().vaLoadingIndicator).to.not.exist;
      expect(stateField).to.exist;
      expect(facilityField).to.exist;
      expect(vaAlert).to.not.exist;
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(2);
    });
  });

  it('should render an alphabetized option list when facility API call succeeds', async () => {
    apiRequestStub.resolves(mockData);
    const { mockStore, props } = getData({
      formData: { 'view:facilityState': 'NY' },
    });
    const { selectors } = subject({ mockStore, props });

    await waitFor(() => {
      const { facilityOptions, vaAlert } = selectors();
      expect(vaAlert).to.not.exist;
      expect(facilityOptions).to.have.lengthOf(mockData.length);
      expect(facilityOptions[0]).to.have.attr('value', mockData[1].uniqueId);
      expect(facilityOptions[1]).to.have.attr('value', mockData[0].uniqueId);
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
    });
  });

  it('should fire the `onChange` spy when the user selects a facility from the list', async () => {
    apiRequestStub.resolves(mockData);
    const { mockStore, props } = getData({
      formData: { 'view:facilityState': 'NY' },
    });
    const { selectors } = subject({ mockStore, props });

    await waitFor(() => {
      const { facilityField } = selectors();
      facilityField.__events.vaSelect({
        target: {
          name: props.idSchema.vaMedicalFacility.$id,
          value: mockData[1].id,
        },
      });
      expect(props.onChange.called).to.be.true;
    });

    await waitFor(() => {
      const { facilityField } = selectors();
      fireEvent.blur(facilityField);
      expect(facilityField).to.not.have.attr('error');
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
    });
  });

  it('should correctly handle errors when the form is submitted without a selected facility', async () => {
    const { mockStore, props } = getData({
      formData: {},
      submitted: true,
    });
    const { selectors } = subject({ mockStore, props });

    await waitFor(() => {
      const { facilityField } = selectors();
      expect(facilityField).to.have.attr('error');
    });
  });

  it('should correctly handle errors when the form is submitted without a selected state or facility', async () => {
    const { mockStore, props } = getData({
      formData: {},
      submitted: true,
    });
    const { selectors } = subject({ mockStore, props });

    await waitFor(() => {
      const { stateField, facilityField } = selectors();
      expect(stateField).to.have.attr('error');
      expect(facilityField).to.have.attr('error');
    });
  });

  it('should correctly behave when the form is submitted with both state and facility selected', async () => {
    apiRequestStub.resolves(mockData);
    const { mockStore, props } = getData({
      formData: {
        'view:facilityState': 'NY',
        vaMedicalFacility: mockData[0].uniqueId,
      },
      submitted: true,
    });
    const { selectors } = subject({ mockStore, props });

    await waitFor(() => {
      const { stateField, facilityField, vaAlert } = selectors();
      expect(vaAlert).to.not.exist;
      expect(stateField).to.not.have.attr('error');
      expect(facilityField).to.not.have.attr('error');
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
    });
  });
});
