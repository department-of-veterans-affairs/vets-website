import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import VaPrescription from '../../../components/PrescriptionDetails/VaPrescription';
import rxDetailsResponse from '../../fixtures/prescriptionDetails.json';
import { dateFormat } from '../../../util/helpers';

describe('vaPrescription details container', () => {
  const prescription = rxDetailsResponse.data.attributes;
  const newRx = { ...prescription, phoneNumber: '1234567891' };
  const setup = (rx = newRx, ffEnabled = true) => {
    return renderWithStoreAndRouter(<VaPrescription {...rx} />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_display_documentation_content: ffEnabled,
        },
      },
      reducers: {},
      path: '/prescriptions/1234567891',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
  it('displays the formatted ordered date', () => {
    const screen = setup();
    const formattedDate = screen.getAllByText(
      dateFormat(rxDetailsResponse.data.attributes?.orderedDate),
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(formattedDate).to.exist;
  });

  it('displays the facility', () => {
    const screen = setup();
    const location = screen.getAllByText(
      rxDetailsResponse.data.attributes.facilityName,
    );
    expect(location).to.exist;
  });

  it('displays Shipped on in Refill History', () => {
    const screen = setup();
    const shippedOn = screen.getAllByText(
      dateFormat(
        rxDetailsResponse.data.attributes.trackingList[0].completeDateTime,
      ),
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(shippedOn).to.exist;
  });

  it('displays description correctly', async () => {
    const screen = setup();
    const shape = await screen.findByTestId('rx-shape');
    const color = await screen.findByTestId('rx-color');
    const frontMarking = await screen.findByTestId('rx-front-marking');
    const backMarking = await screen.findByTestId('rx-back-marking');
    expect(color).to.exist;
    expect(shape).to.exist;
    expect(frontMarking).to.exist;
    expect(backMarking).to.exist;
  });

  it('does not display description in Refill History when details are missing', () => {
    const mysteriousRefill = {
      refillStatus: 'suspended',
      refillSubmitDate: 'Tue, 10 Jan 2023 00:00:00 EDT',
      refillDate: 'Fri, 14 Jul 2023 00:00:00 EDT',
      refillRemaining: 12,
      facilityName: 'UNREAL',
      isRefillable: false,
      isTrackable: false,
      prescriptionId: 42,
      sig: null,
      orderedDate: 'Thu, 03 Aug 2023 00:00:00 EDT',
      quantity: null,
      expirationDate: null,
      prescriptionNumber: '2720542',
      prescriptionName: 'TESTATHING ORB',
      dispensedDate: 'Mon, 02 Jan 2023 05:00:00 EDT',
      stationNumber: '989',
      inCernerTransition: false,
      notRefillableDisplayMessage: null,
      cmopNdcNumber: null,
      id: 22332828,
      userId: 16955936,
      providerFirstName: null,
      providerLastName: null,
      remarks: null,
      divisionName: null,
      modifiedDate: null,
      institutionId: null,
      cmopDivisionPhone: '(101) 555-0110',
      dialCmopDivisionPhone: null,
      dispStatus: 'Suspended',
      ndc: null,
      reason: null,
      prescriptionNumberIndex: 'RF1',
      prescriptionSource: 'RF',
      disclaimer: null,
      indicationForUse: null,
      indicationForUseFlag: null,
      category: 'Rx Medication',
      trackingList: null,
      rxRfRecords: null,
      tracking: false,
      color: null,
      shape: 'orb',
      frontImprint: 'colorless',
      backImprint: null,
    };
    const screen = setup({
      ...newRx,
      rxRfRecords: [mysteriousRefill],
    });
    const description = screen.findByText(
      'No description available. Call your VA Pharmacy at (101) 555-0110 if you need help identifying this medication.',
    );
    expect(description).to.exist;
  });

  it('displays the tracking number within Tracking Info', () => {
    const screen = setup();

    const trackingNumber = screen.getByTestId('tracking-number');

    expect(trackingNumber).to.exist;
    expect(trackingNumber).to.have.text(
      rxDetailsResponse.data.attributes.trackingList[0].trackingNumber,
    );
  });
  it('displays none noted if no phone number is provided', () => {
    const screen = setup(prescription);
    const pharmacyPhone = screen.queryByTestId('phone-number');

    expect(pharmacyPhone).to.not.exist;
  });
  it('does not display documentation if cmopNdcNumber is missing', () => {
    const screen = setup(prescription);
    const docLink = screen.queryByTestId('va-prescription-documentation-link');

    expect(docLink).to.not.exist;
  });
  it('displays documentation if original fill cmopNdcNumber exists', () => {
    const screen = setup({ ...prescription, cmopNdcNumber: '123456' });
    const docLink = screen.queryByTestId('va-prescription-documentation-link');
    expect(docLink).to.exist;
  });
  it('displays documentation if rxRfRecords cmopNdcNumber exists', () => {
    const screen = setup({
      ...prescription,
      rxRfRecords: [
        { ...prescription.rxRfRecords[0], cmopNdcNumber: '123456' },
      ],
    });
    const docLink = screen.queryByTestId('va-prescription-documentation-link');
    expect(docLink).to.exist;
  });
  it('does not display documentation if ff is off', () => {
    const screen = setup({ ...prescription, cmopNdcNumber: '123456' }, false);
    const docLink = screen.queryByTestId('va-prescription-documentation-link');
    expect(docLink).to.not.exist;
  });
  it('displays "You haven’t filled this prescription yet" if there is no refill history', () => {
    const rxWithNoRefillHistory = {
      ...prescription,
      rxRfRecords: [],
      dispensedDate: undefined,
    };
    const screen = setup(rxWithNoRefillHistory);
    const haventFilledRxNotification = screen.getByText(
      'You haven’t filled this prescription yet.',
    );

    expect(haventFilledRxNotification).to.exist;
  });
});
