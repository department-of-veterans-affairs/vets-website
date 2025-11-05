import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  simulateVaInputChange,
  simulateVaDateChange,
  testVaRadioSelection,
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
    it('should update value, fire events, and call onInput', () => {
      const input = document.createElement('input');
      const onInputSpy = sinon.spy();
      input.onInput = onInputSpy;

      const result = simulateVaInputChange(input, 'test value');

      expect(result).to.exist;
      expect(result.value).to.equal('test value');
      expect(input.value).to.equal('test value');
      expect(onInputSpy.calledOnce).to.be.true;
      expect(result.eventFired).to.be.true;
    });

    it('should return null if inputField is not provided', () => {
      const result = simulateVaInputChange(null, 'value');
      expect(result).to.be.null;
    });
  });

  describe('simulateVaDateChange', () => {
    it('should update value, fire events, and call onDateChange', () => {
      const dateInput = document.createElement('input');
      const onDateChangeSpy = sinon.spy();
      dateInput.onDateChange = onDateChangeSpy;

      const value = '2025-11-05';
      const result = simulateVaDateChange(dateInput, value);

      expect(result).to.exist;
      expect(result.value).to.equal(value);
      expect(dateInput.value).to.equal(value);
      expect(onDateChangeSpy.calledOnce).to.be.true;
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
});
