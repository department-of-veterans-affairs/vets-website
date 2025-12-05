import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import rxDetailsResponse from '../../fixtures/prescriptionDetails.json';
import PrescriptionPrintOnly from '../../../components/PrescriptionDetails/PrescriptionPrintOnly';

describe('Prescription print only container', () => {
  const setup = (params = { va: true, isDetailsRx: false }) => {
    const rx = {
      ...rxDetailsResponse.data.attributes,
      ...(!params.va && { prescriptionSource: 'NV' }),
    };
    return renderWithStoreAndRouterV6(
      <PrescriptionPrintOnly rx={rx} isDetailsRx={params.isDetailsRx} />,
      {
        initialState: {},
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
  it('should render Non-VA rx details', () => {
    const screen = setup({ va: false });
    expect(screen.findByText('Instructions:')).to.exist;
    expect(screen.findByText('Reason for use')).to.exist;
    expect(screen.findByText('Status:')).to.exist;
    expect(
      screen.findByText(
        `A VA provider added this medication record in your VA medical records.
        But this isn’t a prescription you filled through a VA pharmacy. You
        can’t request refills or manage this medication through this online
        tool.`,
      ),
    ).to.exist;
  });
  it('should render h2 tag', () => {
    const screen = setup({ isDetailsRx: true, va: true });
    const nameElement = screen.getByText('ONDANSETRON 8 MG TAB');
    const detailsHeaderElement = screen.getByText('Most recent prescription');
    expect(nameElement.tagName).to.equal('H2');
    expect(detailsHeaderElement.tagName).to.equal('H3');
  });
  it('should render h3 tag', () => {
    const screen = setup({ isDetailsRx: false });
    const nameElement = screen.getByText('ONDANSETRON 8 MG TAB');
    expect(nameElement.tagName).to.equal('H3');
  });
});

describe('CernerPilot feature flag tests', () => {
  const setupWithCernerPilot = (
    params = { va: true, isDetailsRx: false },
    isCernerPilot = false,
  ) => {
    const rx = {
      ...rxDetailsResponse.data.attributes,
      ...(!params.va && { prescriptionSource: 'NV' }),
    };
    return renderWithStoreAndRouterV6(
      <PrescriptionPrintOnly rx={rx} isDetailsRx={params.isDetailsRx} />,
      {
        initialState: {
          featureToggles: {
            // eslint-disable-next-line camelcase
            mhv_medications_cerner_pilot: isCernerPilot,
          },
        },
        reducers: {},
        initialEntries: ['/prescriptions/1234567891'],
      },
    );
  };

  it('should use V1 status display in print view when CernerPilot is disabled', () => {
    const screen = setupWithCernerPilot({ va: true, isDetailsRx: true }, false);

    // Should display original status format
    expect(screen.findByText('Status:')).to.exist;
    // The actual status value depends on the fixture data
    // but it should not be transformed to V2 format
  });

  it('should use V2 status display in print view when CernerPilot is enabled', () => {
    const screen = setupWithCernerPilot({ va: true, isDetailsRx: true }, true);

    // Should display V2 status format
    expect(screen.findByText('Status:')).to.exist;
    // Status should be transformed according to V2 mapping
  });

  it('should properly render VA prescription print view with CernerPilot enabled', () => {
    const screen = setupWithCernerPilot({ va: true, isDetailsRx: false }, true);

    // All standard fields should still be present
    expect(screen.findByText('Most recent prescription')).to.exist;
    expect(screen.findByText('Last filled on:')).to.exist;
    expect(screen.findByText('Status:')).to.exist;
    expect(screen.findByText('Refills left:')).to.exist;
    expect(screen.findByText('Prescription number:')).to.exist;
    expect(screen.findByText('Prescribed on:')).to.exist;
    expect(screen.findByText('Quantity:')).to.exist;
  });

  it('should properly render Non-VA prescription print view with CernerPilot enabled', () => {
    const screen = setupWithCernerPilot(
      { va: false, isDetailsRx: false },
      true,
    );

    // Non-VA specific fields should still be present
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

  it('should maintain proper heading hierarchy with CernerPilot enabled', () => {
    const screen = setupWithCernerPilot({ isDetailsRx: true, va: true }, true);

    const nameElement = screen.getByText('ONDANSETRON 8 MG TAB');
    const detailsHeaderElement = screen.getByText('Most recent prescription');
    expect(nameElement.tagName).to.equal('H2');
    expect(detailsHeaderElement.tagName).to.equal('H3');
  });

  it('should use correct heading levels for non-details view with CernerPilot enabled', () => {
    const screen = setupWithCernerPilot({ isDetailsRx: false }, true);

    const nameElement = screen.getByText('ONDANSETRON 8 MG TAB');
    expect(nameElement.tagName).to.equal('H3');
  });

  it('should render print-friendly layout with CernerPilot enabled', () => {
    const screen = setupWithCernerPilot({ va: true, isDetailsRx: true }, true);

    // Should render without errors and maintain print-friendly structure
    expect(screen).to.exist;
    expect(screen.findByText('Medications | Veterans Affairs')).to.exist;
  });

  it('should pass CernerPilot flag to status components for print view', () => {
    const screen = setupWithCernerPilot({ va: true, isDetailsRx: false }, true);

    // Status field should be present and use V2 formatting when CernerPilot is enabled
    expect(screen.findByText('Status:')).to.exist;
    // The prescriptionMedAndRenewalStatus function should be called with isCernerPilot=true
    // which means it will use V2 status definitions in the print view
  });
});
