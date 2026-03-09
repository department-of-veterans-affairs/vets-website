import React from 'react';
import { expect } from 'chai';
import MockDate from 'mockdate';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles/useFeatureToggle';

import reducer from '../../redux/reducer';
import TravelPayStatusContent from '../../components/TravelPayStatusContent';

describe('TravelPayStatusContent', () => {
  const getState = ({
    hasComplexClaimsFeatureFlag = false,
    hasClaimDetailsFeatureFlag = false,
    hasClaimsMgmtFeatureFlag = false,
    loadingClaims = false,
    claimsData = {},
  } = {}) => ({
    featureToggles: {
      loading: false,
      [TOGGLE_NAMES.travelPayEnableComplexClaims]: hasComplexClaimsFeatureFlag,
      [TOGGLE_NAMES.travelPayViewClaimDetails]: hasClaimDetailsFeatureFlag,
      [TOGGLE_NAMES.travelPayClaimsManagement]: hasClaimsMgmtFeatureFlag,
    },
    travelPay: {
      travelClaims: {
        isLoading: loadingClaims,
        claims: claimsData,
      },
    },
  });

  const renderComponent = (stateOptions = {}) => {
    return renderWithStoreAndRouter(<TravelPayStatusContent />, {
      initialState: getState(stateOptions),
      reducers: reducer,
    });
  };

  beforeEach(() => {
    MockDate.set('2024-06-25');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('when complexClaimsEnabled is true', () => {
    it('renders complex claims heading', () => {
      const screen = renderComponent({ hasComplexClaimsFeatureFlag: true });

      expect(screen.getByText('File a new claim for travel pay online')).to
        .exist;
    });

    it('renders past appointments link', () => {
      renderComponent({ hasComplexClaimsFeatureFlag: true });

      expect($('va-link-action[text="Go to your past appointments"]')).to.exist;
    });

    it('renders BTSSS fallback guidance', () => {
      const screen = renderComponent({ hasComplexClaimsFeatureFlag: true });

      expect(screen.getByText(/Beneficiary Travel Self Service System/i)).to
        .exist;
      expect($('va-link[text="Go to the BTSSS website"]')).to.exist;
    });

    it('renders the saved claims note', () => {
      const screen = renderComponent({ hasComplexClaimsFeatureFlag: true });

      expect(screen.getByText(/You can continue saved or incomplete claims/i))
        .to.exist;
    });

    it('renders the complex claims list description', () => {
      const screen = renderComponent({ hasComplexClaimsFeatureFlag: true });

      expect(
        screen.getByText(
          /This list shows all the travel reimbursement claims you've started or filed/i,
        ),
      ).to.exist;
    });

    it('renders complex claims content instead of SMOC content', () => {
      const screen = renderComponent({
        hasComplexClaimsFeatureFlag: true,
      });

      expect(screen.getByText('File a new claim for travel pay online')).to
        .exist;
      expect(
        screen.queryByText('File a new claim for travel reimbursement online'),
      ).to.be.null;
    });
  });

  describe('when complexClaimsEnabled is false', () => {
    it('renders SMOC heading', () => {
      const screen = renderComponent();

      expect(
        screen.getByText('File a new claim for travel reimbursement online'),
      ).to.exist;
    });

    it('renders mileage-only guidance', () => {
      const screen = renderComponent();

      expect(screen.getByText(/claiming mileage only/i)).to.exist;
    });

    it('renders past appointments link', () => {
      renderComponent();

      expect($('va-link-action[text="Go to your past appointments"]')).to.exist;
    });

    it('renders BTSSS link for other expenses', () => {
      renderComponent();

      expect($('va-link[text="Beneficiary Travel Self-Service System"]')).to
        .exist;
    });

    it('renders the SMOC claims list description', () => {
      const screen = renderComponent();

      expect(
        screen.getByText(
          /This list shows all the appointments you've filed a travel claim for/i,
        ),
      ).to.exist;
    });

    it('does not render complex claims content', () => {
      const screen = renderComponent();

      expect(screen.queryByText('File a new claim for travel pay online')).to.be
        .null;
    });
  });
});
