/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as UI from 'platform/utilities/ui';
import * as FT from 'platform/utilities/feature-toggles';
import MyEligibilityAndBenefits from '../../../containers/MyEligibilityAndBenefits';

const sandbox = sinon.createSandbox();

const makeStore = state => {
  const dispatch = sandbox.spy();
  return {
    getState: () => state,
    subscribe: () => () => {},
    dispatch,
  };
};

const renderPage = state =>
  render(
    <Provider store={makeStore(state)}>
      <MemoryRouter
        initialEntries={[
          '/careers-employment/vocational-rehabilitation/your-eligibility-and-benefits',
        ]}
      >
        <Route path="/careers-employment/vocational-rehabilitation/your-eligibility-and-benefits">
          <MyEligibilityAndBenefits />
        </Route>
      </MemoryRouter>
    </Provider>,
  );

const makeAttrs = ({
  recommendation = 'eligible',
  resCaseId = 'CASE-123',
  veteranProfile = { servicePeriod: [], characterOfDischarge: 'Honorable' },
  disabilityRating = { combinedScd: 70, scdDetails: [] },
  entitlementDetails = {
    maxCh31Entitlement: { month: 48, days: 0 },
    entitlementUsed: { month: 12, days: 0 },
    ch31EntitlementRemaining: { month: 36, days: 0 },
  },
  irndDate = '2020-01-01',
  eligibilityTerminationDate = '2030-01-01',
} = {}) => ({
  resEligibilityRecommendation: recommendation,
  resCaseId,
  veteranProfile,
  disabilityRating,
  entitlementDetails,
  irndDate,
  eligibilityTerminationDate,
});

const makeState = ({
  loading = false,
  error = null,
  attrs = null,
  toggleOn = true,
} = {}) => ({
  featureToggles: {
    loading: false,
    vre_eligibility_status_updates: toggleOn,
  },
  ch31Eligibility: {
    loading,
    error,
    data: attrs ? { data: { attributes: attrs } } : null,
  },
});

beforeEach(() => {
  // Neutralize DOM side effects
  sandbox.stub(UI, 'scrollToTop');
  sandbox.stub(UI, 'focusElement');

  // Force the feature toggle ON for all tests
  sandbox.stub(FT, 'useFeatureToggle').returns({
    useToggleValue: () => true,
    TOGGLE_NAMES: {
      vre_eligibility_status_updates: 'vreEligibilityStatusUpdates',
    },
  });
});

afterEach(() => {
  sandbox.restore();
});

describe('<MyEligibilityAndBenefits> early-return branches', () => {
  it('shows loading indicator when loading is true', () => {
    const { getByText, container } = renderPage(makeState({ loading: true }));
    getByText('Your VR&E eligibility and benefits');
    expect(container.querySelector('va-loading-indicator')).to.exist;
  });

  it('shows warning alert for 400', () => {
    const { getByText, container } = renderPage(
      makeState({ error: { status: 400 } }),
    );
    getByText('Your VR&E eligibility and benefits');
    expect(container.querySelector('va-alert[status="error"]')).to.exist;
    getByText('We can’t load the eligibility details right now');

    const cta = container.querySelector('va-link-action');
    expect(cta, 'va-link-action not found').to.exist;
    expect(cta.getAttribute('text')).to.equal('Apply for VR&E benefits');
    expect(cta.getAttribute('href')).to.equal(
      '/careers-employment/vocational-rehabilitation/apply-vre-form-28-1900/#',
    );
  });

  it('shows warning alert for 403', () => {
    const { getByText, container } = renderPage(
      makeState({ error: { status: 403 } }),
    );
    getByText('Your VR&E eligibility and benefits');
    expect(container.querySelector('va-alert[status="error"]')).to.exist;
  });

  it('shows error alert for non-400/403 errors', () => {
    const { getByText, container } = renderPage(
      makeState({ error: { status: 500 } }),
    );
    getByText('Your VR&E eligibility and benefits');
    expect(container.querySelector('va-alert[status="error"]')).to.exist;
    getByText('We can’t load the eligibility details right now');
  });

  it('returns null when not loading/no error and no attributes yet', () => {
    const { container } = renderPage(makeState({ attrs: null }));
    expect(container.textContent.trim()).to.equal('');
  });
});

describe('<MyEligibilityAndBenefits> recommendation branches', () => {
  it('renders success alert when recommendation is "eligible"', () => {
    const attrs = makeAttrs({ recommendation: 'eligible', resCaseId: 'OK' });
    const { getByRole, getByText, container } = renderPage(
      makeState({ attrs }),
    );

    getByRole('heading', { name: /You meet the basic eligibility criteria/i });
    expect(container.querySelector('va-alert[status="success"]')).to.exist;

    getByText('Result');
    getByText(/Total months of entitlement/i);
    getByText(/Months of entitlement you have used for education\/training/i);
    getByText(
      /Potential months of remaining entitlement toward Chapter 31 program/i,
    );

    const resultRow = getByText('Result').closest('div');
    expect(resultRow && resultRow.textContent).to.match(/eligible to apply/i);

    const cta = container.querySelector('va-link-action');
    expect(cta).to.exist;
    expect(cta.getAttribute('text')).to.equal('Apply for VR&E benefits');
  });

  it('renders ineligible warning (has RES case id) when "ineligible" & resCaseId present', () => {
    const attrs = makeAttrs({ recommendation: 'ineligible', resCaseId: 'HAS' });
    const { getByText, container } = renderPage(makeState({ attrs }));

    getByText(
      /Our records indicate you don’t meet the basic eligibility criteria/i,
    );
    expect(container.querySelector('va-alert[status="warning"]')).to.exist;
  });
});

describe('<MyEligibilityAndBenefits> content details', () => {
  it('shows Veteran profile, SCD details, dates, and Rudisill link', () => {
    const attrs = makeAttrs({
      recommendation: 'eligible',
      resCaseId: 'R-42',
      veteranProfile: {
        servicePeriod: [
          { serviceBeganDate: '2001-09-17', serviceEndDate: '2005-09-16' },
          { serviceBeganDate: '2006-01-01', serviceEndDate: '2010-01-01' },
        ],
        characterOfDischarge: 'Honorable',
      },
      disabilityRating: {
        combinedScd: 90,
        scdDetails: [
          { code: '1234', name: 'Knee', percentage: 30 },
          { code: '5678', name: 'Back', percentage: 60 },
        ],
      },
      entitlementDetails: {
        maxCh31Entitlement: { month: 48, days: 0 },
        entitlementUsed: { month: 18, days: 0 },
        ch31EntitlementRemaining: { month: 30, days: 0 },
      },
      irndDate: '2015-05-05',
      eligibilityTerminationDate: '2035-12-31',
    });

    const { getByRole, getByText, container } = renderPage(
      makeState({ attrs }),
    );

    getByRole('heading', { name: /^Basic eligibility criteria$/i });

    getByText(/Character of Discharge:\s+Honorable/);
    getByText(/1234 - Knee - 30%/);
    getByText(/5678 - Back - 60%/);
    getByText(/^Result$/);

    const resultRow = getByText('Result').closest('div');
    expect(resultRow && resultRow.textContent).to.match(/eligible to apply/i);

    getByText(/^Initial rating notification date:/);
    getByText(/^Eligibility termination date:/);

    const rudisill = container.querySelector(
      'va-link[href="https://benefits.va.gov/GIBILL/rudisill.asp"]',
    );
    expect(rudisill, 'Rudisill va-link not found').to.exist;
    expect(rudisill.getAttribute('text')).to.equal(
      'Find out more about requesting a Rudisill review',
    );
  });
});
