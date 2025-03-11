import React from 'react';
import * as api from 'platform/utilities/api';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as Sentry from '@sentry/browser';
import { expect } from 'chai';
import sinon from 'sinon';
import VaMedicalCenter from '../../../../components/FormFields/VaMedicalCenter';

const REQ_DATA = [
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

describe('hca <VaMedicalCenter>', () => {
  let apiRequestStub;

  const subject = ({
    onChange = () => {},
    reviewMode = false,
    submitted = false,
    formData = {},
  } = {}) => {
    const mockStore = {
      getState: () => ({
        form: {
          data: {
            'view:preferredFacility': formData,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const props = {
      formContext: { reviewMode, submitted },
      idSchema: {
        'view:facilityState': { $id: 'preferredFacility_facilityState' },
        vaMedicalFacility: { $id: 'preferredFacility_vaMedicalFacility' },
      },
      onChange,
      formData,
      schema: {
        required: ['view:facilityState', 'vaMedicalFacility'],
      },
      errorSchema: {
        'view:facilityState': { __errors: 'state required' },
        vaMedicalFacility: { __errors: 'facility required' },
      },
    };
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

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
  });

  afterEach(() => {
    apiRequestStub.restore();
  });

  it('should render appropriate components when not in review mode', () => {
    const { selectors } = subject();
    const components = selectors();
    expect(components.stateField).to.exist;
    expect(components.facilityField).to.exist;
    expect(components.stateReviewField).to.not.exist;
    expect(components.facilityReviewField).to.not.exist;
  });

  it('should render appropriate components when in review mode', async () => {
    apiRequestStub.resolves(REQ_DATA);

    const { selectors } = subject({
      formData: {
        'view:facilityState': 'NY',
        vaMedicalFacility: REQ_DATA[1].uniqueId,
      },
      reviewMode: true,
    });

    await waitFor(() => {
      const components = selectors();
      expect(components.vaAlert).to.not.exist;
      expect(components.vaLoadingIndicator).to.not.exist;
      expect(components.vaSelect).to.have.lengthOf(0);
      expect(components.stateReviewField).to.contain.text('New York');
      expect(components.facilityReviewField).to.contain.text(REQ_DATA[1].name);
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
    });
  });

  it('should correctly handle errors when the form is submitted without a selected state or facility', async () => {
    const { selectors } = subject({ submitted: true });

    await waitFor(() => {
      const { stateField, facilityField } = selectors();
      expect(stateField).to.have.attr('error');
      expect(facilityField).to.have.attr('error');
    });
  });

  it('should correctly handle errors when the API call fails and then succeeds', async () => {
    const errorResponse = { status: 503, error: 'error' };
    apiRequestStub.onFirstCall().rejects(errorResponse);
    apiRequestStub.onSecondCall().resolves(REQ_DATA);

    const spy = sinon.spy(Sentry, 'withScope');
    const { selectors } = subject({
      formData: { 'view:facilityState': 'NY' },
    });

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
      const {
        stateField,
        facilityField,
        vaAlert,
        vaLoadingIndicator,
      } = selectors();
      expect(vaLoadingIndicator).to.not.exist;
      expect(stateField).to.exist;
      expect(facilityField).to.exist;
      expect(vaAlert).to.not.exist;
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(2);
    });
  });

  it('should render an alphabetized option list when the API call succeeds', async () => {
    apiRequestStub.resolves(REQ_DATA);

    const { selectors } = subject({
      formData: { 'view:facilityState': 'NY' },
    });

    await waitFor(() => {
      const { facilityOptions, vaAlert } = selectors();
      expect(vaAlert).to.not.exist;
      expect(facilityOptions).to.have.lengthOf(REQ_DATA.length);
      expect(facilityOptions[0]).to.have.attr('value', REQ_DATA[1].uniqueId);
      expect(facilityOptions[1]).to.have.attr('value', REQ_DATA[0].uniqueId);
    });

    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
    });
  });

  it('should fire the `onChange` spy when a facility is selected', async () => {
    apiRequestStub.resolves(REQ_DATA);

    const onChangeSpy = sinon.spy();
    const { selectors } = subject({
      formData: { 'view:facilityState': 'NY' },
      onChange: onChangeSpy,
    });

    await waitFor(() => {
      selectors().facilityField.__events.vaSelect({
        target: {
          name: 'preferredFacility_vaMedicalFacility',
          value: REQ_DATA[1].id,
        },
      });
      expect(onChangeSpy.called).to.be.true;
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

  it('should correctly handle form submission with both state and facility selected', async () => {
    apiRequestStub.resolves(REQ_DATA);

    const { selectors } = subject({
      formData: {
        'view:facilityState': 'NY',
        vaMedicalFacility: REQ_DATA[0].uniqueId,
      },
      submitted: true,
    });

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
