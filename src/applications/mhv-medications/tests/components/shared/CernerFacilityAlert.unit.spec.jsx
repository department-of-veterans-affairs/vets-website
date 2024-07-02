import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import {
  drupalStaticData,
  userProfileFacilities,
} from '../../fixtures/cerner-facility-mock-data.json';
import prescriptions from '../../fixtures/refillablePrescriptionsList.json';
import CernerFacilityAlert from '../../../components/shared/CernerFacilityAlert';

describe('Cerner Facility Alert', () => {
  const initialStateMock = {
    rx: {
      prescriptions,
    },
    drupalStaticData,
    user: {
      profile: {
        facilities: [],
      },
    },
    featureToggles: [],
  };

  const setup = (state = initialStateMock, facilities = { facilities: [] }) => {
    return renderWithStoreAndRouter(<CernerFacilityAlert />, {
      initialState: { ...state, user: { ...state.user, profile: facilities } },
      reducers: reducer,
      path: '/about',
    });
  };

  it(`does not render CernerFacilityAlert if cernerFacilities is empty`, async () => {
    const screen = setup();
    const alert = screen.queryByTestId('cerner-facilities-alert');
    expect(alert).to.have.attribute('visible', 'false');
  });

  it(`renders CernerFacilityAlert with list of facilities if cernerFacilities.length > 1`, async () => {
    const userFacilities = userProfileFacilities.filter(
      f => f.isCerner === false,
    );

    const screen = setup(initialStateMock, {
      facilities: [
        ...userFacilities,
        { facilityId: '668', isCerner: true },
        { facilityId: '687', isCerner: true },
        { facilityId: '692', isCerner: true },
      ],
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    expect(screen.getByText('VA Spokane health care')).to.exist;
    expect(screen.getByText('VA Walla Walla health care')).to.exist;
    expect(screen.getByText('VA Southern Oregon health care')).to.exist;
  });

  it(`renders CernerFacilityAlert with 1 facility if cernerFacilities.length === 1`, async () => {
    const screen = setup(initialStateMock, {
      facilities: userProfileFacilities.filter(f => f.facilityId === '668'),
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;

    expect(
      screen.getByTestId('single-cerner-facility-text').textContent,
    ).to.contain(
      'To manage medications at VA Spokane health care, go to My VA Health.',
    );
  });
});
