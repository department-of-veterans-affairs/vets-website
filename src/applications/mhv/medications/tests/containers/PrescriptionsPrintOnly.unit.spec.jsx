import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../reducers';
import PrescriptionsPrintOnly from '../../containers/PrescriptionsPrintOnly';

describe('Medications List Print Page', () => {
  const setup = () => {
    return renderWithStoreAndRouter(<PrescriptionsPrintOnly />, {
      initialState: {},
      reducers,
      path: '/1',
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
  it('display user name and dob', () => {
    const screen = setup();
    const name = 'Doe, John R., Jr.';
    const dob = 'March 15, 1982';
    expect(screen.findByText(name)).to.exist;
    expect(screen.findByText(`Date of birth: ${dob}`)).to.exist;
  });
});
