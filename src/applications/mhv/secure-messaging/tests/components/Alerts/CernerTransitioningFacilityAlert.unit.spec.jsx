import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import CernerTransitioningFacilityAlert from '../../../components/Alerts/CernerTransitioningFacilityAlert';
import { CernerTransitioningFacilities } from '../../../util/constants';

describe('CernerTransitioningFacilityAlert', () => {
  const initialState = {
    drupalStaticData: {
      vamcEhrData: {
        data: {
          vistaFacilities: [
            {
              vhaId: '556',
              vamcSystemName: 'Lovell Federal health care - VA',
            },
          ],
        },
      },
    },
    featureToggles: [],
    user: {
      profile: {
        facilities: [],
      },
    },
  };

  const alertTitle = 'Your health facility is moving to My VA Health';
  const alertContent =
    'Lovell Federal health care - VA is moving to our My VA Health portal.';
  const alertContent2 =
    'Starting on March 4, you won’t be able to use this My HealtheVet tool to send messages to care teams at this facility.';
  const alertContent3 =
    'Starting on March 9, you can use the new My VA Health portal to send messages to these care teams.';

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<CernerTransitioningFacilityAlert />, {
      initialState: state,
    });
  };

  it('should render the alert when feature toggle is enabled and user has transitioning facilities', () => {
    const customState = {
      ...initialState,
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

    const { findByText, container } = setup(customState);

    expect(findByText(alertTitle)).to.exist;
    expect(container.textContent).to.contain(alertContent);
    expect(container.textContent).to.contain(alertContent2);
    expect(container.textContent).to.contain(alertContent3);
  });

  it('should not render the alert when user does not have transitioning facilities', () => {
    const customState = {
      ...initialState,
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

    const { queryByText, container } = setup(customState);
    expect(queryByText(alertTitle)).to.be.null;
    expect(container.textContent).to.not.contain(alertContent);
    expect(container.textContent).to.not.contain(alertContent2);
    expect(container.textContent).to.not.contain(alertContent3);
  });

  it('should not render when no facilites are fetched', () => {
    const customState = {
      ...initialState,
      featureToggles: [],
      user: {
        profile: {
          facilities: [],
        },
      },
    };
    customState.featureToggles[`${'cerner_transition_556_t30'}`] = true;

    const { queryByText, container } = setup(customState);
    expect(queryByText(alertTitle)).to.be.null;
    expect(container.textContent).to.not.contain(alertContent);
    expect(container.textContent).to.not.contain(alertContent2);
    expect(container.textContent).to.not.contain(alertContent3);
  });
});
