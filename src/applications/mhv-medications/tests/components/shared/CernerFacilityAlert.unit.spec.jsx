import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import CernerFacilityAlert from '../../../components/shared/CernerFacilityAlert';
import reducer from '../../../reducers';

describe('Cerner Facility Alert', () => {
  const setup = (props = {}) => {
    return renderWithStoreAndRouter(<CernerFacilityAlert {...props} />, {
      initialState: {},
      reducers: reducer,
      path: '/about',
    });
  };

  it(`does not render CernerFacilityAlert if facilityNames is empty`, async () => {
    const screen = setup({
      facilitiesNames: [],
      className: '',
      apiError: null,
    });

    const alert = screen.queryByTestId('cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('visible', 'false');
  });

  it(`renders CernerFacilityAlert with list of facilities if cernerFacilities.length > 1`, async () => {
    const facilitiesNames = [
      'VA Spokane health care',
      'VA Walla Walla health care',
      'VA Southern Oregon health care',
    ];

    const screen = setup({ facilitiesNames });

    const alert = screen.queryByTestId('cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('visible', 'true');

    const link = screen.getByText('Go to My VA Health');
    expect(link).to.exist;

    expect(screen.getByText('VA Spokane health care')).to.exist;
    expect(screen.getByText('VA Walla Walla health care')).to.exist;
    expect(screen.getByText('VA Southern Oregon health care')).to.exist;
  });

  it(`renders CernerFacilityAlert with 1 facility if cernerFacilities.length === 1`, async () => {
    const facilitiesNames = ['VA Spokane health care'];
    const screen = setup({ facilitiesNames });

    const alert = screen.queryByTestId('cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('visible', 'true');

    const link = screen.getByText('Go to My VA Health');
    expect(link).to.exist;

    const text = screen.getByTestId('single-cerner-facility-text').textContent;
    expect(text).to.contain(
      'Some of your medications may be in a different portal. To view or manage medications at VA Spokane health care, go to My VA Health.',
    );
  });

  it(`applies apiError margin-top class when apiError is true`, async () => {
    const facilitiesNames = ['VA Spokane health care'];
    const screen = setup({ apiError: true, facilitiesNames });

    const alert = screen.getByTestId('cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.class('vads-u-margin-top--2');
  });

  it(`applies custom class when className is provided`, async () => {
    const facilitiesNames = ['VA Spokane health care'];
    const screen = setup({ className: 'my-custom-class', facilitiesNames });

    const alert = screen.getByTestId('cerner-facilities-alert');
    expect(alert).to.exist;
    expect(alert).to.have.class('my-custom-class');
  });
});
