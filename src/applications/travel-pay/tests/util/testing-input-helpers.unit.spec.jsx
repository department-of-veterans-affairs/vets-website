import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  simulateVaInputChange,
  simulateVaDateChange,
  testVaRadioSelection,
  simulateVaInputBlur,
} from '../../util/testing-input-helpers';

// Dummy component for radio tests
// eslint-disable-next-line react/prop-types
const DummyRadioComponent = ({ formState = {}, onChange }) => {
  const handleChange = value => {
    if (onChange) onChange({ value }, 'testField');
  };

  return (
    <VaRadio
      name="testRadio"
      value={formState.testField || ''}
      onVaValueChange={e => handleChange(e.detail.value)}
    >
      <va-radio-option
        value="option1"
        checked={formState.testField === 'option1'}
      />
      <va-radio-option
        value="option2"
        checked={formState.testField === 'option2'}
      />
    </VaRadio>
  );
};

describe('helper functions', () => {
  describe('simulateVaInputChange', () => {
    it('should update value and fire events', () => {
      const input = document.createElement('input');

      const eventsFired = [];
      input.addEventListener('input', e => eventsFired.push(e));

      const result = simulateVaInputChange(input, 'test value');

      expect(result).to.exist;
      expect(result.value).to.equal('test value');
      expect(input.value).to.equal('test value');

      const firstEventValue = eventsFired[0].detail?.value || input.value;
      expect(firstEventValue).to.equal('test value');
      expect(result.eventFired).to.be.true;
    });

    it('should return null if inputField is not provided', () => {
      const result = simulateVaInputChange(null, 'value');
      expect(result).to.be.null;
    });
  });

  describe('simulateVaDateChange', () => {
    it('should update value and fire events', () => {
      const dateInput = document.createElement('input');
      const eventSpy = sinon.spy();
      dateInput.addEventListener('dateChange', eventSpy);

      const value = '2025-11-05';
      const result = simulateVaDateChange(dateInput, value);

      expect(result).to.exist;
      expect(result.value).to.equal(value);
      expect(dateInput.value).to.equal(value);
      expect(eventSpy.calledOnce).to.be.true;
      expect(result.eventFired).to.be.true;
    });

    it('should return null if dateField is not provided', () => {
      const result = simulateVaDateChange(null, '2025-11-05');
      expect(result).to.be.null;
    });
  });

  describe('testVaRadioSelection', () => {
    it('should select a radio option and update state', () => {
      const {
        updatedState,
        onChangeSpy,
        selectedOption,
      } = testVaRadioSelection({
        Component: DummyRadioComponent,
        radioName: 'testRadio',
        selectValue: 'option1',
        formStateKey: 'testField',
        initialState: { testField: '' },
      });

      expect(onChangeSpy.calledOnce).to.be.true;
      expect(updatedState.testField).to.equal('option1');
      expect(selectedOption).to.exist;
      expect(selectedOption.getAttribute('checked')).to.equal('true');
    });
  });

  describe('simulateVaInputBlur', () => {
    it('should update the value and fire a bubbling focusout event', () => {
      // 1. Setup the dummy element
      const input = document.createElement('input');
      const eventSpy = sinon.spy();

      // We listen for 'focusout' because that is what React's onBlur uses
      // and what the updated helper dispatches.
      input.addEventListener('focusout', eventSpy);

      // 2. Execute the helper
      const testValue = 'United Airlines';
      const result = simulateVaInputBlur(input, testValue);

      // 3. Assertions
      expect(result).to.exist;
      expect(input.value).to.equal(testValue);
      expect(result.value).to.equal(testValue);

      // Verify event was fired
      expect(eventSpy.calledOnce).to.be.true;

      // Verify event properties (Critical for Shadow DOM and React)
      const event = eventSpy.firstCall.args[0];
      expect(event.type).to.equal('focusout');
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should return null if no input field is provided', () => {
      const result = simulateVaInputBlur(null, 'test');
      expect(result).to.be.null;
    });
  });
});
