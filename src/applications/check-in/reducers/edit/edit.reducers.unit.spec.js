import { expect } from 'chai';

import { setEditingContext, clearEditingContext } from './index';

import {
  createSetEditContext,
  createClearEditContext,
} from '../../actions/edit';

import appReducer from '../index';

describe('check in', () => {
  describe('pre-check-in reducers', () => {
    describe('createSetEditContext', () => {
      describe('setEditingContext', () => {
        it('should return form structure', () => {
          const action = createSetEditContext({
            originatingUrl: 'some-url',
            editingPage: 'some-page',
            value: 'some-value',
            key: 'some-key',
          });
          const state = setEditingContext({}, action);
          expect(state.context.editing).to.be.an('object');
          expect(state.context.editing).haveOwnProperty('originatingUrl');
          expect(state.context.editing).haveOwnProperty('editingPage');
          expect(state.context.editing).haveOwnProperty('value');
          expect(state.context.editing).haveOwnProperty('key');
        });

        it('should set session context data', () => {
          const action = createSetEditContext({
            originatingUrl: 'some-url',
            editingPage: 'some-page',
            value: 'some-value',
            key: 'some-key',
          });
          const state = setEditingContext({}, action);
          expect(state.context.editing).to.be.an('object');
          expect(state.context.editing.originatingUrl).to.equal('some-url');
          expect(state.context.editing.editingPage).to.equal('some-page');
          expect(state.context.editing.value).to.equal('some-value');
          expect(state.context.editing.key).to.equal('some-key');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set correct data', () => {
          const action = createSetEditContext({
            originatingUrl: 'some-url',
            editingPage: 'some-page',
            value: 'some-value',
            key: 'some-key',
          });
          const state = appReducer.checkInData(undefined, action);
          expect(state.context.editing.originatingUrl).to.equal('some-url');
          expect(state.context.editing.editingPage).to.equal('some-page');
          expect(state.context.editing.value).to.equal('some-value');
          expect(state.context.editing.key).to.equal('some-key');
        });
      });
    });
    describe('createClearEditContext', () => {
      describe('clearEditingContext', () => {
        it('should return form structure', () => {
          const editAction = createSetEditContext({
            originatingUrl: 'some-url',
            editingPage: 'some-page',
            value: 'some-value',
            key: 'some-key',
          });
          const stateWithEdit = setEditingContext({}, editAction);
          const action = createClearEditContext();
          const state = clearEditingContext(stateWithEdit, action);
          expect(state.context.editing).to.be.undefined;
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set correct data', () => {
          const editAction = createSetEditContext({
            originatingUrl: 'some-url',
            editingPage: 'some-page',
            value: 'some-value',
            key: 'some-key',
          });
          const stateWithEdit = setEditingContext({}, editAction);
          const action = createClearEditContext();
          const state = clearEditingContext(stateWithEdit, action);
          expect(state.context.editing).to.be.undefined;
        });
      });
    });
  });
});
