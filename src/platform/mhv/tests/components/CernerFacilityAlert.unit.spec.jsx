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
          user: { profile: { facilities: [] } },
        },
        CernerAlertContent.LABS_AND_TESTS,
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
        },
      },
    };

    it('renders alert with single facility text', () => {
      const screen = setup(
        stateWithOneFacility,
        CernerAlertContent.LABS_AND_TESTS,
      );

      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
      expect(screen.getByTestId('single-cerner-facility-text')).to.exist;
      expect(screen.getByText('VA Spokane health care', { exact: false })).to
        .exist;
    });

    it('displays correct domain text in body', () => {
      const screen = setup(stateWithOneFacility, {
        ...CernerAlertContent.LABS_AND_TESTS,
      });

      const bodyText = screen.getByTestId('single-cerner-facility-text')
        .textContent;
      expect(bodyText).to.include('medical records');
    });

    it('displays facility name in bold', () => {
      const screen = setup(stateWithOneFacility, CernerAlertContent.VACCINES);

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
        },
      },
    };

    it('renders alert with list of facilities', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.VITALS,
      );

      expect(screen.getByTestId('cerner-facilities-alert')).to.exist;
      const facilityList = screen.getAllByTestId('cerner-facility');
      expect(facilityList.length).to.equal(2);
    });

    it('displays all facility names', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.ALLERGIES,
      );

      expect(screen.getByText('VA Spokane health care')).to.exist;
      expect(screen.getByText('VA Southern Oregon health care')).to.exist;
    });

    it('displays correct plural text for multiple facilities', () => {
      const screen = setup(
        stateWithMultipleFacilities,
        CernerAlertContent.CARE_SUMMARIES_AND_NOTES,
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
        },
      },
    };

    it('renders My VA Health link with correct href', () => {
      const screen = setup(stateWithFacility, CernerAlertContent.MEDICATIONS);

      const link = screen.getByText('Go to My VA Health');
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

      const link = screen.getByText('Go to My VA Health');
      link.click();

      expect(onLinkClick.calledOnce).to.be.true;
    });

    it('has proper security attributes', () => {
      const screen = setup(
        stateWithFacility,
        CernerAlertContent.LABS_AND_TESTS,
      );

      const link = screen.getByText('Go to My VA Health');
      expect(link.getAttribute('rel')).to.equal('noopener noreferrer');
    });
  });

  describe('with custom text props', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
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
        },
      },
    };

    // TODO: look at implementation in Meds for when this is used for errors
    it.skip('adds extra margin when apiError is true', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.MEDICATIONS,
        apiError: true,
      });

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.className).to.include('vads-u-margin-top--2');
    });
  });

  describe('alert styling', () => {
    const stateWithFacility = {
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '668', isCerner: true }],
        },
      },
    };

    it('has warning status', () => {
      const screen = setup(stateWithFacility, CernerAlertContent.VITALS);

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.getAttribute('status')).to.equal('warning');
    });

    // TODO: Need to investigate, not quite right
    it.skip('applies custom className', () => {
      const screen = setup(stateWithFacility, {
        ...CernerAlertContent.VACCINES,
        className: 'custom-test-class',
      });

      const alert = screen.getByTestId('cerner-facilities-alert');
      expect(alert.classname).to.include('custom-test-class');
    });
  });
});
