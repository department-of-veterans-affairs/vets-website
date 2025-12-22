import React from 'react';
import { render } from '@testing-library/react';
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
    errors: {},
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

    const radio = container.querySelector('va-radio[name="reasonNotUsingPOV"]');
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Why did you choose to use public transportation?',
    );
    expect(radio.getAttribute('value')).to.equal('');

    const radioOptions = radio.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.equal(
      Object.keys(TRANSPORTATION_REASONS).length,
    );
  });

  it('marks the correct carrierType as checked', () => {
    const selectedType = TRANSPORTATION_OPTIONS[1];

    const { container } = render(
      <ExpenseCommonCarrierFields
        {...defaultProps}
        formState={{
          carrierType: selectedType,
          reasonNotUsingPOV: '',
        }}
      />,
    );

    const selectedOption = container.querySelector(
      `va-radio-option[label="${selectedType}"]`,
    );

    expect(selectedOption).to.exist;
    expect(selectedOption.hasAttribute('checked')).to.be.true;
  });

  it('marks correct reasonNotUsingPOV as selected via prop match', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];

    const { container } = render(
      <ExpenseCommonCarrierFields
        {...defaultProps}
        formState={{
          carrierType: '',
          reasonNotUsingPOV: firstKey,
        }}
      />,
    );

    const reasonRadios = container.querySelectorAll(
      'va-radio[name="reasonNotUsingPOV"] va-radio-option',
    );

    const selected = Array.from(reasonRadios).find(
      opt => opt.getAttribute('value') === firstKey,
    );

    expect(selected).to.exist;
    expect(selected.getAttribute('checked')).to.equal('true');
  });

  it('shows error message for carrierType when error exists', () => {
    const errorMessage = 'Select a transportation type';

    const { container } = render(
      <ExpenseCommonCarrierFields
        {...defaultProps}
        errors={{ carrierType: errorMessage }}
      />,
    );

    const radio = container.querySelector('va-radio[name="carrierType"]');
    expect(radio).to.exist;
    expect(radio.getAttribute('error')).to.equal(errorMessage);
  });

  it('shows error message for reasonNotUsingPOV when error exists', () => {
    const errorMessage = 'Select a reason';

    const { container } = render(
      <ExpenseCommonCarrierFields
        {...defaultProps}
        errors={{ reasonNotUsingPOV: errorMessage }}
      />,
    );

    const radio = container.querySelector('va-radio[name="reasonNotUsingPOV"]');
    expect(radio).to.exist;
    expect(radio.getAttribute('error')).to.equal(errorMessage);
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
