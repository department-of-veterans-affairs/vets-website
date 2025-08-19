import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';
import CareTeamHelp from '../../containers/CareTeamHelp';

describe('CareTeamHelp', () => {
  const baseState = {
    sm: {
      recipients: {
        allFacilities: ['662', '757'],
      },
    },
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '662': {
              vhaId: '662',
              vamcSystemName: 'Test VistA Facility',
              ehr: 'vista',
            },
            '757': {
              vhaId: '757',
              vamcSystemName: 'Test Oracle Facility',
              ehr: 'cerner',
            },
          },
        },
      },
    },
  };

  const setup = (state = baseState) => {
    return renderWithStoreAndRouter(<CareTeamHelp />, {
      initialState: state,
      reducers: reducer,
      path: Paths.CARE_TEAM_HELP,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays page title', () => {
    const screen = setup();
    expect(screen.getByRole('heading', { level: 1 })).to.have.text(
      "Can't find your care team?",
    );
  });

  it('shows VistA-only content when user has only VistA systems', () => {
    const vistaOnlyState = {
      ...baseState,
      sm: {
        recipients: {
          allFacilities: ['662'],
        },
      },
    };

    const screen = setup(vistaOnlyState);
    expect(screen.getByText(/Select a different VA health care system/)).to
      .exist;
    expect(screen.getByText(/Enter the first few letters/)).to.exist;
  });

  it('shows Oracle-only content when user has only Oracle Health systems', () => {
    const oracleOnlyState = {
      ...baseState,
      sm: {
        recipients: {
          allFacilities: ['757'],
        },
      },
    };

    const screen = setup(oracleOnlyState);
    expect(screen.getByText(/You removed them from your contact list/)).to
      .exist;
  });

  it('shows hybrid content when user has both Oracle and VistA systems', () => {
    const screen = setup(); // Uses baseState with both systems
    expect(screen.getByText(/Only use messages for non-urgent needs/)).to.exist;
    expect(
      screen.getAllByText(/Update your contact list/),
    ).to.have.length.greaterThan(0);
  });

  it('includes back link to select care team page', () => {
    const screen = setup();
    const backLink = screen.getByRole('link', { name: /Back/ });
    expect(backLink).to.have.attribute(
      'href',
      `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
    );
  });
});
