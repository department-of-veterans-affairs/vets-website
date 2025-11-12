import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ExpenseCommonCarrierFields from '../../../../components/complex-claims/pages/ExpenseCommonCarrierFields';
import {
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_REASONS,
} from '../../../../constants';
import { testVaRadioSelection } from '../../../../util/testing-input-helpers';

describe('ExpenseCommonCarrierFields', () => {
  const defaultProps = {
    formState: {
      carrierType: '',
      reasonNotUsingPOV: '',
    },
    onChange: sinon.spy(),
  };

  it('renders transportation type radio group with options', () => {
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} />,
    );

    const radio = container.querySelector('va-radio[name="carrierType"]');
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal('Type of transportation');
    expect(radio.getAttribute('value')).to.equal('');

    TRANSPORTATION_OPTIONS.forEach(option => {
      const radioOption = container.querySelector(
        `va-radio-option[label="${option}"]`,
      );
      expect(radioOption).to.exist;
      expect(radioOption.getAttribute('checked')).to.equal('false');
    });
  });

  it('renders transportation reason radio group with options', () => {
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} />,
    );

    // Radio group container
    const radio = container.querySelector('va-radio[name="reasonNotUsingPOV"]');
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Why did you choose to use public transportation?',
    );
    expect(radio.getAttribute('value')).to.equal('');

    // Query all radio-option children
    const radioOptions = radio.querySelectorAll('va-radio-option');

    // Ensure the correct number of options rendered
    expect(radioOptions.length).to.equal(
      Object.keys(TRANSPORTATION_REASONS).length,
    );
  });

  it('marks the correct carrierType as checked', () => {
    const selectedType = TRANSPORTATION_OPTIONS[1];

    const formState = {
      carrierType: selectedType,
      reasonNotUsingPOV: '',
    };
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} formState={formState} />,
    );

    // Get Radio Group for Transportation Types and Check an option
    const radioGroup = container.querySelector(
      'va-radio[label="Type of transportation"]',
    );
    expect(radioGroup).to.exist;
    fireEvent(
      radioGroup,
      new CustomEvent('vaValueChange', {
        detail: { value: selectedType },
      }),
    );

    // Verify the selected option is checked
    const selectedOption = container.querySelector(
      `va-radio-option[label="${selectedType}"]`,
    );
    expect(selectedOption).to.exist;
    expect(selectedOption.hasAttribute('checked')).to.be.true;
  });

  it('marks the correct reasonNotUsingPOV as checked', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];
    const firstLabel = TRANSPORTATION_REASONS[firstKey].label;

    const formState = {
      carrierType: '',
      reasonNotUsingPOV: firstKey,
    };
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} formState={formState} />,
    );

    // Get Radio Group for Transportation Reasons and Check an option
    const radioGroup = container.querySelector(
      'va-radio[label="Why did you choose to use public transportation?"]',
    );
    expect(radioGroup).to.exist;
    fireEvent(
      radioGroup,
      new CustomEvent('vaValueChange', {
        detail: { value: firstKey },
      }),
    );

    // Verify the selected option is checked
    const radioOptions = radioGroup.querySelectorAll('va-radio-option');
    const selectedOption = Array.from(radioOptions).find(
      opt => opt.getAttribute('label') === firstLabel,
    );
    expect(selectedOption).to.exist;
    expect(selectedOption.hasAttribute('checked')).to.be.true;
  });

  it('checks the transportation type after selection', () => {
    testVaRadioSelection({
      Component: ExpenseCommonCarrierFields,
      radioName: 'carrierType',
      selectValue: TRANSPORTATION_OPTIONS[0],
      formStateKey: 'carrierType',
    });
  });

  it('checks the transportation reason after selection', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];
    testVaRadioSelection({
      Component: ExpenseCommonCarrierFields,
      radioName: 'reasonNotUsingPOV',
      selectValue: firstKey,
      formStateKey: 'reasonNotUsingPOV',
    });
  });
});
