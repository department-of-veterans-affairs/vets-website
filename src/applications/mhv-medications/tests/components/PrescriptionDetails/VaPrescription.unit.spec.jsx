import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import VaPrescription from '../../../components/PrescriptionDetails/VaPrescription';
import rxDetailsResponse from '../../fixtures/prescriptionDetails.json';
import { dateFormat } from '../../../util/helpers';
import * as rxApiExports from '../../../api/rxApi';
import { RX_SOURCE } from '../../../util/constants';

describe('vaPrescription details container', () => {
  const prescription = rxDetailsResponse.data.attributes;
  const newRx = { ...prescription, phoneNumber: '1234567891' };
  const setup = (rx = newRx, ffEnabled = true) => {
    return renderWithStoreAndRouterV6(<VaPrescription {...rx} />, {
      initialState: {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent]: ffEnabled,
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
          [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: false,
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

  describe('CernerPilot feature flag tests', () => {
    const FLAG_COMBINATIONS = [
      {
        isCernerPilot: false,
        isV2StatusMapping: false,
        useV2: false,
        desc: 'both flags disabled',
      },
      {
        isCernerPilot: true,
        isV2StatusMapping: false,
        useV2: false,
        desc: 'only cernerPilot enabled',
      },
      {
        isCernerPilot: false,
        isV2StatusMapping: true,
        useV2: false,
        desc: 'only v2StatusMapping enabled',
      },
      {
        isCernerPilot: true,
        isV2StatusMapping: true,
        useV2: true,
        desc: 'both flags enabled',
      },
    ];

    const setupWithCernerPilot = (
      rx = newRx,
      isCernerPilot = false,
      isV2StatusMapping = false,
    ) => {
      return renderWithStoreAndRouterV6(<VaPrescription {...rx} />, {
        initialState: {
          featureToggles: {
            [FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent]: true,
            [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: isCernerPilot,
            [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: isV2StatusMapping,
          },
        },
        reducers: {},
        initialEntries: ['/prescriptions/1234567891'],
      });
    };

    describe('CernerPilot and V2StatusMapping flag requirement validation', () => {
      FLAG_COMBINATIONS.forEach(
        ({ isCernerPilot, isV2StatusMapping, useV2, desc }) => {
          it(`uses ${useV2 ? 'V2' : 'V1'} status display when ${desc}`, () => {
            const dispStatus = useV2
              ? 'In progress'
              : 'Active: Refill in Process';
            const rxWithStatus = { ...prescription, dispStatus };
            const screen = setupWithCernerPilot(
              rxWithStatus,
              isCernerPilot,
              isV2StatusMapping,
            );
            const expectedStatus = useV2
              ? 'In progress'
              : 'Active: Refill in process';
            expect(screen.getByTestId('status')).to.have.text(expectedStatus);
          });
        },
      );
    });

    // NOTE: Status mapping from V1 to V2 is handled by vets-api

    describe('V2 status display when BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const V2_STATUSES = [
        { v2Status: 'Active', testLabel: 'Active' },
        { v2Status: 'In progress', testLabel: 'In progress' },
        { v2Status: 'Inactive', testLabel: 'Inactive' },
        { v2Status: 'Transferred', testLabel: 'Transferred' },
        { v2Status: 'Status not available', testLabel: 'Status not available' },
      ];

      V2_STATUSES.forEach(({ v2Status, testLabel }) => {
        it(`displays ${testLabel} status correctly when returned by API`, () => {
          const rxWithStatus = { ...prescription, dispStatus: v2Status };
          const screen = setupWithCernerPilot(rxWithStatus, true, true);
          expect(screen.getByTestId('status')).to.have.text(v2Status);
        });
      });
    });

    describe('V1 status display when BOTH flags disabled', () => {
      const V1_STATUSES = [
        { v1Status: 'Active: Parked', testLabel: 'Active: Parked' },
        {
          v1Status: 'Active: Refill in Process',
          testLabel: 'Active: Refill in process',
        },
        { v1Status: 'Expired', testLabel: 'Expired' },
        { v1Status: 'Discontinued', testLabel: 'Discontinued' },
      ];

      V1_STATUSES.forEach(({ v1Status, testLabel }) => {
        it(`displays ${testLabel} status correctly when returned by API`, () => {
          const rxWithStatus = { ...prescription, dispStatus: v1Status };
          const screen = setupWithCernerPilot(rxWithStatus, false, false);
          expect(screen.getByTestId('status')).to.have.text(testLabel);
        });
      });
    });
    describe('Non-VA status preservation', () => {
      FLAG_COMBINATIONS.forEach(
        ({ isCernerPilot, isV2StatusMapping, desc }) => {
          it(`preserves Active: Non-VA status when ${desc}`, () => {
            const rxWithNonVAStatus = {
              ...prescription,
              dispStatus: 'Active: Non-VA',
              prescriptionSource: 'NV',
            };
            const screen = setupWithCernerPilot(
              rxWithNonVAStatus,
              isCernerPilot,
              isV2StatusMapping,
            );
            expect(screen.getByTestId('status')).to.have.text('Active: Non-VA');
          });
        },
      );
    });

    it('should handle unknown status with both flags enabled', () => {
      const rxWithUnknownStatus = {
        ...prescription,
        dispStatus: 'Unknown Status',
      };
      const screen = setupWithCernerPilot(rxWithUnknownStatus, true, true);
      expect(screen.getByText('Status not available')).to.exist;
    });

    it('should display appropriate status descriptions with BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const rxWithActiveStatus = {
        ...prescription,
        dispStatus: 'Active',
      };
      const screen = setupWithCernerPilot(rxWithActiveStatus, true, true);
      expect(screen.getByText('Active')).to.exist;
      const statusDropdown = screen.container.querySelector(
        '[trigger="What does this status mean?"]',
      );
      expect(statusDropdown).to.exist;
    });

    it('should maintain all other prescription details functionality with BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const screen = setupWithCernerPilot(newRx, true, true);
      expect(screen.getByText('Prescription number')).to.exist;
      expect(screen.getByText('Refills left')).to.exist;
      expect(
        screen.getByText(
          'Request refills by this prescription expiration date',
        ),
      ).to.exist;
      expect(screen.getByText('Facility')).to.exist;
    });

    it('should pass BOTH CernerPilot and V2StatusMapping flags to status-related components', () => {
      // When both flags enabled, API returns V2 status directly
      const rxWithStatus = {
        ...prescription,
        dispStatus: 'In progress', // V2 status returned by API
      };
      const screen = setupWithCernerPilot(rxWithStatus, true, true);
      expect(screen.getByText('In progress')).to.exist;
      const statusElement = screen.getByTestId('status-dropdown');
      expect(statusElement).to.exist;
    });
  });

  describe('Renewal action link on detail page for Oracle Health prescriptions', () => {
    const setupOracleHealth = (rx = newRx) => {
      return renderWithStoreAndRouterV6(<VaPrescription {...rx} />, {
        initialState: {
          featureToggles: {
            [FEATURE_FLAG_NAMES.mhvMedicationsDisplayDocumentationContent]: true,
            [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
            [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: false,
            [FEATURE_FLAG_NAMES.mhvSecureMessagingMedicationsRenewalRequest]: true,
          },
          drupalStaticData: {
            vamcEhrData: {
              data: {
                cernerFacilities: [
                  { vhaId: '668', vamcFacilityName: 'Spokane VA' },
                ],
              },
            },
          },
        },
        reducers: {},
        initialEntries: ['/prescriptions/1234567891'],
      });
    };

    it('displays renewal action link for OH prescription with sourceEhr=OH and isRenewable=true', () => {
      const ohRx = {
        ...newRx,
        sourceEhr: 'OH',
        stationNumber: '668',
        isRenewable: true,
      };
      const screen = setupOracleHealth(ohRx);
      expect(screen.getByTestId('send-renewal-request-message-action-link')).to
        .exist;
    });

    it('does not display renewal action link for non-OH prescription', () => {
      const vistaRx = {
        ...newRx,
        stationNumber: '989',
        isRenewable: true,
      };
      const screen = setupOracleHealth(vistaRx);
      expect(screen.queryByTestId('send-renewal-request-message-action-link'))
        .to.not.exist;
    });

    it('does not display renewal action link when isRenewable is false', () => {
      const ohNonRenewable = {
        ...newRx,
        sourceEhr: 'OH',
        stationNumber: '668',
        isRenewable: false,
      };
      const screen = setupOracleHealth(ohNonRenewable);
      expect(screen.queryByTestId('send-renewal-request-message-action-link'))
        .to.not.exist;
    });
  });
});
