import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import MockDate from 'mockdate';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles/useFeatureToggle';

import reducer from '../../redux/reducer';
import TravelPayStatusContent from '../../components/TravelPayStatusContent';

describe('TravelPayStatusContent', () => {
  const getState = ({
    hasSmocFeatureFlag = false,
    hasComplexClaimsFeatureFlag = false,
    hasClaimDetailsFeatureFlag = false,
    hasClaimsMgmtFeatureFlag = false,
    loadingClaims = false,
    claimsData = {},
  } = {}) => ({
    featureToggles: {
      loading: false,
      [TOGGLE_NAMES.travelPaySubmitMileageExpense]: hasSmocFeatureFlag,
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

    it('renders complex claims content even when SMOC is also enabled', () => {
      const screen = renderComponent({
        hasComplexClaimsFeatureFlag: true,
        hasSmocFeatureFlag: true,
      });

      expect(screen.getByText('File a new claim for travel pay online')).to
        .exist;
      expect(
        screen.queryByText('File a new claim for travel reimbursement online'),
      ).to.be.null;
    });
  });

  describe('when only smocEnabled is true', () => {
    it('renders SMOC heading', () => {
      const screen = renderComponent({ hasSmocFeatureFlag: true });

      expect(
        screen.getByText('File a new claim for travel reimbursement online'),
      ).to.exist;
    });

    it('renders mileage-only guidance', () => {
      const screen = renderComponent({ hasSmocFeatureFlag: true });

      expect(screen.getByText(/claiming mileage only/i)).to.exist;
    });

    it('renders past appointments link', () => {
      renderComponent({ hasSmocFeatureFlag: true });

      expect($('va-link-action[text="Go to your past appointments"]')).to.exist;
    });

    it('renders BTSSS link for other expenses', () => {
      renderComponent({ hasSmocFeatureFlag: true });

      expect($('va-link[text="Beneficiary Travel Self-Service System"]')).to
        .exist;
    });

    it('renders the SMOC claims list description', () => {
      const screen = renderComponent({ hasSmocFeatureFlag: true });

      expect(
        screen.getByText(
          /This list shows all the appointments you've filed a travel claim for/i,
        ),
      ).to.exist;
    });

    it('does not render complex claims content', () => {
      const screen = renderComponent({ hasSmocFeatureFlag: true });

      expect(screen.queryByText('File a new claim for travel pay online')).to.be
        .null;
    });
  });

  describe('when neither flag is on', () => {
    it('renders the generic fallback heading', async () => {
      const screen = renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText(
            /You can use this tool to check the status of your VA travel claims/i,
          ),
        ).to.exist;
      });
    });

    it('renders the additional info trigger', async () => {
      const screen = renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('status-explainer-link')).to.exist;
      });
    });

    it('does not render SMOC or complex claims content', () => {
      const screen = renderComponent();

      expect(screen.queryByText('File a new claim for travel pay online')).to.be
        .null;
      expect(
        screen.queryByText('File a new claim for travel reimbursement online'),
      ).to.be.null;
    });
  });
});
