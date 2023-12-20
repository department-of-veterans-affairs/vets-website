import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import RepTypeSelector from '../../components/search/RepTypeSelector';

describe('RepTypeSelector component', () => {
  it('should render', () => {
    const mockOnChange = () => {};

    const { container } = render(
      <RepTypeSelector onChange={mockOnChange} representativeType="officer" />,
    );

    expect($('va-radio', container)).to.exist;
  });

  it('should render the first va-radio-option as checked', () => {
    const { container } = render(
      <RepTypeSelector onChange={() => {}} representativeType="officer" />,
    );

    // Select the first va-radio-option
    const radioOption = container.querySelector(
      'va-radio-option[label="Veteran Service Officer"]',
    );

    // Assert that the first va-radio-option is present and checked
    expect(radioOption).to.exist;
    expect(radioOption).to.have.attr('checked', 'true');
  });
});
