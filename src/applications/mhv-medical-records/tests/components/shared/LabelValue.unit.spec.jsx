import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import LabelValue from '../../../components/shared/LabelValue';

describe('LabelValue', () => {
  it('displays the label and value', () => {
    const { getByText } = render(
      <LabelValue label="Test Label" value="Test Value" />,
    );
    expect(getByText('Test Label')).to.not.be.null;
    expect(getByText('Test Value')).to.not.be.null;
  });

  it('handles empty value with ifEmpty text', () => {
    const { getByText } = render(
      <LabelValue label="Test Label" value={null} ifEmpty="No Value" />,
    );
    expect(getByText('No Value')).to.not.be.null;
  });

  it('renders children instead of value', () => {
    const { getByText } = render(
      <LabelValue label="Test Label">Child Content</LabelValue>,
    );
    expect(getByText('Child Content')).to.not.be.null;
  });

  it('applies the headerClass and testId attributes correctly', () => {
    const { container } = render(
      <LabelValue
        label="Styled Label"
        value="Styled Value"
        headerClass="custom-class"
        testId="custom-test-id"
      />,
    );
    expect(container.querySelector('.custom-class')).to.not.be.null;
    expect(container.querySelector('[data-testid="custom-test-id"]')).to.not.be
      .null;
  });
});
