import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import CernerFacilityAlert from '../../components/CernerFacilityAlert/CernerFacilityAlert';
import { CernerAlertContent } from '../../components/CernerFacilityAlert/constants';
import mockData from '../fixtures/cerner-facility-mock-data.json';

describe('CernerFacilityAlert', () => {
  const initialState = {
    drupalStaticData: mockData.drupalStaticData,
    user: {
      profile: {
        facilities: [],
        userAtPretransitionedOhFacility: true,
        userFacilityReadyForInfoAlert: false,
      },
    },
  };

  const setup = (state = initialState, props = {}) => {
    return renderWithStoreAndRouter(<CernerFacilityAlert {...props} />, {
      initialState: state,
    });
  };

  describe('when user has no Cerner facilities', () => {
    it('does not render alert', () => {
      const screen = setup(
        {
          ...initialState,
          user: {
            profile: {
              facilities: [],
              userAtPretransitionedOhFacility: false,
              userFacilityReadyForInfoAlert: false,
            },
          },
        },
        CernerAlertContent.MEDICATIONS,
      );

      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });

  describe('when user has one Cerner facility', () => {
    const stateWithOneFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
    };

    it('renders alert with single facility text', () => {
      const screen = setup(
        stateWithOneFacility,
        CernerAlertContent.MEDICATIONS,
      );

      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
      expect(screen.getByTestId('single-cerner-facility-text')).to.exist;
      expect(screen.getByText('VA Spokane health care', { exact: false })).to
        .exist;
    });

    it('displays correct domain text in body', () => {
      const screen = setup(stateWithOneFacility, {
        ...CernerAlertContent.MEDICATIONS,
      });

      const bodyText = screen.getByTestId('single-cerner-facility-text')
        .textContent;
      expect(bodyText).to.include('medications');
    });

    it('displays facility name in bold', () => {
      const screen = setup(
        stateWithOneFacility,
        CernerAlertContent.MEDICATIONS,
      );

      const facilityElement = screen.getByText('VA Spokane health care');
      expect(facilityElement.tagName).to.equal('STRONG');
    });
  });

  describe('when user has multiple Cerner facilities', () => {
    const stateWithMultipleFacilities = {
      ...initialState,
      user: {
        profile: {
          facilities: [
            { facilityId: '668', isCerner: true },
            { facilityId: '692', isCerner: true },
          ],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
    };

    it('renders alert with list of facilities', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.MEDICATIONS,
      );

      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
      const facilityList = screen.getAllByTestId('cerner-facility');
      expect(facilityList.length).to.equal(2);
    });

    it('displays all facility names', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.MEDICATIONS,
      );

      expect(screen.getByText('VA Spokane health care')).to.exist;
      expect(screen.getByText('VA Southern Oregon health care')).to.exist;
    });

    it('displays correct plural text for multiple facilities', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.MEDICATIONS,
      );

      const headingText = screen.getAllByText(/these facilities/i);
      expect(headingText).to.exist;
    });
  });

  describe('link behavior', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
    };

    it('renders My VA Health link with correct href', () => {
      const screen = setup(stateWithFacility, CernerAlertContent.MEDICATIONS);

      const link = screen.getByTestId('cerner-facility-action-link');
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.include(
        '/pages/medications/current',
      );
    });

    it('calls onLinkClick callback when provided', () => {
      const onLinkClick = sinon.spy();
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.SECURE_MESSAGING,
        onLinkClick,
      });

      const link = screen.getByTestId('cerner-facility-action-link');
      link.click();

      expect(onLinkClick.calledOnce).to.be.true;
    });

    it('has proper security attributes', () => {
      const screen = setup(stateWithFacility, CernerAlertContent.MEDICATIONS);

      const link = screen.getByTestId('cerner-facility-action-link');
      expect(link.getAttribute('rel')).to.equal('noopener noreferrer');
    });

    it('does not render yellow alert when domain is mhv-landing-page', () => {
      const screen = setup(
        stateWithFacility,
        CernerAlertContent.MHV_LANDING_PAGE,
      );

      // Yellow alert should be suppressed on MHV landing page
      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
    });
  });

  describe('with custom text props', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
    };

    it('respects custom props', () => {
      const screen = setup(stateWithFacility, {
        linkPath: '/custom/path',
        domain: 'tests',
        headline: 'To manage test page from',
        bodyIntro: 'Custom intro text.',
        bodyActionSingle: 'Custom single action',
      });

      expect(screen.getAllByText(/To manage test page from this facility/i)).to
        .exist;
      expect(screen.getByText(/Custom intro text/i)).to.exist;
      expect(screen.getByText(/Custom single action/i)).to.exist;
    });
  });

  describe('with apiError prop', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
    };

    it('adds extra margin when apiError is true', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        apiError: true,
      });

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.getAttribute('class')).to.include('vads-u-margin-top--2');
    });
  });

  describe('alert styling', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: false,
        },
      },
    };

    it('has warning status', () => {
      const screen = setup(stateWithFacility, CernerAlertContent.MEDICATIONS);

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.getAttribute('status')).to.equal('warning');
    });

    it('applies custom className', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        className: 'custom-test-class',
      });

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.getAttribute('class')).to.include('custom-test-class');
    });
  });

  describe('with forceHideInfoAlert prop', () => {
    it('shows standard yellow alert when forceHideInfoAlert is true even when info flag is true', () => {
      const stateWithFacility = {
        ...initialState,
        user: {
          profile: {
            facilities: [{ facilityId: '668', isCerner: true }],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: true,
          },
        },
      };

      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        forceHideInfoAlert: true,
      });

      expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    });

    it('shows info alert when forceHideInfoAlert is false', () => {
      const stateWithFacility = {
        ...initialState,
        user: {
          profile: {
            facilities: [{ facilityId: '668', isCerner: true }],
            userAtPretransitionedOhFacility: true,
            userFacilityReadyForInfoAlert: true,
          },
        },
      };

      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        forceHideInfoAlert: false,
      });

      expect(screen.getByTestId('cerner-facilities-info-alert')).to.exist;
    });
  });

  describe('info alert behavior', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
          userAtPretransitionedOhFacility: true,
          userFacilityReadyForInfoAlert: true,
        },
      },
    };

    it('renders the info alert when userFacilityReadyForInfoAlert flag is true', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
      });

      expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
      const infoAlert = screen.getByTestId('cerner-facilities-info-alert');
      expect(infoAlert).to.exist;
      expect(infoAlert.getAttribute('status')).to.equal('info');
      // Trigger should use the provided infoAlertActionPhrase from props
      expect(infoAlert.getAttribute('trigger')).to.equal(
        `You can now ${
          CernerAlertContent.MEDICATIONS.infoAlertActionPhrase
        } for all VA facilities right here`,
      );
      expect(screen.getByTestId('cerner-facility-info-text')).to.exist;
    });

    it('adds margin class when apiError is true on info alert', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        apiError: true,
      });

      const infoAlert = screen.getByTestId('cerner-facilities-info-alert');
      expect(infoAlert.getAttribute('class')).to.include(
        'vads-u-margin-top--2',
      );
    });

    it('uses infoAlertHeadline when provided (Secure Messaging)', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.SECURE_MESSAGING,
      });

      const infoAlert = screen.getByTestId('cerner-facilities-info-alert');
      expect(infoAlert).to.exist;
      // When infoAlertHeadline is supplied, the trigger should exactly match it
      expect(infoAlert.getAttribute('trigger')).to.equal(
        CernerAlertContent.SECURE_MESSAGING.infoAlertHeadline,
      );
    });

    it('displays composed text with infoAlertText when provided (Medications)', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
      });

      const infoText = screen.getByTestId('cerner-facility-info-text');
      expect(infoText.textContent).to.include(
        `We've brought all your VA health care data together so you can manage your care in one place.`,
      );
      expect(infoText.textContent).to.include(
        CernerAlertContent.MEDICATIONS.infoAlertText,
      );
    });

    it('displays composed text with infoAlertText when provided (Secure Messaging)', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.SECURE_MESSAGING,
      });

      const infoText = screen.getByTestId('cerner-facility-info-text');
      expect(infoText.textContent).to.include(
        `We've brought all your VA health care data together so you can manage your care in one place.`,
      );
      expect(infoText.textContent).to.include(
        CernerAlertContent.SECURE_MESSAGING.infoAlertText,
      );
    });

    it('displays only base text when infoAlertText is not provided', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MHV_LANDING_PAGE,
        domain: 'test-domain', // Override domain to allow alert to render
      });

      const infoText = screen.getByTestId('cerner-facility-info-text');
      const baseText = `We've brought all your VA health care data together so you can manage your care in one place.`;
      expect(infoText.textContent).to.include(baseText);
      // Verify no additional text is appended after the base message
      expect(infoText.textContent).to.include('Still want to use My VA Health');
    });
  });
});
