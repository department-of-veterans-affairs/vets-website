import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as uiModule from '~/platform/utilities/ui';

import { useDirectDepositEffects } from '../../hooks/useDirectDepositEffects';
import { toggleDirectDepositEdit } from '../../actions/directDeposit';
import { DIRECT_DEPOSIT_ALERT_SETTINGS } from '../../constants';

const TestComponent = ({ props }) => {
  useDirectDepositEffects(props);
  return <div>Test Component</div>;
};

TestComponent.propTypes = {
  props: PropTypes.object.isRequired,
};

const mockStore = configureMockStore([thunk]);

describe('useDirectDepositEffects hook', () => {
  let sandbox;
  let mockSetFormData;
  let mockSetShowUpdateSuccess;
  let mockEditButtonRef;
  let focusElementStub;
  let dispatchSpy;

  const defaultProps = {
    wasSaving: false,
    wasEditing: false,
    saveError: null,
    ui: {
      isSaving: false,
      isEditing: false,
    },
    setShowUpdateSuccess: () => {},
    setFormData: () => {},
    editButtonRef: { current: null },
    cardHeadingId: 'test-heading',
    hasUnsavedFormEdits: false,
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockStore({});

    mockSetFormData = sandbox.spy();
    mockSetShowUpdateSuccess = sandbox.spy();
    mockEditButtonRef = { current: document.createElement('button') };
    dispatchSpy = sandbox.spy();
    focusElementStub = sandbox
      .stub(uiModule, 'focusElement')
      .callsFake(() => {});
    sandbox.stub(ReactRedux, 'useDispatch').returns(dispatchSpy);

    // Create a DOM element for focusElement to target
    const focusTarget = document.createElement('div');
    focusTarget.setAttribute('data-focus-target', '');
    document.body.appendChild(focusTarget);

    // Mock document methods
    Object.defineProperty(document, 'title', {
      writable: true,
      value: '',
    });

    // Mock window.onbeforeunload
    Object.defineProperty(window, 'onbeforeunload', {
      writable: true,
      value: undefined,
    });
  });

  afterEach(() => {
    sandbox.restore();
    // Clean up DOM
    const focusTarget = document.querySelector('[data-focus-target]');
    if (focusTarget) {
      document.body.removeChild(focusTarget);
    }
  });

  describe('page setup effect', () => {
    it('sets document title', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            setFormData: mockSetFormData,
          }}
        />,
      );

      expect(document.title).to.equal(
        'Direct Deposit Information | Veterans Affairs',
      );
    });

    it('dispatches toggleDirectDepositEdit(false)', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            setFormData: mockSetFormData,
          }}
        />,
      );

      expect(dispatchSpy.calledWith(toggleDirectDepositEdit(false))).to.be.true;
    });

    it('clears form data', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            setFormData: mockSetFormData,
          }}
        />,
      );

      expect(mockSetFormData.calledWith({})).to.be.true;
    });
  });

  describe('unsaved changes warning effect', () => {
    it('sets window.onbeforeunload when there are unsaved edits', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            hasUnsavedFormEdits: true,
          }}
        />,
      );

      expect(window.onbeforeunload).to.be.a('function');
      expect(window.onbeforeunload()).to.be.true;
    });

    it('clears window.onbeforeunload when there are no unsaved edits', () => {
      // First set it to a function
      window.onbeforeunload = () => true;

      render(
        <TestComponent
          props={{
            ...defaultProps,
            hasUnsavedFormEdits: false,
          }}
        />,
      );

      expect(window.onbeforeunload).to.be.undefined;
    });
  });

  describe('success alert effect', () => {
    it('shows success alert and clears form data after successful save', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            wasSaving: true,
            ui: { isSaving: false, isEditing: false },
            saveError: null,
            setShowUpdateSuccess: mockSetShowUpdateSuccess,
            setFormData: mockSetFormData,
          }}
        />,
      );

      expect(mockSetShowUpdateSuccess.calledWith(true)).to.be.true;
      expect(mockSetFormData.calledWith({})).to.be.true;
    });

    it('hides success alert after timeout', () => {
      const clock = sinon.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout'],
      });

      render(
        <TestComponent
          props={{
            ...defaultProps,
            wasSaving: true,
            ui: { isSaving: false, isEditing: false },
            saveError: null,
            setShowUpdateSuccess: mockSetShowUpdateSuccess,
            setFormData: mockSetFormData,
          }}
        />,
      );

      // Advance time by the timeout duration
      clock.tick(DIRECT_DEPOSIT_ALERT_SETTINGS.TIMEOUT);

      expect(mockSetShowUpdateSuccess.calledWith(false)).to.be.true;
      clock.restore();
    });

    it('does not show success alert when save is in progress', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            wasSaving: true,
            ui: { isSaving: true, isEditing: false },
            saveError: null,
            setShowUpdateSuccess: mockSetShowUpdateSuccess,
          }}
        />,
      );

      expect(mockSetShowUpdateSuccess.called).to.be.false;
    });

    it('does not show success alert when there is a save error', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            wasSaving: true,
            ui: { isSaving: false, isEditing: false },
            saveError: { message: 'Error' },
            setShowUpdateSuccess: mockSetShowUpdateSuccess,
          }}
        />,
      );

      expect(mockSetShowUpdateSuccess.called).to.be.false;
    });

    it('does not show success alert when wasSaving is false', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            wasSaving: false,
            ui: { isSaving: false, isEditing: false },
            saveError: null,
            setShowUpdateSuccess: mockSetShowUpdateSuccess,
          }}
        />,
      );

      expect(mockSetShowUpdateSuccess.called).to.be.false;
    });
  });

  describe('edit start effect', () => {
    it('focuses on heading and hides success alert when editing starts', () => {
      // Create a mock heading element
      const mockHeading = document.createElement('h2');
      mockHeading.id = 'test-heading';
      document.body.appendChild(mockHeading);

      render(
        <TestComponent
          props={{
            ...defaultProps,
            ui: { isSaving: false, isEditing: true },
            wasEditing: false,
            setShowUpdateSuccess: mockSetShowUpdateSuccess,
          }}
        />,
      );

      expect(mockHeading.getAttribute('tabindex')).to.equal('-1');
      expect(mockSetShowUpdateSuccess.calledWith(false)).to.be.true;

      // Cleanup
      document.body.removeChild(mockHeading);
    });

    it('does not focus when heading is not found', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            ui: { isSaving: false, isEditing: true },
            wasEditing: false,
            cardHeadingId: 'non-existent-heading',
            setShowUpdateSuccess: mockSetShowUpdateSuccess,
          }}
        />,
      );

      expect(mockSetShowUpdateSuccess.calledWith(false)).to.be.true;
    });

    it('does not trigger when editing state does not change', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            ui: { isSaving: false, isEditing: true },
            wasEditing: true,
            setShowUpdateSuccess: mockSetShowUpdateSuccess,
          }}
        />,
      );

      expect(mockSetShowUpdateSuccess.called).to.be.false;
    });
  });

  describe('edit end effect', () => {
    it('does not focus when edit state does not change', () => {
      render(
        <TestComponent
          props={{
            ...defaultProps,
            ui: { isSaving: false, isEditing: false },
            wasEditing: false,
            editButtonRef: mockEditButtonRef,
          }}
        />,
      );

      expect(focusElementStub.called).to.be.false;
    });
  });
});
