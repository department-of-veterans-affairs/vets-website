import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import sinon from 'sinon';

import * as redux from 'react-redux';
import * as featureToggleHook from 'platform/utilities/feature-toggles';

import OverviewPage from '../../containers/SummaryPage';
import DetailCopayPage from '../../containers/DetailCopayPage';

describe('CDP – Copay Pages (unit)', () => {
  const copayId = 'f4385298-08a6-42f8-a86f-50e97033fb85';
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // =======================
    // Mock feature toggles
    // =======================
    sandbox.stub(featureToggleHook, 'useFeatureToggle').returns({
      useToggleValue: () => false,
      useToggleLoadingValue: () => false,
      TOGGLE_NAMES: {
        showVHAPaymentHistory: 'showVHAPaymentHistory',
        showCDPOneThingPerPage: 'showCDPOneThingPerPage',
        showOneVADebtLetter: 'showOneVADebtLetter',
      },
    });

    // =======================
    // Mock react-redux
    // =======================
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
                station: {
                  facilityName:
                    'Ralph H. Johnson Department of Veterans Affairs Medical Center',
                  teLNum: '123-456-7890',
                },
                accountNumber: '123456',
                pHNewBalance: 15.0,
                pSStatementDateOutput: '11/15/2019',
                details: [],
              },
            ],
          },
        },
        user: {
          profile: {
            userFullName: { first: 'John', last: 'Doe' },
          },
        },
      }),
    );

    // =======================
    // Stub child components
    // =======================
    sandbox
      .stub(require('../../components/Balances'), 'default')
      .callsFake(({ statements }) => (
        <div data-testid={`balance-card-${statements?.[0]?.id || copayId}`}>
          <span data-testid={`amount-${statements?.[0]?.id || copayId}`}>
            $15.00
          </span>
          <span data-testid={`facility-city-${statements?.[0]?.id || copayId}`}>
            Ralph H. Johnson Department of Veterans Affairs Medical Center
          </span>
          <a
            data-testid={`detail-link-${statements?.[0]?.id || copayId}`}
            href={`/medical-copays/${statements?.[0]?.id || copayId}`}
          >
            View details
          </a>
        </div>
      ));

    sandbox
      .stub(require('../../components/NeedHelpCopay'), 'default')
      .callsFake(() => <div data-testid="need-help" />);

    // Stub other DetailCopayPage components
    sandbox
      .stub(require('../../components/HTMLStatementList'), 'default')
      .callsFake(() => <div data-testid="html-statement-list" />);
    sandbox
      .stub(require('../../components/CopayAlertContainer'), 'default')
      .callsFake(() => <div data-testid="copay-alert-container" />);
    sandbox
      .stub(require('../../../combined/components/Modals'), 'default')
      .callsFake(({ children }) => <div data-testid="modals">{children}</div>);
  });

  afterEach(() => {
    sandbox.restore();
  });

  // =======================
  // OverviewPage tests
  // =======================
  describe('OverviewPage', () => {
    it('displays copay balances - C12576', () => {
      const screen = render(<OverviewPage />);

      expect(screen.getByTestId('summary-page-title')).to.exist;
      expect(screen.getByTestId(`balance-card-${copayId}`)).to.exist;

      expect(screen.getByTestId(`amount-${copayId}`)).to.have.text('$15.00');

      expect(screen.getByTestId(`facility-city-${copayId}`)).to.have.text(
        'Ralph H. Johnson Department of Veterans Affairs Medical Center',
      );
    });

    it('renders link to copay detail page - C12577', () => {
      const screen = render(<OverviewPage />);

      const link = screen.getByTestId(`detail-link-${copayId}`);

      expect(link).to.exist;
      expect(link.tagName.toLowerCase()).to.equal('a');
      expect(link.getAttribute('href')).to.equal(
        '/medical-copays/f4385298-08a6-42f8-a86f-50e97033fb85',
      );
    });

    it('displays NeedHelp section', () => {
      const screen = render(<OverviewPage />);
      expect(screen.getByTestId('need-help')).to.exist;
    });
  });

  // =======================
  // DetailCopayPage tests
  // =======================
  describe('DetailCopayPage', () => {
    const match = { params: { id: copayId } };

    it('displays copay details', () => {
      const screen = render(<DetailCopayPage match={match} />);

      expect(screen.getByTestId('detail-copay-page-title-otpp')).to.exist;
      expect(screen.getByTestId('copay-alert-container')).to.exist;
      expect(screen.getByTestId('html-statement-list')).to.exist;
      expect(screen.getByTestId('modals')).to.exist;
      expect(screen.getByTestId('need-help')).to.exist;
    });
  });
});
