import { expect } from 'chai';

import {
  setEditingContext,
  clearEditingContext,
  setPendingEditedData,
} from './index';

import {
  createSetEditContext,
  createClearEditContext,
  createSetPendingEditedData,
} from '../../actions/edit';

import appReducer from '../index';
import { EDITING_PAGE_NAMES } from '../../utils/appConstants';

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
    describe('createSetPendingEditedData', () => {
      describe('setPendingEditedData', () => {
        it('should set pending data for demographics', () => {
          const action = createSetPendingEditedData(
            { some: 'value' },
            EDITING_PAGE_NAMES.DEMOGRAPHICS,
          );
          const demographics = { some: 'old-value', foo: 'bar' };
          const state = setPendingEditedData(
            { veteranData: { demographics }, context: {} },
            action,
          );

          expect(state.context.pendingEdits).to.be.an('object');
          expect(state.context.pendingEdits).haveOwnProperty('demographics');
          expect(state.context.pendingEdits.demographics).to.be.an('object');
          expect(state.context.pendingEdits.demographics).haveOwnProperty(
            'some',
          );
          expect(state.context.pendingEdits.demographics.some).to.equal(
            'value',
          );
          expect(state.context.pendingEdits.demographics).haveOwnProperty(
            'foo',
          );
          expect(state.context.pendingEdits.demographics.foo).to.equal('bar');
        });
        it('returns default state if a invalid page is supplied', () => {
          const action = createSetPendingEditedData(
            { some: 'value' },
            'not-a-page',
          );
          const state = setPendingEditedData({}, action);
          expect(state).to.be.empty;
        });
        it('uses pending edits if they exist', () => {
          const action = createSetPendingEditedData(
            { some: 'new-value' },
            EDITING_PAGE_NAMES.DEMOGRAPHICS,
          );
          const demographics = { some: 'old-value', foo: 'bar' };
          const context = {
            pendingEdits: {
              demographics: {
                some: 'old-value',
                foo: 'qux',
              },
            },
          };
          const state = setPendingEditedData(
            { veteranData: { demographics }, context },
            action,
          );
          expect(state.context.pendingEdits).to.be.an('object');
          expect(state.context.pendingEdits).haveOwnProperty('demographics');
          expect(state.context.pendingEdits.demographics).to.be.an('object');
          expect(state.context.pendingEdits.demographics).haveOwnProperty(
            'some',
          );
          expect(state.context.pendingEdits.demographics.some).to.equal(
            'new-value',
          );
          expect(state.context.pendingEdits.demographics).haveOwnProperty(
            'foo',
          );
          expect(state.context.pendingEdits.demographics.foo).to.equal('qux');
        });
      });
      describe('reducer is called; finds the correct handler', () => {
        it('should set correct data', () => {
          const action = createSetPendingEditedData(
            { some: 'value' },
            EDITING_PAGE_NAMES.DEMOGRAPHICS,
          );
          const demographics = { some: 'old-value', foo: 'bar' };
          const state = appReducer.checkInData(
            { veteranData: { demographics }, context: {} },
            action,
          );
          expect(state.context.pendingEdits).to.be.an('object');
          expect(state.context.pendingEdits).haveOwnProperty('demographics');
          expect(state.context.pendingEdits.demographics).to.be.an('object');
          expect(state.context.pendingEdits.demographics).haveOwnProperty(
            'some',
          );
          expect(state.context.pendingEdits.demographics.some).to.equal(
            'value',
          );
          expect(state.context.pendingEdits.demographics).haveOwnProperty(
            'foo',
          );
          expect(state.context.pendingEdits.demographics.foo).to.equal('bar');
        });
      });
    });
  });
});
