import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import rxDetailsResponse from '../../fixtures/prescriptionDetails.json';
import PrescriptionPrintOnly from '../../../components/PrescriptionDetails/PrescriptionPrintOnly';

describe('Prescription print only container', () => {
  const setup = (params = { va: true, isDetailsRx: false }) => {
    const rx = {
      ...rxDetailsResponse.data.attributes,
      ...(!params.va && { prescriptionSource: 'NV' }),
    };
    return renderWithStoreAndRouter(
      <PrescriptionPrintOnly
        hideLineBreak={false}
        rx={rx}
        isDetailsRx={params.isDetailsRx}
      />,
      {
        initialState: {},
        reducers: {},
        path: '/prescriptions/1234567891',
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
    expect(screen.findByText('About your prescription')).to.exist;
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
    const detailsHeaderElement = screen.getByText('About your prescription');
    expect(nameElement.tagName).to.equal('H2');
    expect(detailsHeaderElement.tagName).to.equal('H3');
  });
  it('should render h3 tag', () => {
    const screen = setup({ isDetailsRx: false });
    const nameElement = screen.getByText('ONDANSETRON 8 MG TAB');
    expect(nameElement.tagName).to.equal('H3');
  });
});
