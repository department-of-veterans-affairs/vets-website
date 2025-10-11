import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import NewCernerFacilityAlert from '../../../components/shared/NewCernerFacilityAlert';
import reducer from '../../../reducers';

describe('New Cerner Facility Alert', () => {
  const setup = (props = {}) => {
    return renderWithStoreAndRouter(<NewCernerFacilityAlert {...props} />, {
      initialState: {},
      reducers: reducer,
      path: '/about',
    });
  };

  it(`renders the alert in collapsed state by default`, async () => {
    const screen = setup();

    const alert = screen.getByTestId('new-cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('aria-expanded', 'false');

    const toggleButton = screen.getByTestId('new-cerner-facility-alert-toggle');
    expect(toggleButton).to.exist;
  });

  it(`toggles the alert when the toggle button is clicked and menuOpen is true`, async () => {
    const screen = setup();

    const toggleButton = screen.getByTestId('new-cerner-facility-alert-toggle');
    toggleButton.click(); // click on the button to expand the alert

    const link = screen.getByText('Go to My VA Health');
    expect(link).to.exist;

    const alert = screen.getByTestId('new-cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('aria-expanded', 'true');

    const text = screen.getByTestId('new-cerner-facility-alert-toggle');
    expect(text).to.exist;
  });

  it(`applies apiError margin-top class when apiError is true`, async () => {
    const screen = setup({ apiError: true });

    const alert = screen.getByTestId('new-cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.class('vads-u-margin-top--2');
  });

  it(`applies custom class when className is provided`, async () => {
    const screen = setup({ className: 'my-custom-class' });

    const alert = screen.getByTestId('new-cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.class('my-custom-class');
  });
});
