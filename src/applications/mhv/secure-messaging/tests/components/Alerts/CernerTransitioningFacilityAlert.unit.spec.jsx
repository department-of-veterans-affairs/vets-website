import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import CernerTransitioningFacilityAlert from '../../../components/Alerts/CernerTransitioningFacilityAlert';
import { CernerTransitioningFacilities } from '../../../util/constants';

describe('CernerTransitioningFacilityAlert', () => {
  const initialState = {
    featureToggles: {},
    user: {
      profile: {
        facilities: [],
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<CernerTransitioningFacilityAlert />, {
      initialState: state,
    });
  };

  it('should render the alert when feature toggle is enabled and user has transitioning facilities', () => {
    const customState = {
      featureToggles: [],
      user: {
        profile: {
          facilities: [
            {
              facilityId: CernerTransitioningFacilities.NORTH_CHICAGO,
              isCerner: false,
            },
          ],
        },
      },
    };
    customState.featureToggles[`${'cerner_transition_556_t30'}`] = true;

    const { getByText, findByText } = setup(customState);

    expect(
      findByText(
        'New: Portions of My HealtheVet Transitioning to My VA Health',
      ),
    ).to.exist;
    expect(
      getByText(
        'Your VA health record or portions of it may be managed on My VA Health.',
        { exact: false },
      ),
    ).to.exist;
    expect(getByText('Learn more')).to.exist;
  });

  it('should not render the alert when feature toggle is disabled', () => {
    const customState = {
      featureToggles: [],
      user: {
        profile: {
          facilities: [
            {
              facilityId: CernerTransitioningFacilities.NORTH_CHICAGO,
              isCerner: false,
            },
          ],
        },
      },
    };
    customState.featureToggles[`${'cerner_transition_556_t30'}`] = false;

    const { queryByText } = setup(customState);
    expect(
      queryByText(
        'New: Portions of My HealtheVet Transitioning to My VA Health',
      ),
    ).to.be.null;
    expect(
      queryByText(
        'Your VA health record or portions of it may be managed on My VA Health.',
      ),
    ).to.be.null;
    expect(queryByText('Learn more')).to.be.null;
    expect(queryByText('Visit My VA Health at')).to.be.null;
  });

  it('should not render the alert when user does not have transitioning facilities', () => {
    const customState = {
      featureToggles: [],
      user: {
        profile: {
          facilities: [
            {
              facilityId: '998',
              isCerner: false,
            },
          ],
        },
      },
    };
    customState.featureToggles[`${'cerner_transition_556_t30'}`] = true;

    const { queryByText } = setup(customState);

    expect(
      queryByText(
        'New: Portions of My HealtheVet Transitioning to My VA Health',
      ),
    ).to.be.null;
    expect(
      queryByText(
        'Your VA health record or portions of it may be managed on My VA Health.',
      ),
    ).to.be.null;
    expect(queryByText('Learn more')).to.be.null;
    expect(queryByText('Visit My VA Health at')).to.be.null;
  });

  it('should not render when no facilites are fetched', () => {
    const customState = {
      featureToggles: [],
      user: {
        profile: {
          facilities: [],
        },
      },
    };
    customState.featureToggles[`${'cerner_transition_556_t30'}`] = true;

    const { queryByText } = setup(customState);

    expect(
      queryByText(
        'New: Portions of My HealtheVet Transitioning to My VA Health',
      ),
    ).to.be.null;
    expect(
      queryByText(
        'Your VA health record or portions of it may be managed on My VA Health.',
      ),
    ).to.be.null;
    expect(queryByText('Learn more')).to.be.null;
    expect(queryByText('Visit My VA Health at')).to.be.null;
  });

  it('should not render the alert post transition', () => {
    const customState = {
      featureToggles: [],
      user: {
        profile: {
          facilities: [
            {
              facilityId: CernerTransitioningFacilities.NORTH_CHICAGO,
              isCerner: true,
            },
          ],
        },
      },
    };
    customState.featureToggles[`${'cerner_transition_556_t30'}`] = true;

    const { queryByText } = setup(customState);

    expect(
      queryByText(
        'New: Portions of My HealtheVet Transitioning to My VA Health',
      ),
    ).to.be.null;
    expect(
      queryByText(
        'Your VA health record or portions of it may be managed on My VA Health.',
      ),
    ).to.be.null;
    expect(queryByText('Learn more')).to.be.null;
    expect(queryByText('Visit My VA Health at')).to.be.null;
  });
});
