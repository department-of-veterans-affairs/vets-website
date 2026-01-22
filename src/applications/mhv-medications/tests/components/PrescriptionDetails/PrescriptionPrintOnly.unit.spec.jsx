import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import rxDetailsResponse from '../../fixtures/prescriptionDetails.json';
import PrescriptionPrintOnly from '../../../components/PrescriptionDetails/PrescriptionPrintOnly';

describe('Prescription print only container', () => {
  const FLAG_COMBINATIONS = [
    {
      isCernerPilot: false,
      isV2StatusMapping: false,
      desc: 'both flags disabled',
    },
    {
      isCernerPilot: true,
      isV2StatusMapping: false,
      desc: 'only cernerPilot enabled',
    },
    {
      isCernerPilot: false,
      isV2StatusMapping: true,
      desc: 'only v2StatusMapping enabled',
    },
    {
      isCernerPilot: true,
      isV2StatusMapping: true,
      desc: 'both flags enabled',
    },
  ];

  const setup = (
    params = {
      va: true,
      isDetailsRx: false,
      isCernerPilot: false,
      isV2StatusMapping: false,
    },
  ) => {
    const rx = {
      ...rxDetailsResponse.data.attributes,
      ...(!params.va && { prescriptionSource: 'NV' }),
    };

    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]:
          params.isCernerPilot || false,
        [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]:
          params.isV2StatusMapping || false,
      },
    };

    return renderWithStoreAndRouterV6(
      <PrescriptionPrintOnly rx={rx} isDetailsRx={params.isDetailsRx} />,
      {
        initialState,
        reducers: {},
        initialEntries: ['/prescriptions/1234567891'],
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('should render rx name', () => {
    const screen = setup();
    expect(screen.findByText('Medications | Veterans Affairs')).to.exist;
  });

  describe('VA prescriptions', () => {
    it('should render VA rx details', () => {
      const screen = setup();
      expect(screen.findByText('Most recent prescription')).to.exist;
      expect(screen.findByText('Last filled on:')).to.exist;
      expect(screen.findByText('Status:')).to.exist;
      expect(screen.findByText('Refills left:')).to.exist;
      expect(
        screen.findByText(
          'Request refills by this prescription expiration date:',
        ),
      ).to.exist;
      expect(screen.findByText('Prescription number:')).to.exist;
      expect(screen.findByText('Prescribed on:')).to.exist;
      expect(screen.findByText('Quantity:')).to.exist;
    });

    it('should render h2 tag when isDetailsRx is true', () => {
      const screen = setup({
        isDetailsRx: true,
        va: true,
        isCernerPilot: false,
      });
      const nameElement = screen.getByText('ONDANSETRON 8 MG TAB');
      const detailsHeaderElement = screen.getByText('Most recent prescription');
      expect(nameElement.tagName).to.equal('H2');
      expect(detailsHeaderElement.tagName).to.equal('H3');
    });

    it('should render h3 tag when isDetailsRx is false', () => {
      const screen = setup({ isDetailsRx: false, isCernerPilot: false });
      const nameElement = screen.getByText('ONDANSETRON 8 MG TAB');
      expect(nameElement.tagName).to.equal('H3');
    });
  });

  describe('Non-VA prescriptions', () => {
    it('should render Non-VA rx details', () => {
      const screen = setup({
        va: false,
        isDetailsRx: false,
        isCernerPilot: false,
      });
      expect(screen.findByText('Instructions:')).to.exist;
      expect(screen.findByText('Reason for use')).to.exist;
      expect(screen.findByText('Status:')).to.exist;
      expect(
        screen.findByText(
          `A VA provider added this medication record in your VA medical records.
        But this isn't a prescription you filled through a VA pharmacy. You
        can't request refills or manage this medication through this online
        tool.`,
        ),
      ).to.exist;
    });
  });

  describe('Grouped medications', () => {
    it('displays "Not available" when prescription number is missing', () => {
      const rx = {
        ...rxDetailsResponse.data.attributes,
        groupedMedications: [
          {
            prescriptionNumber: null,
            sortedDispensedDate: '2024-01-15',
            quantity: 30,
            orderedDate: '2024-01-10',
            providerFirstName: 'John',
            providerLastName: 'Doe',
          },
        ],
      };

      const initialState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
          [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: false,
        },
      };

      const screen = renderWithStoreAndRouterV6(
        <PrescriptionPrintOnly rx={rx} isDetailsRx />,
        {
          initialState,
          reducers: {},
          initialEntries: ['/prescriptions/1234567891'],
        },
      );

      expect(screen.getByText('Prescription number: Not available')).to.exist;
    });
  });

  describe('Cerner pilot flag behavior', () => {
    it('should hide reason for use when Cerner pilot is enabled', () => {
      const screen = setup({
        va: true,
        isDetailsRx: false,
        isCernerPilot: true,
      });

      expect(screen.queryByText('Reason for use')).to.not.exist;
    });

    it('should hide pharmacy phone and displays a link when Cerner pilot is enabled', () => {
      const screen = setup({
        va: true,
        isDetailsRx: false,
        isCernerPilot: true,
      });

      expect(screen.queryByText('Pharmacy phone number:')).to.not.exist;
      expect(
        screen.getByText(
          'Check your prescription label or contact your VA facility.',
        ),
      ).to.exist;
    });

    it('should hide refill history when Cerner pilot is enabled', () => {
      const screen = setup({
        va: true,
        isDetailsRx: false,
        isCernerPilot: true,
      });

      expect(screen.queryByText('Refill history')).to.not.exist;
    });

    it('should hide "Not filled yet" when Cerner pilot is enabled and no dispense date', () => {
      const rx = {
        ...rxDetailsResponse.data.attributes,
        sortedDispensedDate: null,
        dispensedDate: null,
      };

      const initialState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: true,
          [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: false,
        },
      };

      const screen = renderWithStoreAndRouterV6(
        <PrescriptionPrintOnly rx={rx} isDetailsRx={false} />,
        {
          initialState,
          reducers: {},
          initialEntries: ['/prescriptions/1234567891'],
        },
      );

      expect(screen.queryByText('Not filled yet')).to.not.exist;
    });

    it('should show "Not filled yet" when Cerner pilot is disabled and no dispense date', () => {
      const rx = {
        ...rxDetailsResponse.data.attributes,
        sortedDispensedDate: null,
        dispensedDate: null,
      };

      const initialState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: false,
          [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: false,
        },
      };

      const screen = renderWithStoreAndRouterV6(
        <PrescriptionPrintOnly rx={rx} isDetailsRx={false} />,
        {
          initialState,
          reducers: {},
          initialEntries: ['/prescriptions/1234567891'],
        },
      );

      expect(screen.getByText('Not filled yet')).to.exist;
    });
  });

  describe('CernerPilot and V2StatusMapping flag combination behavior', () => {
    FLAG_COMBINATIONS.forEach(({ isCernerPilot, isV2StatusMapping, desc }) => {
      describe(`when ${desc}`, () => {
        it('renders VA prescription print view correctly', () => {
          const screen = setup({
            va: true,
            isDetailsRx: false,
            isCernerPilot,
            isV2StatusMapping,
          });
          expect(screen.findByText('Most recent prescription')).to.exist;
          expect(screen.findByText('Status:')).to.exist;
        });

        if (isCernerPilot) {
          it('hides reason for use', () => {
            const screen = setup({
              va: true,
              isDetailsRx: false,
              isCernerPilot,
              isV2StatusMapping,
            });
            expect(screen.queryByText('Reason for use')).to.not.exist;
          });

          it('hides pharmacy phone and shows facility link', () => {
            const screen = setup({
              va: true,
              isDetailsRx: false,
              isCernerPilot,
              isV2StatusMapping,
            });
            expect(screen.queryByText('Pharmacy phone number:')).to.not.exist;
            expect(
              screen.getByText(
                'Check your prescription label or contact your VA facility.',
              ),
            ).to.exist;
          });

          it('hides refill history', () => {
            const screen = setup({
              va: true,
              isDetailsRx: false,
              isCernerPilot,
              isV2StatusMapping,
            });
            expect(screen.queryByText('Refill history')).to.not.exist;
          });
        }

        it('maintains proper heading hierarchy', () => {
          const screen = setup({
            isDetailsRx: true,
            va: true,
            isCernerPilot,
            isV2StatusMapping,
          });
          const nameElement = screen.getByText('ONDANSETRON 8 MG TAB');
          const detailsHeaderElement = screen.getByText(
            'Most recent prescription',
          );
          expect(nameElement.tagName).to.equal('H2');
          expect(detailsHeaderElement.tagName).to.equal('H3');
        });
      });
    });
  });
});
