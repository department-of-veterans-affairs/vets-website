import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';
import CareTeamHelp from '../../containers/CareTeamHelp';

describe('CareTeamHelp', () => {
  const baseState = {
    drupalStaticData: {
      vamcEhrData: {
        data: {
          vistaFacilities: [
            { vhaId: '662', vamcSystemName: 'Test VistA Facility' },
          ],
          cernerFacilities: [
            { vhaId: '757', vamcSystemName: 'Test Oracle Facility' },
          ],
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
    expect(screen.getByRole('heading', { level: 1 })).to.exist;
  });

  it('shows VistA-only content when user has only VistA systems', () => {
    const vistaOnlyState = {
      drupalStaticData: {
        vamcEhrData: {
          data: {
            vistaFacilities: [
              { vhaId: '662', vamcSystemName: 'Test VistA Facility' },
            ],
            cernerFacilities: [],
          },
        },
      },
    };

    const screen = setup(vistaOnlyState);

    // Check for VistA-specific content
    expect(screen.getByText(/Select a different VA health care system/)).to
      .exist;
    expect(screen.getByText(/Enter the first few letters/)).to.exist;

    // Ensure Oracle-specific content is NOT present
    expect(screen.queryByText(/You removed them from your contact list/)).to.not
      .exist;

    // Ensure hybrid-specific content is NOT present (should only have one "Update your contact list" link)
    const updateLinks = screen.getAllByText(/Update your contact list/);
    expect(updateLinks).to.have.length(1);
  });

  it('shows Oracle-only content when user has only Oracle Health systems', () => {
    const oracleOnlyState = {
      drupalStaticData: {
        vamcEhrData: {
          data: {
            vistaFacilities: [],
            cernerFacilities: [
              { vhaId: '757', vamcSystemName: 'Test Oracle Facility' },
            ],
          },
        },
      },
    };

    const screen = setup(oracleOnlyState);

    // Check for Oracle-specific content
    expect(screen.getByText(/You removed them from your contact list/)).to
      .exist;
    expect(screen.getByText(/Select a different VA health care system/)).to
      .exist;

    // Ensure VistA-specific content is NOT present
    expect(screen.queryByText("They don't use messages,")).to.not.exist;
    expect(screen.queryByText(/Enter the first few letters/)).to.not.exist;

    // Should only have one "Update your contact list" link (not hybrid's two)
    const updateLinks = screen.getAllByText(/Update your contact list/);
    expect(updateLinks).to.have.length(1);
  });

  it('shows hybrid content when user has both Oracle and VistA systems', () => {
    const screen = setup(); // Uses baseState with both systems

    // Check for content that should be present
    expect(screen.getByText(/Only use messages for non-urgent needs/)).to.exist;

    // Hybrid should have TWO "Update your contact list" links
    const updateLinks = screen.getAllByText(/Update your contact list/);
    expect(updateLinks).to.have.length(2);

    // Ensure Oracle-only specific content is NOT present
    expect(screen.queryByText(/You removed them from your contact list/)).to.not
      .exist;

    // Ensure VistA-only specific content is NOT present
    expect(screen.queryByText(/Enter the first few letters/)).to.not.exist;
  });

  it('includes back button', () => {
    const screen = setup();
    // The va-button component should be present
    const backButton = screen.container.querySelector('va-button[text="Back"]');
    expect(backButton).to.exist;
  });

  it('handles edge case when no facilities are available', () => {
    const noFacilitiesState = {
      drupalStaticData: {
        vamcEhrData: {
          data: {
            vistaFacilities: [],
            cernerFacilities: [],
          },
        },
      },
    };

    const screen = setup(noFacilitiesState);

    // Should default to VistA-only content when no facilities (both hasOracle and hasVista are false)
    expect(screen.getByText(/Select a different VA health care system/)).to
      .exist;
    expect(screen.getByText(/Enter the first few letters/)).to.exist;
    // Verify the page renders without errors
    expect(screen.getByRole('heading', { level: 1 })).to.exist;
  });

  it('handles edge case when vamcEhrData is missing', () => {
    const missingEhrDataState = {
      drupalStaticData: {
        vamcEhrData: {},
      },
    };

    const screen = setup(missingEhrDataState);

    // Should default to VistA-only content when EHR data is missing (both hasOracle and hasVista are false)
    expect(screen.getByText(/Select a different VA health care system/)).to
      .exist;
    expect(screen.getByText(/Enter the first few letters/)).to.exist;
    // Verify the page renders without errors
    expect(screen.getByRole('heading', { level: 1 })).to.exist;
  });

  it('renders content for mixed EHR systems with multiple facilities', () => {
    const mixedSystemsState = {
      drupalStaticData: {
        vamcEhrData: {
          data: {
            vistaFacilities: [
              { vhaId: '662', vamcSystemName: 'Test VistA Facility' },
              { vhaId: '123', vamcSystemName: 'Test Unknown Facility' },
            ],
            cernerFacilities: [
              { vhaId: '757', vamcSystemName: 'Test Oracle Facility' },
            ],
          },
        },
      },
    };

    const screen = setup(mixedSystemsState);

    // Verify the page renders correctly with mixed systems
    expect(screen.getByRole('heading', { level: 1 })).to.exist;
    expect(screen.getByText(/Only use messages for non-urgent needs/)).to.exist;

    // Should have at least one "Update your contact list" link
    const updateLinks = screen.getAllByText(/Update your contact list/);
    expect(updateLinks.length).to.be.greaterThan(0);
  });
});
