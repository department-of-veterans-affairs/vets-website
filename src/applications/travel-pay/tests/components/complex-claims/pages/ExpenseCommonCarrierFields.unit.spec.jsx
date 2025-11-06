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

    const radio = container.querySelector(
      'va-radio[name="transportationReason"]',
    );
    expect(radio).to.exist;
    expect(radio.getAttribute('label')).to.equal(
      'Why did you choose to use public transportation?',
    );
    expect(radio.getAttribute('value')).to.equal('');

    Object.keys(TRANSPORTATION_REASONS).forEach(key => {
      const radioOption = container.querySelector(
        `va-radio-option[label="${TRANSPORTATION_REASONS[key].label}"]`,
      );
      expect(radioOption).to.exist;
      expect(radioOption.getAttribute('checked')).to.equal('false');
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

    // Verify the selected option is checked
    const selectedRadio = container.querySelector(
      `va-radio-option[label="${selectedType}"]`,
    );
    expect(selectedRadio.getAttribute('checked')).to.equal('true');

    // Verify all others are NOT checked
    TRANSPORTATION_OPTIONS.filter(option => option !== selectedType).forEach(
      option => {
        const radio = container.querySelector(
          `va-radio-option[label="${option}"]`,
        );
        expect(radio.getAttribute('checked')).to.equal('false');
      },
    );
  });

  it('marks the correct transportationReason as checked', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];
    const firstLabel = TRANSPORTATION_REASONS[firstKey].label;

    const formState = {
      transportationType: '',
      transportationReason: firstKey,
    };
    const { container } = render(
      <ExpenseCommonCarrierFields {...defaultProps} formState={formState} />,
    );

    // Verify the selected option is checked
    const selectedRadio = container.querySelector(
      `va-radio-option[label="${firstLabel}"]`,
    );
    expect(selectedRadio.getAttribute('checked')).to.equal('true');

    // Verify all others are NOT checked
    Object.keys(TRANSPORTATION_REASONS)
      .filter(key => key !== firstKey)
      .forEach(key => {
        const { label } = TRANSPORTATION_REASONS[key];
        const radio = container.querySelector(
          `va-radio-option[label="${label}"]`,
        );
        expect(radio.getAttribute('checked')).to.equal('false');
      });
  });

  // For some reason these tests are passing locally but not with the Node 22 compatibility Check
  // Waiting to hear back from platform about how to resolve this
  it.skip('checks the transportation type after selection', () => {
    testVaRadioSelection({
      Component: ExpenseCommonCarrierFields,
      radioName: 'transportationType',
      selectValue: TRANSPORTATION_OPTIONS[0],
      formStateKey: 'transportationType',
    });
  });

  // For some reason these tests are passing locally but not with the Node 22 compatibility Check
  // Waiting to hear back from platform about how to resolve this
  it.skip('checks the transportation reason after selection', () => {
    const firstKey = Object.keys(TRANSPORTATION_REASONS)[0];
    testVaRadioSelection({
      Component: ExpenseCommonCarrierFields,
      radioName: 'transportationReason',
      selectValue: firstKey,
      formStateKey: 'transportationReason',
    });
  });
});
