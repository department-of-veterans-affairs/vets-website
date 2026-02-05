import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import {
  fetchDebtLetters,
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  setActiveDebt,
  DEBTS_SET_ACTIVE_DEBT,
} from '../../combined/actions/debts';
import {
  getAllCopayStatements,
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
} from '../../combined/actions/copays';

describe('Debt Portal Actions', () => {
  describe('fetchDebtLetters', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = sinon.spy();
    });

    it('should handle successful response', () => {
      const mockResponse = {
        debts: [
          {
            deductionCode: '30',
            currentAr: 100,
            debtHistory: [
              {
                date: '2024-01-01',
              },
            ],
          },
        ],
        hasDependentDebts: false,
      };

      mockApiRequest(mockResponse);

      return fetchDebtLetters(dispatch, true).then(() => {
        const allCalls = dispatch.getCalls().map(call => call.args[0]);

        // First call: DEBTS_FETCH_INITIATED
        expect(allCalls[0]).to.eql({
          type: DEBTS_FETCH_INITIATED,
        });

        // Last call: DEBTS_FETCH_SUCCESS with data
        expect(allCalls[allCalls.length - 1]).to.eql({
          type: DEBTS_FETCH_SUCCESS,
          debts: mockResponse.debts,
          hasDependentDebts: mockResponse.hasDependentDebts,
        });
      });
    });

    it('should handle error response', () => {
      // Provide null response with `false` to indicate failure
      mockApiRequest(null, false);

      return fetchDebtLetters(dispatch, true).then(() => {
        const allCalls = dispatch.getCalls().map(call => call.args[0]);

        expect(allCalls[0]).to.eql({
          type: DEBTS_FETCH_INITIATED,
        });
        // Next call: DEBTS_FETCH_FAILURE
        expect(allCalls[1]).to.contain({
          type: DEBTS_FETCH_FAILURE,
        });
      });
    });
  });

  describe('setActiveDebt', () => {
    it('should return the correct action', () => {
      const debt = { id: 1, amount: 100 };
      const action = setActiveDebt(debt);
      expect(action).to.eql({
        type: DEBTS_SET_ACTIVE_DEBT,
        debt,
      });
    });
  });
});

describe('Copay Actions', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = sinon.spy();
  });

  it('should handle successful copay statements fetch', () => {
    const mockResponse = {
      data: [
        {
          station: {
            facilitYNum: '123',
            city: 'Washington',
            facilityName: '123',
          },
        },
      ],
    };
    mockApiRequest(mockResponse);
    return getAllCopayStatements(dispatch).then(() => {
      const allCalls = dispatch.getCalls().map(call => call.args[0]);

      // First call to MCP_STATEMENTS_FETCH_INIT
      expect(allCalls[0]).to.eql({
        type: MCP_STATEMENTS_FETCH_INIT,
      });

      // Last call to MCP_STATEMENTS_FETCH_SUCCESS with response data
      expect(allCalls[allCalls.length - 1]).to.eql({
        type: MCP_STATEMENTS_FETCH_SUCCESS,
        response: mockResponse.data,
      });
    });
  });
});
