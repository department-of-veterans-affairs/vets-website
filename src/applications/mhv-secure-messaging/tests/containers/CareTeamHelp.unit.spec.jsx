import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';
import CareTeamHelp from '../../containers/CareTeamHelp';

describe('CareTeamHelp', () => {
  const baseState = {
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '662': {
              vhaId: '662',
              vamcFacilityName: 'San Francisco VA Medical Center',
              vamcSystemName: 'VA San Francisco health care',
              ehr: 'vista',
            },
            '757': {
              vhaId: '757',
              vamcFacilityName: 'Chalmers P. Wylie Veterans Outpatient Clinic',
              vamcSystemName: 'VA Central Ohio health care',
              ehr: 'cerner',
            },
          },
          vistaFacilities: [
            { vhaId: '662', vamcSystemName: 'Test VistA Facility' },
          ],
          cernerFacilities: [
            { vhaId: '757', vamcSystemName: 'Test Oracle Facility' },
          ],
        },
      },
    },
    user: {
      profile: {
        facilities: [
          {
            facilityId: '662',
            isCerner: false,
          },
          {
            facilityId: '757',
            isCerner: true,
          },
        ],
      },
    },
  };

  const oracleOnlyState = {
    ...baseState,
    user: {
      profile: {
        facilities: [
          {
            facilityId: '757',
            isCerner: true,
          },
        ],
      },
    },
  };

  const vistaOnlyState = {
    ...baseState,
    user: {
      profile: {
        facilities: [
          {
            facilityId: '662',
            isCerner: false,
          },
        ],
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

    // Back navigation works
    const historySpy = sinon.spy(screen.history, 'goBack');
    const backButton = screen.container.querySelector('va-button[text="Back"]');
    fireEvent.click(backButton);
    expect(historySpy.calledOnce).to.be.true;
  });

  it('shows Oracle-only content when user has only Oracle Health systems', () => {
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

    // Back navigation works
    const historySpy = sinon.spy(screen.history, 'goBack');
    const backButton = screen.container.querySelector('va-button[text="Back"]');
    fireEvent.click(backButton);
    expect(historySpy.calledOnce).to.be.true;
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

    // Back navigation works
    const historySpy = sinon.spy(screen.history, 'goBack');
    const backButton = screen.container.querySelector('va-button[text="Back"]');
    fireEvent.click(backButton);
    expect(historySpy.calledOnce).to.be.true;
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
      ...baseState,
      user: {
        profile: {
          facilities: [],
        },
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
    const screen = setup(baseState);

    // Verify the page renders correctly with mixed systems
    expect(screen.getByRole('heading', { level: 1 })).to.exist;
    expect(screen.getByText(/Only use messages for non-urgent needs/)).to.exist;

    // Should have at least one "Update your contact list" link
    const updateLinks = screen.getAllByText(/Update your contact list/);
    expect(updateLinks.length).to.be.greaterThan(0);
  });

  it('redirects users to interstitial page if interstitial not accepted', async () => {
    const oldLocation = global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };

    const customState = {
      ...baseState,
      sm: {
        ...baseState.sm,
        threadDetails: {
          acceptInterstitial: false,
          draftInProgress: {},
        },
      },
    };

    const { history } = setup(customState);

    await waitFor(() => {
      expect(history.location.pathname).to.equal('/new-message/');
    });

    global.window.location = oldLocation;
  });

  it('does not redirect users to interstitial page if interstitial not accepted', async () => {
    const oldLocation = global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };

    const customState = {
      ...baseState,
      sm: {
        ...baseState.sm,
        threadDetails: {
          acceptInterstitial: true,
          draftInProgress: {},
        },
      },
    };

    setup(customState);

    await waitFor(() => {
      expect(window.location.replace.called).to.be.false;
    });

    global.window.location = oldLocation;
  });
});
