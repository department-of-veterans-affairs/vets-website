import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import PrintHeader from '../../containers/PrintHeader';
import reducers from '../../reducers';
import userProfile from '../fixtures/userProfile.json';

describe('Print Header Container', () => {
  const setup = () => {
    return renderWithStoreAndRouter(<PrintHeader />, {
      initialState: {},
      reducers,
      path: '/',
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
    const name = userProfile.first
      ? `${userProfile.last}, ${userProfile.first} ${userProfile.middle}, ${
          userProfile.suffix
        }`
      : 'Doe, John R., Jr.';

    expect(screen.getByTestId('name-date-of-birth')).to.have.text(
      `${name} Date of birth: ${userProfile.dob}`,
    );
  });
});
