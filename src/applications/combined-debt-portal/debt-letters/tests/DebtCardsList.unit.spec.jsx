import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import DebtCardsList from '../components/DebtCardsList';

describe('DebtLettersSummary', () => {
  const fakeStore = {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
      combinedPortal: {
        debtLetters: {
          isFetching: false,
          isError: false,
          isVBMSError: false,
          debts: [
            {
              adamKey: '1',
              fileNumber: '000000009',
              payeeNumber: '00',
              personEntitled: 'STUB_M',
              deductionCode: '21',
              benefitType: 'Loan Guaranty (Principal + Interest)',
              amountOverpaid: 0.0,
              amountWithheld: 0.0,
              originalAR: '11599',
              currentAR: '0',
              debtHistory: [
                {
                  date: '03/05/2004',
                  letterCode: '914',
                  status: 'Paid In Full',
                  description:
                    'Account balance cleared via offset, not including TOP.',
                },
              ],
              compositeDebtId: '2111599',
            },
            {
              adamKey: '2',
              fileNumber: '000000009',
              payeeNumber: '00',
              personEntitled: 'STUB_M',
              deductionCode: '30',
              benefitType: 'Comp & Pen',
              amountOverpaid: 0.0,
              amountWithheld: 0.0,
              originalAR: '13000',
              currentAR: '0',
              debtHistory: [
                {
                  date: '12/03/2008',
                  letterCode: '488',
                  status: 'Death Status - Pending Action',
                  description: 'Pending review for reclamation or next action.',
                },
                {
                  date: '02/07/2009',
                  letterCode: '905',
                  status: 'Administrative Write Off',
                  description:
                    'Full debt amount cleared by return of funds to DMC from outside entities (reclamations, insurance companies, etc.)',
                },
                {
                  date: '02/25/2009',
                  letterCode: '914',
                  status: 'Paid In Full',
                  description:
                    'Account balance cleared via offset, not including TOP.',
                },
              ],
              compositeDebtId: '301300',
            },
            {
              adamKey: '3',
              fileNumber: '000000009',
              payeeNumber: '00',
              personEntitled: 'STUB_M',
              deductionCode: '30',
              benefitType: 'Comp & Pen',
              amountOverpaid: 0.0,
              amountWithheld: 0.0,
              originalAR: '12000',
              currentAR: '0',
              debtHistory: [
                {
                  date: '09/11/1997',
                  letterCode: '914',
                  status: 'Paid In Full',
                  description:
                    'Account balance cleared via offset, not including TOP.',
                },
              ],
              compositeDebtId: '301200',
            },
            {
              adamKey: '4',
              fileNumber: '000000009',
              payeeNumber: '00',
              personEntitled: 'STUB_M',
              deductionCode: '44',
              benefitType: 'CH35 EDU',
              amountOverpaid: 16000.0,
              amountWithheld: 0.0,
              originalAR: '13000',
              currentAR: '10000',
              debtHistory: [
                {
                  date: '09/18/2012',
                  letterCode: '100',
                  status: 'First Demand Letter - Inactive Benefits',
                  description:
                    'First due process letter sent when debtor is not actively receiving any benefits.',
                },
                {
                  date: '09/28/2012',
                  letterCode: '117',
                  status: 'Second Demand Letter',
                  description:
                    'Second demand letter where debtor has no active benefits to offset so debtor is informed that debt may be referred to CRA (60 timer), TOP, CAIVRS or Cross Servicing.  CRA is only one with timer.\r\n117A - Second collections letter sent to schools',
                },
                {
                  date: '10/17/2012',
                  letterCode: '212',
                  status: 'Bad Address - Locator Request Sent',
                  description:
                    'Originates from mail room Beep File (file of bad addresses to be sent to LexisNexis).  Remains in this status until LexisNexis comes back with updated address information.',
                },
                {
                  date: '11/14/2012',
                  letterCode: '117',
                  status: 'Second Demand Letter',
                  description:
                    'Second demand letter where debtor has no active benefits to offset so debtor is informed that debt may be referred to CRA (60 timer), TOP, CAIVRS or Cross Servicing.  CRA is only one with timer.\r\n117A - Second collections letter sent to schools',
                },
                {
                  date: '12/11/2012',
                  letterCode: '510',
                  status:
                    'Mailing Status Inactive/Invalid - Forced to TOP/Cross Servicing',
                  description:
                    'Demand letters returned.  Unable to verify address with third party.  Account forced to TOP and/or CS.',
                },
                {
                  date: '04/11/2013',
                  letterCode: '080',
                  status: 'Referred To Cross Servicing',
                  description: 'Debt referred to Treasury for Cross servicing',
                },
                {
                  date: '12/19/2014',
                  letterCode: '681',
                  status: 'Returned From Cross Servicing - At TOP',
                  description:
                    'Account returned from Treasury Cross Servicing. Account is at TOP.  TOP offsets will be applied to account as Federal funds become available.',
                },
              ],
              compositeDebtId: '441300',
            },
          ],
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('renders correct number of debt cards', () => {
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtCardsList />
        </BrowserRouter>
      </Provider>,
    );
    expect(wrapper.getAllByTestId(/^summary-card-/)).to.have.lengthOf(4);
    wrapper.unmount();
  });

  it('renders the payment notice text', () => {
    const wrapper = render(
      <Provider store={fakeStore}>
        <BrowserRouter>
          <DebtCardsList />
        </BrowserRouter>
      </Provider>,
    );
    expect(
      wrapper.getByText(
        /Please note that payments may take up to 4 business days to reflect/,
      ),
    ).to.exist;
    wrapper.unmount();
  });
});
