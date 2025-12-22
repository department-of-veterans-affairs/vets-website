import { expect } from 'chai';

import travelPayReducer from '../../redux/reducer';
import { FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS } from '../../redux/actions';

describe('Redux - reducer - expense and document transformation', () => {
  const { travelPay: reducer } = travelPayReducer;

  const defaultState = {
    travelClaims: {},
    claimDetails: {},
    appointment: {},
    claimSubmission: {},
    reviewPageAlert: null,
    complexClaim: {
      claim: {
        creation: { isLoading: false, error: null },
        submission: { id: '', isSubmitting: false, error: null, data: null },
        fetch: { isLoading: false, error: null },
        data: {
          document: null,
        },
      },
      expenses: {
        creation: { isLoading: false, error: null },
        update: { id: '', isLoading: false, error: null },
        delete: { id: '', isLoading: false, error: null },
        data: [],
      },
      documentDelete: {
        id: '',
        isLoading: false,
        error: null,
      },
    },
  };

  describe('FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS - basic transformations', () => {
    it('should preserve documentId on expense', () => {
      const expenses = [
        {
          id: 'exp-1',
          expenseType: 'Parking',
          documentId: 'doc-1',
          costRequested: 10,
        },
      ];
      const documents = [
        {
          documentId: 'doc-1',
          filename: 'receipt.pdf',
          mimetype: 'application/pdf',
          expenseId: 'exp-1',
        },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data).to.have.lengthOf(1);
      expect(result.complexClaim.expenses.data[0]).to.include({
        id: 'exp-1',
        expenseType: 'Parking',
        documentId: 'doc-1',
        costRequested: 10,
      });
    });

    it('should store original payload in claim.data with expenses and documents unchanged', () => {
      const expenses = [
        {
          id: 'exp-1',
          expenseType: 'Parking',
          documentId: 'doc-1',
        },
      ];
      const documents = [
        {
          documentId: 'doc-1',
          filename: 'receipt.pdf',
        },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.claim.data.expenses).to.equal(expenses);
      expect(result.complexClaim.claim.data.documents).to.equal(documents);
    });

    it('should preserve empty documentId for expense with no document', () => {
      const expenses = [
        {
          id: 'exp-1',
          expenseType: 'Mileage',
          documentId: '',
          costRequested: 25,
        },
      ];
      const documents = [];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data[0].documentId).to.equal('');
    });

    it('should preserve unmatched documentId on expense', () => {
      const expenses = [
        {
          id: 'exp-1',
          expenseType: 'Toll',
          documentId: 'doc-999',
          costRequested: 5,
        },
      ];
      const documents = [
        {
          documentId: 'doc-1',
          filename: 'receipt.pdf',
        },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data[0].documentId).to.equal(
        'doc-999',
      );
    });

    it('should handle multiple expenses sharing same documentId', () => {
      const expenses = [
        {
          id: 'exp-1',
          expenseType: 'Parking',
          documentId: 'doc-1',
          costRequested: 10,
        },
        {
          id: 'exp-2',
          expenseType: 'Toll',
          documentId: 'doc-1',
          costRequested: 5,
        },
      ];
      const documents = [
        {
          documentId: 'doc-1',
          filename: 'receipt.pdf',
        },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data).to.have.lengthOf(2);
      expect(result.complexClaim.expenses.data[0].documentId).to.equal('doc-1');
      expect(result.complexClaim.expenses.data[1].documentId).to.equal('doc-1');
    });

    it('should handle multiple expenses with different documents', () => {
      const expenses = [
        {
          id: 'exp-1',
          expenseType: 'Parking',
          documentId: 'doc-1',
        },
        {
          id: 'exp-2',
          expenseType: 'Toll',
          documentId: 'doc-2',
        },
        {
          id: 'exp-3',
          expenseType: 'Mileage',
          documentId: '',
        },
      ];
      const documents = [
        {
          documentId: 'doc-1',
          filename: 'parking.pdf',
        },
        {
          documentId: 'doc-2',
          filename: 'toll.pdf',
        },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data).to.have.lengthOf(3);
      expect(result.complexClaim.expenses.data[0].documentId).to.equal('doc-1');
      expect(result.complexClaim.expenses.data[1].documentId).to.equal('doc-2');
      expect(result.complexClaim.expenses.data[2].documentId).to.equal('');
    });
  });

  describe('FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS - edge cases', () => {
    it('should handle empty expenses array', () => {
      const documents = [
        {
          documentId: 'doc-1',
          filename: 'receipt.pdf',
        },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses: [],
          documents,
        },
      });

      expect(result.complexClaim.expenses.data).to.deep.equal([]);
    });

    it('should handle empty documents array', () => {
      const expenses = [
        {
          id: 'exp-1',
          documentId: 'doc-1',
        },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents: [],
        },
      });

      expect(result.complexClaim.expenses.data).to.have.lengthOf(1);
      expect(result.complexClaim.expenses.data[0].documentId).to.equal('doc-1');
    });

    it('should handle missing expenses in payload', () => {
      const documents = [{ documentId: 'doc-1' }];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          documents,
        },
      });

      expect(result.complexClaim.expenses.data).to.deep.equal([]);
    });

    it('should handle missing documents in payload', () => {
      const expenses = [{ id: 'exp-1', documentId: 'doc-1' }];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
        },
      });

      expect(result.complexClaim.expenses.data).to.have.lengthOf(1);
      expect(result.complexClaim.expenses.data[0].documentId).to.equal('doc-1');
    });

    it('should handle expense with null documentId', () => {
      const expenses = [{ id: 'exp-1', documentId: null }];
      const documents = [{ documentId: 'doc-1' }];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data[0].documentId).to.be.null;
    });

    it('should handle expense with undefined documentId', () => {
      const expenses = [{ id: 'exp-1', documentId: undefined }];
      const documents = [{ documentId: 'doc-1' }];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data[0].documentId).to.be.undefined;
    });

    it('should handle expense without documentId property', () => {
      const expenses = [{ id: 'exp-1', expenseType: 'Mileage' }];
      const documents = [{ documentId: 'doc-1' }];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data[0].documentId).to.be.undefined;
    });

    it('should keep orphaned documents in claim.data.documents', () => {
      const expenses = [{ id: 'exp-1', documentId: 'doc-1' }];
      const documents = [
        { documentId: 'doc-1', filename: 'matched.pdf' },
        { documentId: 'doc-2', filename: 'orphaned.pdf' },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.claim.data.documents).to.have.lengthOf(2);
      expect(result.complexClaim.claim.data.documents).to.equal(documents);
    });
  });

  describe('FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS - immutability', () => {
    it('should not mutate original expenses array in payload', () => {
      const expenses = [
        {
          id: 'exp-1',
          documentId: 'doc-1',
          expenseType: 'Parking',
        },
      ];
      const documents = [{ documentId: 'doc-1', filename: 'receipt.pdf' }];
      const originalExpenses = JSON.parse(JSON.stringify(expenses));

      reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(expenses).to.deep.equal(originalExpenses);
      // Verify original payload is unchanged
    });

    it('should not mutate original documents array', () => {
      const expenses = [{ id: 'exp-1', documentId: 'doc-1' }];
      const documents = [{ documentId: 'doc-1', filename: 'receipt.pdf' }];
      const originalDocuments = JSON.parse(JSON.stringify(documents));

      reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(documents).to.deep.equal(originalDocuments);
    });

    it('should create new expense objects in state', () => {
      const expenses = [{ id: 'exp-1', documentId: 'doc-1' }];
      const documents = [{ documentId: 'doc-1', filename: 'receipt.pdf' }];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data[0]).to.not.equal(expenses[0]);
    });

    it('should preserve all existing expense properties', () => {
      const expenses = [
        {
          id: 'exp-1',
          expenseType: 'Parking',
          documentId: 'doc-1',
          costRequested: 10,
          dateIncurred: '2025-10-17T21:32:16.531Z',
          description: 'Airport parking',
          name: 'Parking expense',
        },
      ];
      const documents = [{ documentId: 'doc-1', filename: 'receipt.pdf' }];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data[0]).to.deep.include({
        id: 'exp-1',
        expenseType: 'Parking',
        documentId: 'doc-1',
        costRequested: 10,
        dateIncurred: '2025-10-17T21:32:16.531Z',
        description: 'Airport parking',
        name: 'Parking expense',
      });
    });
  });

  describe('FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS - data integrity', () => {
    it('should maintain documents array order', () => {
      const expenses = [{ id: 'exp-1', documentId: 'doc-2' }];
      const documents = [
        { documentId: 'doc-1', filename: 'first.pdf' },
        { documentId: 'doc-2', filename: 'second.pdf' },
        { documentId: 'doc-3', filename: 'third.pdf' },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.claim.data.documents[0].documentId).to.equal(
        'doc-1',
      );
      expect(result.complexClaim.claim.data.documents[1].documentId).to.equal(
        'doc-2',
      );
      expect(result.complexClaim.claim.data.documents[2].documentId).to.equal(
        'doc-3',
      );
    });

    it('should maintain documents array content unchanged', () => {
      const expenses = [{ id: 'exp-1', documentId: 'doc-2' }];
      const documents = [
        { documentId: 'doc-1', filename: 'first.pdf' },
        { documentId: 'doc-2', filename: 'second.pdf' },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.claim.data.documents).to.have.lengthOf(2);
    });

    it('should return same number of expenses as input', () => {
      const expenses = [
        { id: 'exp-1', documentId: 'doc-1' },
        { id: 'exp-2', documentId: 'doc-2' },
        { id: 'exp-3', documentId: '' },
      ];
      const documents = [
        { documentId: 'doc-1' },
        { documentId: 'doc-2' },
        { documentId: 'doc-3' },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data).to.have.lengthOf(3);
    });

    it('should handle documents with no matching expenses', () => {
      const expenses = [{ id: 'exp-1', documentId: 'doc-1' }];
      const documents = [
        { documentId: 'doc-1', filename: 'matched.pdf' },
        { documentId: 'doc-2', filename: 'unmatched.pdf' },
        { documentId: 'doc-3', filename: 'also-unmatched.pdf' },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.claim.data.documents).to.have.lengthOf(3);
      expect(result.complexClaim.claim.data.documents[1]).to.deep.equal({
        documentId: 'doc-2',
        filename: 'unmatched.pdf',
      });
    });

    it('should maintain expenses array order', () => {
      const expenses = [
        { id: 'exp-1', documentId: 'doc-1', name: 'first' },
        { id: 'exp-2', documentId: 'doc-2', name: 'second' },
        { id: 'exp-3', documentId: 'doc-3', name: 'third' },
      ];
      const documents = [
        { documentId: 'doc-1' },
        { documentId: 'doc-2' },
        { documentId: 'doc-3' },
      ];

      const result = reducer(defaultState, {
        type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
        payload: {
          expenses,
          documents,
        },
      });

      expect(result.complexClaim.expenses.data[0].name).to.equal('first');
      expect(result.complexClaim.expenses.data[1].name).to.equal('second');
      expect(result.complexClaim.expenses.data[2].name).to.equal('third');
    });
  });
});
