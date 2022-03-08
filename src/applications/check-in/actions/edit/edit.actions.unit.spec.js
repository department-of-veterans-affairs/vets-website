import { expect } from 'chai';

import {
  SET_EDIT_CONTEXT,
  createSetEditContext,
  CLEAR_EDIT_CONTEXT,
  createClearEditContext,
  SET_PENDING_EDITED_DATA,
  createSetPendingEditedData,
} from './index';

describe('check-in', () => {
  describe('actions', () => {
    describe('createClearEditContext', () => {
      it('should return correct action', () => {
        const action = createClearEditContext({});
        expect(action.type).to.equal(CLEAR_EDIT_CONTEXT);
      });
    });
    describe('createSetEditContext', () => {
      it('should return correct action', () => {
        const action = createSetEditContext({});
        expect(action.type).to.equal(SET_EDIT_CONTEXT);
      });
      it('should return correct structure', () => {
        const action = createSetEditContext({
          originatingUrl: 'originatingUrl',
          editingPage: 'editingPage',
          value: 'value',
          key: 'key',
        });
        expect(action.payload).to.be.an('object');
        expect(action.payload.originatingUrl).to.equal('originatingUrl');
        expect(action.payload.editingPage).to.equal('editingPage');
        expect(action.payload.value).to.equal('value');
        expect(action.payload.key).to.equal('key');
      });
    });
    describe('createSetPendingEditedData', () => {
      it('should return correct action', () => {
        const action = createSetPendingEditedData({});
        expect(action.type).to.equal(SET_PENDING_EDITED_DATA);
      });
      it('should return correct structure', () => {
        const action = createSetPendingEditedData(
          {
            field1: 'field1',
          },
          'editingPage',
        );
        expect(action.payload).to.be.an('object');
        expect(action.payload.fieldsToUpdate).to.be.an('object');
        expect(action.payload.fieldsToUpdate.field1).to.equal('field1');
        expect(action.payload.editingPage).to.equal('editingPage');
      });
    });
  });
});
