import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import * as prescriptionsApiModule from '../../api/prescriptionsApi';
import {
  stubAllergiesApi,
  stubPrescriptionsApiCache,
  stubPrescriptionIdApi,
  stubUsePrefetch,
} from '../testing-utils';
import singlePrescription from '../fixtures/prescriptionsListItem.json';
import { allergiesApi } from '../../api/allergiesApi';
import { prescriptionsApi } from '../../api/prescriptionsApi';
import reducer from '../../reducers';
import PrescriptionDetails from '../../containers/PrescriptionDetails';
import rxDetailsResponse from '../fixtures/prescriptionDetails.json';
import nonVaRxResponse from '../fixtures/nonVaPrescription.json';
import { dateFormat } from '../../util/helpers';

let sandbox;

describe('Prescription details container', () => {
  const setup = (state = {}) => {
    return renderWithStoreAndRouterV6(
      <Routes>
        <Route
          path="/prescriptions/:prescriptionId"
          element={<PrescriptionDetails />}
        />
      </Routes>,
      {
        initialState: state,
        reducers: reducer,
        initialEntries: ['/prescriptions/1234567891'],
        additionalMiddlewares: [
          allergiesApi.middleware,
          prescriptionsApi.middleware,
        ],
      },
    );
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox });
    stubPrescriptionIdApi({ sandbox });
    stubUsePrefetch({ sandbox });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without errors', async () => {
    const screen = setup({
      user: {
        profile: {
          userFullName: { first: 'test', last: 'last', suffix: 'jr' },
          dob: 'January, 01, 2000',
        },
      },
    });
    await waitFor(() => {
      expect(screen);
      expect(screen.getByTestId('prescription-name')).to.exist.and.to.have.text(
        singlePrescription.prescriptionName,
      );
    });
  });

  it('should display loading message when loading specific rx', async () => {
    const screen = setup();
    waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).to.exist;
      expect(screen.getByText('Loading your medication record...')).to.exist;
    });
  });

  it('should show the allergy error alert when downloading txt', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsApiCache({ sandbox, data: false });
    stubPrescriptionIdApi({ sandbox });
    const screen = setup();
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('download-txt-button'));
    });
    expect(screen);
    await waitFor(() => {
      expect(screen.getByText('We can’t download your records right now')).to
        .exist;
    });
  });

  it('should show the allergy error alert when printing', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox, error: true });
    stubPrescriptionsApiCache({ sandbox, data: false });
    stubPrescriptionIdApi({ sandbox });
    const screen = setup();
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('download-print-button'));
    });
    expect(screen);
    await waitFor(() => {
      expect(screen.getByText('We can’t print your records right now')).to
        .exist;
    });
  });

  it('displays the prescription name and filled by date', async () => {
    const screen = setup();
    const rxName = screen.findByText(
      rxDetailsResponse.data.attributes.prescriptionName,
    );
    waitFor(() => {
      expect(screen.getByTestId('rx-last-filled-date')).to.have.text(
        `Last filled on ${dateFormat(
          rxDetailsResponse.data.attributes.dispensedDate,
          'MMMM D, YYYY',
        )}`,
      );
      expect(rxName).to.exist;
    });
  });

  it('still shows medication details if rx data is received from query cache instead of api call', () => {
    const prescriptionApiStub = sandbox.stub(
      prescriptionsApiModule,
      'useGetPrescriptionByIdQuery',
    );
    const screen = setup();

    const rxName = screen.findByText(
      nonVaRxResponse.data.attributes.orderableItem,
    );
    expect(rxName).to.exist;
    expect(prescriptionApiStub.notCalled).to.be.true;
  });

  it('displays "Not filled yet" when there is no dispense date', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox, data: false });
    const data = JSON.parse(JSON.stringify(singlePrescription));
    data.dispensedDate = null;
    data.sortedDispensedDate = null;
    stubPrescriptionIdApi({ sandbox, data });
    const screen = setup();
    await waitFor(() => {
      expect(screen.getByTestId('rx-last-filled-date')).to.have.text(
        'Not filled yet',
      );
    });
  });

  it('displays "Documented on" instead of "filled by" date, when med is non VA', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox, data: false });
    stubPrescriptionIdApi({ sandbox, data: nonVaRxResponse.data.attributes });
    const screen = setup();
    await waitFor(() => {
      expect(screen.getByTestId('rx-last-filled-date')).to.have.text(
        `Documented on ${dateFormat(
          nonVaRxResponse.data.attributes.orderedDate,
          'MMMM D, YYYY',
        )}`,
      );
    });
  });

  it('name should use orderableItem for non va prescription if no prescriptionName is available', () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox, data: false });
    stubPrescriptionIdApi({ sandbox, data: nonVaRxResponse.data.attributes });
    const screen = setup();
    const rxName = screen.findByText(
      nonVaRxResponse.data.attributes.orderableItem,
    );

    expect(rxName).to.exist;
  });

  it('name should use prescriptionName for non va prescription if available', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox, data: false });
    const data = JSON.parse(JSON.stringify(nonVaRxResponse.data.attributes));
    const testPrescriptionName = 'Test Name for Non-VA prescription';
    data.prescriptionName = testPrescriptionName;
    stubPrescriptionIdApi({ sandbox, data });

    const screen = setup();
    await waitFor(() => {
      const rxName = screen.findByText(testPrescriptionName);
      expect(rxName).to.exist;
    });
  });

  it('Shows error message for apiError', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox, data: false });
    stubPrescriptionIdApi({ sandbox, error: true });
    const screen = setup();
    await waitFor(() => {
      const errorMessageH2 = screen.getByTestId('no-medications-list');
      expect(errorMessageH2).to.exist;
      expect(errorMessageH2).to.have.text(
        'We can’t access your medications right now',
      );
    });
  });

  it('should display alert if prescription has a prescriptionSource of PD', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox });
    const data = JSON.parse(JSON.stringify(singlePrescription));
    data.prescriptionSource = 'PD';
    stubPrescriptionIdApi({ sandbox, data });
    const screen = setup();
    await waitFor(() => {
      expect(screen.getByTestId('pending-med-alert')).to.exist;
    });
  });

  it('should prefetch the prescription documentation when there is an NDC number', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox, data: null, error: true });
    const data = JSON.parse(JSON.stringify(singlePrescription));
    data.rxRfRecords = [{ cmopNdcNumber: '00093314705' }];
    stubPrescriptionIdApi({ sandbox, data });
    const prefetchStub = stubUsePrefetch({ sandbox });
    const screen = setup();
    await waitFor(() => {
      expect(screen.getByTestId('prescription-name')).to.exist.and.to.have.text(
        singlePrescription.prescriptionName,
      );
      expect(prefetchStub.called).to.be.true;
    });
  });

  it('should not prefetch the prescription documentation when there is not an NDC number', async () => {
    sandbox.restore();
    stubAllergiesApi({ sandbox });
    stubPrescriptionsApiCache({ sandbox, data: null, error: true });
    const data = JSON.parse(JSON.stringify(singlePrescription));
    data.rxRfRecords = [{ cmopNdcNumber: null }];
    stubPrescriptionIdApi({ sandbox, data });
    const prefetchStub = stubUsePrefetch({ sandbox });
    const screen = setup();
    await waitFor(() => {
      expect(screen.getByTestId('prescription-name')).to.exist.and.to.have.text(
        singlePrescription.prescriptionName,
      );
      expect(prefetchStub.called).to.be.false;
    });
  });
});
