import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseCommonCarrierFields from '../../../../components/complex-claims/pages/ExpenseCommonCarrierFields';
import {
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_REASONS,
} from '../../../../constants';

describe('ExpenseCommonCarrierFields', () => {
  const defaultProps = {
    formState: {
      transportationType: '',
      transportationReason: '',
    },
    onChange: sinon.spy(),
  };

  it('renders transportation type radio group with options', () => {
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} />,
    );

    const radio = container.querySelector(
      'va-radio[name="transportationType"]',
    );
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal('Type of transportation');
    expect(radio.getAttribute('value')).to.equal('');

    // Get all radio options and check by value instead of label
    const radioOptions = container.querySelectorAll('va-radio-option');
    const values = Array.from(radioOptions).map(opt =>
      opt.getAttribute('value'),
    );

    // Check that all expected options are present
    TRANSPORTATION_OPTIONS.forEach(option => {
      expect(values).to.include(option);
    });

    // Check that all options are unchecked
    radioOptions.forEach(radioOption => {
      expect(radioOption.getAttribute('checked')).to.equal('false');
    });
  });

  it('renders transportation reason radio group with options', () => {
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} />,
    );

    const radio = container.querySelector(
      'va-radio[name="transportationReason"]',
    );
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Why did you choose to use public transportation?',
    );
    expect(radio.getAttribute('value')).to.equal('');

    // Get all radio options and check by value instead of label
    const radioOptions = container.querySelectorAll('va-radio-option');
    const values = Array.from(radioOptions).map(opt =>
      opt.getAttribute('value'),
    );

    // Check that all expected keys are present
    Object.keys(TRANSPORTATION_REASONS).forEach(key => {
      expect(values).to.include(key);
    });

    // Check that all options are unchecked
    radioOptions.forEach(option => {
      expect(option.getAttribute('checked')).to.equal('false');
    });
  });

  it('marks the correct transportationType as checked', () => {
    const selectedType = TRANSPORTATION_OPTIONS[1];

    const formState = {
      transportationType: selectedType,
      transportationReason: '',
    };
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} formState={formState} />,
    );

    // Verify the selected option is checked by value
    const selectedRadio = container.querySelector(
      `va-radio-option[value="${selectedType}"]`,
    );
    expect(selectedRadio).to.exist;
    expect(selectedRadio.getAttribute('checked')).to.equal('true');

    // Verify all others are NOT checked
    TRANSPORTATION_OPTIONS.filter(option => option !== selectedType).forEach(
      option => {
        const radio = container.querySelector(
          `va-radio-option[value="${option}"]`,
        );
        expect(radio).to.exist;
        expect(radio.getAttribute('checked')).to.equal('false');
      },
    );
  });

  it('marks the correct transportationReason as checked', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];

    const formState = {
      transportationType: '',
      transportationReason: firstKey,
    };
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} formState={formState} />,
    );

    // Verify the selected option is checked by value
    const selectedRadio = container.querySelector(
      `va-radio-option[value="${firstKey}"]`,
    );
    expect(selectedRadio).to.exist;
    expect(selectedRadio.getAttribute('checked')).to.equal('true');

    // Verify all others are NOT checked
    Object.keys(TRANSPORTATION_REASONS)
      .filter(key => key !== firstKey)
      .forEach(key => {
        const radio = container.querySelector(
          `va-radio-option[value="${key}"]`,
        );
        expect(radio).to.exist;
        expect(radio.getAttribute('checked')).to.equal('false');
      });
  });

  // For some reason these tests are passing locally but not with the Node 22 compatibility Check
  // Updated to use direct event dispatching - testing if Node 22 compatibility issue is resolved
  it('checks the transportation type after selection', () => {
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseCommonCarrierFields formState={{}} onChange={onChangeSpy} />,
    );

    const radioGroup = container.querySelector(
      'va-radio[name="transportationType"]',
    );
    radioGroup.dispatchEvent(
      new CustomEvent('vaValueChange', {
        detail: { value: TRANSPORTATION_OPTIONS[0] },
        bubbles: true,
        composed: true,
      }),
    );

    expect(onChangeSpy.calledOnce).to.be.true;
    expect(onChangeSpy.firstCall.args[0].value).to.equal(
      TRANSPORTATION_OPTIONS[0],
    );
    expect(onChangeSpy.firstCall.args[1]).to.equal('transportationType');
  });

  // Updated to use direct event dispatching - testing if Node 22 compatibility issue is resolved
  it('checks the transportation reason after selection', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];
    const onChangeSpy = sinon.spy();
    const { container } = render(
      <ExpenseCommonCarrierFields formState={{}} onChange={onChangeSpy} />,
    );

    const radioGroup = container.querySelector(
      'va-radio[name="transportationReason"]',
    );
    radioGroup.dispatchEvent(
      new CustomEvent('vaValueChange', {
        detail: { value: firstKey },
        bubbles: true,
        composed: true,
      }),
    );

    expect(onChangeSpy.calledOnce).to.be.true;
    expect(onChangeSpy.firstCall.args[0].value).to.equal(firstKey);
    expect(onChangeSpy.firstCall.args[1]).to.equal('transportationReason');
  });
});
