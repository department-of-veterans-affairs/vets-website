import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import VaPrescription from '../../../components/PrescriptionDetails/VaPrescription';
import rxDetailsResponse from '../../fixtures/prescriptionDetails.json';
import { dateFormat } from '../../../util/helpers';
import * as rxApiExports from '../../../api/rxApi';
import { RX_SOURCE } from '../../../util/constants';

describe('vaPrescription details container', () => {
  const prescription = rxDetailsResponse.data.attributes;
  const newRx = { ...prescription, phoneNumber: '1234567891' };
  const setup = (
    rx = newRx,
    ffEnabled = true,
    { isCernerPilot = false } = {},
  ) => {
    return renderWithStoreAndRouterV6(<VaPrescription {...rx} />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_medications_display_documentation_content: ffEnabled,
          // eslint-disable-next-line camelcase
          mhv_medications_cerner_pilot: isCernerPilot,
        },
      },
      reducers: {},
      initialEntries: ['/prescriptions/1234567891'],
    });
  };

  let sandbox;
  let landMedicationDetailsAalStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    landMedicationDetailsAalStub = sandbox.stub(
      rxApiExports,
      'landMedicationDetailsAal',
    );
  });

  afterEach(() => {
    sandbox.restore();
  });

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

  it('displays link "Learn more about this medication" if ff is on and rx has an ndc number', () => {
    const rxWithCmop = {
      ...prescription,
      rxRfRecords: [{ cmopNdcNumber: '12345' }],
    };
    const screen = setup(rxWithCmop, true);
    const learnMoreLink = screen.getAllByText(
      'Learn more about this medication',
    );
    expect(learnMoreLink).to.exist;
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
      prescriptionSource: RX_SOURCE.REFILL,
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

  it('does not display refill history if there is one record with dispensedDate undefined', () => {
    const rxWithNoRefillHistory = {
      ...prescription,
      dispensedDate: undefined,
      rxRfRecords: [
        { ...prescription.rxRfRecords[0], dispensedDate: undefined },
      ],
    };
    const screen = setup(rxWithNoRefillHistory);
    const refillSubHeader = screen.queryByText('Refill history');

    expect(refillSubHeader).to.not.exist;
  });

  it('displays refill history if there is one record with dispensedDate not undefined', () => {
    const rxWithNoRefillHistory = {
      ...prescription,
      dispensedDate: undefined,
      rxRfRecords: [{ ...prescription.rxRfRecords[0] }],
    };
    const screen = setup(rxWithNoRefillHistory);
    const refillSubHeader = screen.queryByText('Refill history');

    expect(refillSubHeader).to.exist;
  });

  it('does not display refill history if there is no records', () => {
    const rxWithNoRefillHistory = {
      ...prescription,
      dispensedDate: undefined,
      rxRfRecords: [],
    };
    const screen = setup(rxWithNoRefillHistory);
    const refillSubHeader = screen.queryByText('Refill history');

    expect(refillSubHeader).to.not.exist;
  });

  it('displays refill history if there are 2 records', () => {
    const rxWithNoRefillHistory = {
      ...prescription,
      dispensedDate: undefined,
      rxRfRecords: [
        { ...prescription.rxRfRecords[0], ...prescription.rxRfRecords[0] },
      ],
    };
    const screen = setup(rxWithNoRefillHistory);
    const refillSubHeader = screen.queryByText('Refill history');

    expect(refillSubHeader).to.exist;
  });

  it('displays pending med content if prescription source is PD and dispStatus is NewOrder', () => {
    const screen = setup({
      ...prescription,
      prescriptionSource: RX_SOURCE.PENDING_DISPENSE,
      dispStatus: 'NewOrder',
    });
    const status = screen.getByText(
      'This is a new prescription from your provider. Your VA pharmacy is reviewing it now. Details may change.',
    );
    const aboutSubHeader = screen.getByText('About this prescription');
    const refillH3 = screen.queryByText(
      'Request refills by this prescription expiration date',
    );
    const refillSubHeader = screen.queryByText('Refill history');

    expect(status).to.exist;
    expect(aboutSubHeader).to.exist;
    expect(refillH3).to.not.exist;
    expect(refillSubHeader).to.not.exist;
  });

  it('displays pending renewal med content if prescription source is PD and dispStatus is Renew', () => {
    const screen = setup({
      ...prescription,
      prescriptionSource: RX_SOURCE.PENDING_DISPENSE,
      dispStatus: 'Renew',
    });
    const status = screen.getByText(
      'This is a renewal you requested. Your VA pharmacy is reviewing it now. Details may change.',
    );

    expect(status).to.exist;
  });

  it('displays partial refill content if prescription source is pf and partial flag is on', () => {
    const setupWithPartialFill = (rx = newRx, ffEnabled = true) => {
      return renderWithStoreAndRouterV6(<VaPrescription {...rx} />, {
        initialState: {
          featureToggles: {
            // eslint-disable-next-line camelcase
            mhv_medications_display_documentation_content: ffEnabled,
            // eslint-disable-next-line camelcase
            mhv_medications_partial_fill_content: true,
          },
        },
        reducers: {},
        initialEntries: ['/prescriptions/1234567891'],
      });
    };
    const screen = setupWithPartialFill({
      ...prescription,
      rxRfRecords: [{ prescriptionSource: RX_SOURCE.PARTIAL_FILL }],
    });
    const accordionHeading = screen.getByText('Partial fill');

    expect(accordionHeading).to.exist;
  });

  it('calls AAL on load', async () => {
    const screen = setup();
    expect(screen.queryByTestId('va-prescription-container')).to.exist;

    await waitFor(() => {
      expect(landMedicationDetailsAalStub.calledOnce).to.be.true;
      expect(landMedicationDetailsAalStub.calledWith(newRx)).to.be.true;
    });
  });

  it('renders without errors when quantity is a string', () => {
    const rxWithStringQuantity = {
      ...prescription,
      quantity: '30',
    };
    const screen = setup(rxWithStringQuantity);
    expect(screen.queryByTestId('va-prescription-container')).to.exist;

    // Verify the Quantity heading exists and the value is displayed correctly
    const quantityHeading = screen.getByText('Quantity');
    expect(quantityHeading).to.exist;

    // Find the paragraph element that comes after the Quantity heading
    const quantityValue = quantityHeading.nextElementSibling;
    expect(quantityValue).to.exist;
    expect(quantityValue.textContent).to.equal('30');
  });

  it('renders without errors when quantity is a string float', () => {
    const rxWithStringFloatQuantity = {
      ...prescription,
      quantity: '15.5',
    };
    const screen = setup(rxWithStringFloatQuantity);
    expect(screen.queryByTestId('va-prescription-container')).to.exist;

    // Verify the Quantity heading exists and the float value is displayed correctly
    const quantityHeading = screen.getByText('Quantity');
    expect(quantityHeading).to.exist;

    // Find the paragraph element that comes after the Quantity heading
    const quantityValue = quantityHeading.nextElementSibling;
    expect(quantityValue).to.exist;
    expect(quantityValue.textContent).to.equal('15.5');
  });

  // TODO: Remove when the API is updated to return a string
  it('renders without errors when quantity is an integer', () => {
    const rxWithIntegerQuantity = {
      ...prescription,
      quantity: 30,
    };
    const screen = setup(rxWithIntegerQuantity);
    expect(screen.queryByTestId('va-prescription-container')).to.exist;

    // Verify the Quantity heading exists and the value is displayed correctly
    const quantityHeading = screen.getByText('Quantity');
    expect(quantityHeading).to.exist;

    // Find the paragraph element that comes after the Quantity heading
    const quantityValue = quantityHeading.nextElementSibling;
    expect(quantityValue).to.exist;
    expect(quantityValue.textContent).to.equal('30');
  });

  it('renders without errors when quantity is null', () => {
    const rxWithNullQuantity = {
      ...prescription,
      quantity: null,
    };
    const screen = setup(rxWithNullQuantity);
    expect(screen.queryByTestId('va-prescription-container')).to.exist;

    // Verify the Quantity heading exists and the "not available" message is displayed
    const quantityHeading = screen.getByText('Quantity');
    expect(quantityHeading).to.exist;

    // Find the paragraph element that comes after the Quantity heading
    const quantityValue = quantityHeading.nextElementSibling;
    expect(quantityValue).to.exist;
    expect(quantityValue.textContent).to.equal('Quantity not available');
  });

  it('renders without errors when quantity is zero', () => {
    const rxWithZeroQuantity = {
      ...prescription,
      quantity: 0,
    };
    const screen = setup(rxWithZeroQuantity);
    expect(screen.queryByTestId('va-prescription-container')).to.exist;

    // Verify the Quantity heading exists and zero is displayed correctly
    const quantityHeading = screen.getByText('Quantity');
    expect(quantityHeading).to.exist;

    // Find the paragraph element that comes after the Quantity heading
    const quantityValue = quantityHeading.nextElementSibling;
    expect(quantityValue).to.exist;
    expect(quantityValue.textContent).to.equal('0');
  });

  it('hides reason for use when Cerner pilot is enabled', () => {
    const screen = setup(newRx, true, { isCernerPilot: true });

    expect(screen.queryByText('Reason for use')).to.not.exist;
  });

  it('hides pharmacy phone and displays a link when Cerner pilot is enabled', () => {
    const screen = setup(newRx, true, { isCernerPilot: true });
    const pharmacyPhone = screen.queryByTestId('phone-number');
    const findFacilityLink = screen.getByTestId('find-facility-link');

    expect(pharmacyPhone).to.not.exist;
    expect(findFacilityLink).to.exist;
    expect(
      screen.getByText(
        'Check your prescription label or contact your VA facility.',
      ),
    ).to.exist;
    expect(screen.getByText('Find your VA facility')).to.exist;
  });

  it('hides refill history when Cerner pilot is enabled', () => {
    const screen = setup(newRx, true, { isCernerPilot: true });

    expect(screen.queryByText('Refill history')).to.not.exist;
  });
});
