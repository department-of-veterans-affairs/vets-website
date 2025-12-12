import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import { createDebtsSuccess } from '../../../mocks/debts';
import { has3Copays } from '../../../mocks/medical-copays';
import BenefitPaymentsAndDebtLegacy from '../../../components/debts/DebtsLegacy';
import reducers from '../../../reducers';

const mockStore = configureStore([thunk]);

describe('<BenefitPaymentsAndDebtLegacy />', () => {
  it('displays loading indicator', () => {
    const store = mockStore({
      allDebts: {
        isLoading: true,
        debts: [],
        copays: [],
        debtsErrors: [],
        copaysErrors: [],
      },
    });

    const { getAllByTestId } = render(
      <Provider store={store}>
        <BenefitPaymentsAndDebtLegacy />
      </Provider>,
    );

    expect(getAllByTestId('debts-loading-indicator')).to.exist;
  });

  it('displays no outstanding debts text when no debts and copays', () => {
    const store = mockStore({
      allDebts: {
        isLoading: false,
        debts: [],
        copays: [],
        debtsErrors: [],
        copaysErrors: [],
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BenefitPaymentsAndDebtLegacy />
      </Provider>,
    );

    expect(getByTestId('no-outstanding-debts-text')).to.exist;
  });

  it('displays debts card when using count-only mode', () => {
    const store = mockStore({
      allDebts: {
        isLoading: false,
        debts: [],
        debtsCount: 3,
        copays: [],
        debtsErrors: [],
        copaysErrors: [],
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BenefitPaymentsAndDebtLegacy />
      </Provider>,
    );

    const header = getByTestId('debt-total-header');
    expect(header.textContent).to.equal('3 overpayment debts');
  });

  it('displays debts card when debts are present', () => {
    const store = mockStore({
      allDebts: {
        isLoading: false,
        debts: [
          {
            id: '8ce19ada-8bc1-4c35-ab5a-0f34c78c10d9',
            pSSeqNum: 8,
            pSTotSeqNum: 31,
            pSFacilityNum: '668',
            pSFacPhoneNum: '(509)434-7000',
            pSTotStatement: 40,
            pSStatementVal: '0000024882{',
            pSStatementDate: '05042022',
            pSStatementDateOutput: '05/04/2022',
            pSProcessDate: '05042022',
            pSProcessDateOutput: '05/04/2022',
            pHPatientLstNme: 'BROWN',
            pHPatientFstNme: 'JANET',
            pHPatientMidNme: null,
            pHAddress1: '5150 S LAKIN DR',
            pHAddress2: null,
            pHAddress3: null,
            pHCity: 'SPOKANE VALLEY',
            pHState: 'WA',
            pHZipCde: '992160645',
            pHZipCdeOutput: '99216-0645',
            pHCtryNme: 'US',
            pHAmtDue: 110.45,
            pHAmtDueOutput: '110.45&nbsp;&nbsp;',
            pHPrevBal: 45,
            pHPrevBalOutput: '45.00&nbsp;&nbsp;',
            pHTotCharges: 65.45,
            pHTotChargesOutput: '65.45&nbsp;&nbsp;',
            pHTotCredits: 0,
            pHTotCreditsOutput: '.00&nbsp;&nbsp;',
            pHNewBalance: 110.45,
            pHNewBalanceOutput: '110.45&nbsp;&nbsp;',
            pHSpecialNotes: null,
            pHroParaCdes: null,
            pHNumOfLines: 18,
            pHDfnNumber: 0,
            pHCernerStatementNumber: 500000000006971,
            pHCernerPatientId: '1005154223',
            pHCernerAccountNumber: '6681001005154223',
            pHIcnNumber: '1003388516V511164',
            pHAccountNumber: 0,
            pHLargeFontIndcator: 0,
            details: [
              {
                pDDatePosted: null,
                pDDatePostedOutput: '',
                pDTransDesc:
                  '03/08/2022 Interest Fee for Self-Pay Overdue Balan',
                pDTransDescOutput:
                  '03/08/2022 Interest Fee for Self-Pay Overdue Balan',
                pDTransAmt: 0.15,
                pDTransAmtOutput: '0.15&nbsp;&nbsp;',
                pDRefNo: '24208187',
              },
            ],
            station: {
              facilitYNum: '668',
              visNNum: '20',
              facilitYDesc: 'VAMC SPOKANE (668)',
              cyclENum: '003',
              remiTToFlag: 'L',
              maiLInsertFlag: '0',
              staTAddress1: '4815 N ASSEMBLY ST',
              city: 'SPOKANE',
              state: 'WA',
              ziPCde: '992056185',
              ziPCdeOutput: '99205-6185',
              baRCde: '*992056185159*',
              teLNumFlag: 'P',
              teLNum: '1-866-290-4618',
            },
          },
        ],
        copays: [],
        debtsErrors: [],
        copaysErrors: [],
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BenefitPaymentsAndDebtLegacy />
      </Provider>,
    );

    expect(getByTestId('dashboard-section-debts')).to.exist;
  });

  it('fetches debts and copays and displays them formatted', async () => {
    const initialState = {
      allDebts: {
        isLoading: false,
        debts: createDebtsSuccess().debts,
        copays: has3Copays.data,
        debtsErrors: [],
        copaysErrors: [],
      },
    };

    const { getByTestId, getByText } = renderInReduxProvider(
      <BenefitPaymentsAndDebtLegacy />,
      {
        initialState,
        reducers,
      },
    );

    await waitFor(() => {
      expect(getByTestId('copay-due-header')).to.exist;
      expect(getByText('3 copay bills')).to.exist;
    });
  });

  it('displays error message when there is a debt API error', () => {
    const store = mockStore({
      allDebts: {
        isLoading: false,
        debts: [],
        copays: [],
        debtsErrors: ['Some error'],
        copaysErrors: [],
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BenefitPaymentsAndDebtLegacy />
      </Provider>,
    );

    expect(getByTestId('outstanding-debts-error')).to.exist;
  });

  it('displays error message when there is a copays API error', () => {
    const store = mockStore({
      allDebts: {
        isLoading: false,
        debts: [],
        copays: [],
        debtsErrors: [],
        copaysErrors: ['Another error'],
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <BenefitPaymentsAndDebtLegacy />
      </Provider>,
    );

    expect(getByTestId('outstanding-debts-error')).to.exist;
  });
});
