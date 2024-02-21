import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../reducers';
import PrescriptionsPrintOnly from '../../containers/PrescriptionsPrintOnly';

describe('Medications List Print Page', () => {
  const setup = (params = {}) => {
    return renderWithStoreAndRouter(<PrescriptionsPrintOnly />, {
      initialState: {},
      reducers,
      path: '/1',
      ...params,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('Medications | Veterans Affairs', () => {
    const screen = setup();
    const rxName = screen.findByText('Medications | Veterans Affairs');
    expect(rxName).to.exist;
  });
  it('displays crisis line text', () => {
    const screen = setup();
    const el = screen.getByTestId('crisis-line-print-only');
    const text =
      'If you’re ever in crisis and need to talk to someone right away';
    expect(el).to.exist;
    expect(el.textContent).to.include(text);
  });
  it('does not render for paths other than medication list and details', () => {
    const screen = setup({ path: '/foo' });
    expect(screen.queryByTestId('name-date-of-birth')).to.not.exist;
  });
  it('shows error message if the API call fails', () => {
    const screen = setup();
    const text =
      "We're sorry. There's a problem with our system. Check back later.";
    const el = screen.getByTestId('print-only-preface');
    expect(el).to.exist;
    expect(el.textContent).to.include(text);
  });
});
