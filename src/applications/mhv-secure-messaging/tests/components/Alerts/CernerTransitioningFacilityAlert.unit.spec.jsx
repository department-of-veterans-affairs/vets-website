import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import CernerTransitioningFacilityAlert from '../../../components/Alerts/CernerTransitioningFacilityAlert';
import { CernerTransitioningFacilities } from '../../../util/constants';

describe('CernerTransitioningFacilityAlert', () => {
  const initialState = {
    drupalStaticData: {
      vamcEhrData: {
        data: {
          ehrDataByVhaId: {
            '556': {
              vhaId: '556',
              vamcFacilityName:
                'Captain James A. Lovell Federal Health Care Center',
              vamcSystemName: 'Lovell Federal health care - VA',
              ehr: 'vista',
            },
          },
        },
      },
    },
    user: {
      profile: {
        facilities: [],
      },
    },
  };

  const initialProps = {
    t5: false,
    t30: false,
    facilityId: '556',
  };

  const alertT30 = {
    alertTitle: 'Your health facility is moving to My VA Health',
    alertContent:
      'Lovell Federal health care - VA is moving to our My VA Health portal.',
    alertContent2:
      'Starting on March 4, you won’t be able to use this My HealtheVet tool to send messages to care teams at this facility.',
    alertContent3:
      'Starting on March 9, you can use the new My VA Health portal to send messages to these care teams.',
  };

  const alertT5 = {
    alertTitle: 'You can’t send messages to some of your care teams right now',
    alertContent:
      'On March 9, you can start using My VA Health to send messages to care teams at this facility.',
    alertContent2: 'To contact your care team now, call your facility.',
  };

  const setup = (state = initialState, props = initialProps) => {
    return renderWithStoreAndRouter(
      <CernerTransitioningFacilityAlert {...props} />,
      {
        initialState: state,
      },
    );
  };

  afterEach(() => {
    cleanup();
  });

  it('should render the alert when feature toggle is enabled and user has transitioning facilities', async () => {
    const customState = {
      ...initialState,
      user: {
        profile: {
          facilities: [
            {
              facilityId:
                CernerTransitioningFacilities.NORTH_CHICAGO.facilityId,
              isCerner: false,
            },
          ],
        },
      },
    };
    const customProps = { ...initialProps, t30: true };

    const { findByText, container } = setup(customState, customProps);

    expect(findByText(alertT30.alertTitle)).to.exist;
    expect(container.textContent).to.contain(alertT30.alertContent);
    expect(container.textContent).to.contain(alertT30.alertContent2);
    expect(container.textContent).to.contain(alertT30.alertContent3);
  });

  it('should not render the alert when user does not have transitioning facilities', async () => {
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
    const customProps = { t30: true, facilityId: null };

    const { queryByText, container } = setup(customState, customProps);
    expect(queryByText(alertT30.alertTitle)).to.be.null;
    expect(container.textContent).to.not.contain(alertT30.alertContent);
    expect(container.textContent).to.not.contain(alertT30.alertContent2);
    expect(container.textContent).to.not.contain(alertT30.alertContent3);
  });

  it('should not render when no facilites are fetched', async () => {
    const customState = {
      ...initialState,
      user: {
        profile: {
          facilities: [],
        },
      },
    };
    const customProps = { ...initialProps, t30: true };

    const { queryByText, container } = setup(customState, customProps);
    expect(queryByText(alertT30.alertTitle)).to.be.null;
    expect(container.textContent).to.not.contain(alertT30.alertContent);
    expect(container.textContent).to.not.contain(alertT30.alertContent2);
    expect(container.textContent).to.not.contain(alertT30.alertContent3);
  });

  it('renders T-5 alert when feature toggle is enabled and user has transitioning facilities', async () => {
    const customState = {
      ...initialState,
      user: {
        profile: {
          facilities: [
            {
              facilityId:
                CernerTransitioningFacilities.NORTH_CHICAGO.facilityId,
              isCerner: false,
            },
          ],
        },
      },
    };
    const customProps = { t5: true, facilityId: '556' };

    const { findByTestId, findByText, queryByText, container } = setup(
      customState,
      customProps,
    );

    await findByText(alertT5.alertTitle);
    expect(container.textContent).to.contain(alertT5.alertContent);
    expect(container.textContent).to.contain(alertT5.alertContent2);
    const findFacilityLink = await findByTestId('find-facility-action-link');
    expect(findFacilityLink).to.exist;
    expect(queryByText(alertT30.alertTitle)).to.be.null;
  });

  describe('cross-app navigation link', () => {
    it('renders VaLinkAction for /find-locations (cross-app destination)', async () => {
      const customState = {
        ...initialState,
        user: {
          profile: {
            facilities: [
              {
                facilityId:
                  CernerTransitioningFacilities.NORTH_CHICAGO.facilityId,
                isCerner: false,
              },
            ],
          },
        },
      };
      const customProps = { t5: true, facilityId: '556' };

      const { findByTestId } = setup(customState, customProps);

      const findFacilityLink = await findByTestId('find-facility-action-link');

      // Verify it's a va-link-action (VaLinkAction, not RouterLinkAction)
      // This is critical: /find-locations is a different SPA, so we need
      // VaLinkAction for full browser navigation, not React Router
      expect(findFacilityLink.tagName).to.equal('VA-LINK-ACTION');
      expect(findFacilityLink.getAttribute('href')).to.equal('/find-locations');
      expect(findFacilityLink.getAttribute('text')).to.equal(
        'Find your VA health facility',
      );
    });
  });
});
