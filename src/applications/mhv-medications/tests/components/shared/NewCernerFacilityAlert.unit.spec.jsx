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

  it(`renders the alert with correct text and link`, async () => {
    const screen = setup();

    const alert = screen.getByTestId('new-cerner-facilities-alert');
    expect(alert).to.exist;

    const text = screen.getByTestId('new-cerner-health-facility-text')
      .textContent;
    expect(text).to.include(
      'You can now manage your care for any VA health facility right here in myHeatheVet on VA.gov.',
    );
    expect(text).to.include(
      'Note: You can also still access the My VA Health portal at this time.',
    );

    const link = screen.getByText('Go to My VA Health');
    expect(link).to.exist;
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
