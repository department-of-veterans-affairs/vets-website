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
            662: {
              vhaId: '662',
              vamcFacilityName: 'San Francisco VA Medical Center',
              vamcSystemName: 'VA San Francisco health care',
              ehr: 'vista',
            },
            757: {
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

  it('sets the document title', async () => {
    setup();

    await waitFor(() => {
      expect(document.title).to.equal(
        'Care Team Help - Start Message | Veterans Affairs',
      );
    });
  });

  it('shows VistA-only content when user has only VistA systems', () => {
    const screen = setup(vistaOnlyState);

    // Check for VistA-specific content
    expect(screen.getByText(/Select a different VA health care system/)).to
      .exist;
    expect(screen.getByText(/Enter the first few letters/)).to.exist;

    // VistA-only reasons include "You removed them from your contact list"
    expect(screen.getByText(/You removed them from your contact list/)).to
      .exist;

    // Should have one "Update your contact list" link
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
    expect(screen.getByText(/Select a different VA health care system/)).to
      .exist;
    expect(screen.getByText(/Enter the first few letters/)).to.exist;

    // Ensure VistA-only specific content is NOT present
    expect(screen.queryByText(/You removed them from your contact list/)).to.not
      .exist;

    // Oracle-only has no "Update your contact list" link in current UI
    expect(screen.queryByText(/Update your contact list/)).to.be.null;

    // Back navigation works
    const historySpy = sinon.spy(screen.history, 'goBack');
    const backButton = screen.container.querySelector('va-button[text="Back"]');
    fireEvent.click(backButton);
    expect(historySpy.calledOnce).to.be.true;
  });

  it('shows hybrid content when user has both Oracle and VistA systems', () => {
    const screen = setup(); // Uses baseState with both systems

    // Page renders with title
    expect(screen.getByRole('heading', { level: 1 })).to.exist;

    // Hybrid includes facility list of user's VistA systems derived from EHR data
    // From baseState, VistA facility 662 should render as its vamcSystemName
    expect(screen.getByText('VA San Francisco health care')).to.exist;

    // Hybrid should have ONE link labeled "Update your contact list"
    const updateLinks = screen.getAllByRole('link', {
      name: /Update your contact list/,
    });
    expect(updateLinks).to.have.length(1);

    // Ensure VistA-only specific reason is NOT present
    expect(screen.queryByText(/You removed them from your contact list/)).to.not
      .exist;

    // Hybrid still shows search guidance
    expect(screen.getByText(/Enter the first few letters/)).to.exist;

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

    // Should have at least one "Update your contact list" link
    const updateLinks = screen.getAllByText(/Update your contact list/);
    expect(updateLinks.length).to.be.greaterThan(0);
  });

  it('redirects users to interstitial page if interstitial not accepted', async () => {
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
  });

  it('does not redirect users to interstitial page if interstitial not accepted', async () => {
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

    const { history } = setup(customState);

    await waitFor(() => {
      expect(history.location.pathname).to.equal(
        '/new-message/care-team-help/',
      );
    });
  });
});
