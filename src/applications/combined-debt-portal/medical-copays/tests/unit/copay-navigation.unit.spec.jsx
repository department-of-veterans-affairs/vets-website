import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import * as redux from 'react-redux';
import * as featureToggleHook from 'platform/utilities/feature-toggles';

import OverviewPage from '../../containers/SummaryPage';

describe('CDP – Copay OverviewPage (unit)', () => {
  const copayId = 'f4385298-08a6-42f8-a86f-50e97033fb85';

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(featureToggleHook, 'useFeatureToggle').returns({
      useToggleValue: () => false,
      useToggleLoadingValue: () => false,
      TOGGLE_NAMES: {
        showVHAPaymentHistory: 'showVHAPaymentHistory',
        showCDPOneThingPerPage: 'showCDPOneThingPerPage',
      },
    });

    sandbox.stub(redux, 'useSelector').callsFake(selector =>
      selector({
        combinedPortal: {
          debtLetters: {
            debts: [],
            isError: false,
            isPending: false,
            isProfileUpdating: false,
          },
          mcp: {
            pending: false,
            error: null,
            statements: [
              {
                id: copayId,
                pSFacilityNum: '123',
                pSStatementDate: '2019-11-15',
              },
            ],
          },
        },
      }),
    );

    sandbox
      .stub(require('../../components/Balances'), 'default')
      .callsFake(({ statements }) => (
        <div data-testid={`balance-card-${statements[0].id}`}>
          <span data-testid={`amount-${statements[0].id}`}>$15.00</span>
          <span data-testid={`facility-city-${statements[0].id}`}>
            Ralph H. Johnson Department of Veterans Affairs Medical Center
          </span>
          <a
            data-testid={`detail-link-${statements[0].id}`}
            href={`/manage-va-debt/detail/${statements[0].id}`}
          >
            View details
          </a>
        </div>
      ));

    sandbox
      .stub(require('../../components/HowToPay'), 'default')
      .callsFake(() => <div data-testid="how-to-pay" />);

    sandbox
      .stub(require('../../components/FinancialHelp'), 'default')
      .callsFake(() => <div data-testid="financial-help" />);

    sandbox
      .stub(require('../../components/DisputeCharges'), 'default')
      .callsFake(() => <div data-testid="dispute-charges" />);

    sandbox
      .stub(require('../../components/BalanceQuestions'), 'default')
      .callsFake(() => <div data-testid="balance-questions" />);

    sandbox
      .stub(require('../../components/NeedHelpCopay'), 'default')
      .callsFake(() => <div data-testid="need-help" />);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('summary page content', () => {
    it('displays copay balances - C12576', () => {
      const screen = render(<OverviewPage />);

      expect(screen.getByTestId('summary-page-title')).to.exist;
      expect(screen.getByTestId(`balance-card-${copayId}`)).to.exist;

      expect(screen.getByTestId(`amount-${copayId}`)).to.have.text('$15.00');

      expect(screen.getByTestId(`facility-city-${copayId}`)).to.have.text(
        'Ralph H. Johnson Department of Veterans Affairs Medical Center',
      );
    });

    it('displays helper components', () => {
      const screen = render(<OverviewPage />);

      expect(screen.getByTestId('how-to-pay')).to.exist;
      expect(screen.getByTestId('financial-help')).to.exist;
      expect(screen.getByTestId('dispute-charges')).to.exist;
      expect(screen.getByTestId('balance-questions')).to.exist;

      // One-thing-per-page OFF → NeedHelpCopay should not render
      expect(screen.queryByTestId('need-help')).to.not.exist;
    });

    it('renders link to copay detail page - C12577', () => {
      const screen = render(<OverviewPage />);

      const link = screen.getByTestId(`detail-link-${copayId}`);

      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal(
        `/manage-va-debt/detail/${copayId}`,
      );
    });
  });
});
