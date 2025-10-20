import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ReviewField } from './review-field';

describe('ReviewField', () => {
  it('should render label and value', () => {
    const { container } = render(
      <ReviewField label="Test Label" value="Alliance Command" />,
    );

    expect(container.textContent).to.include('Test Label');
    expect(container.textContent).to.include('Alliance Command');
  });

  it('should render empty text when value is null', () => {
    const { container } = render(
      <ReviewField label="Test Label" value={null} />,
    );

    expect(container.textContent).to.include('Test Label');
    expect(container.textContent).to.include('Not provided');
  });

  it('should render empty text when value is undefined', () => {
    const { container } = render(
      <ReviewField label="Test Label" value={undefined} />,
    );

    expect(container.textContent).to.include('Test Label');
    expect(container.textContent).to.include('Not provided');
  });

  it('should render empty text when value is empty string', () => {
    const { container } = render(<ReviewField label="Test Label" value="" />);

    expect(container.textContent).to.include('Test Label');
    expect(container.textContent).to.include('Not provided');
  });

  it('should render custom empty text', () => {
    const { container } = render(
      <ReviewField
        label="Test Label"
        value={null}
        emptyText="No data available"
      />,
    );

    expect(container.textContent).to.include('No data available');
  });

  it('should hide when value is empty and hideWhenEmpty is true', () => {
    const { container } = render(
      <ReviewField label="Test Label" value={null} hideWhenEmpty />,
    );

    expect(container.querySelector('.review-row')).to.not.exist;
  });

  it('should format value with formatter function', () => {
    const formatter = value => `Formatted: ${value}`;
    const { container } = render(
      <ReviewField label="Test Label" value="test" formatter={formatter} />,
    );

    expect(container.textContent).to.include('Formatted: test');
  });

  it('should render boolean values', () => {
    const { container } = render(
      <ReviewField label="Test Label" value={false} />,
    );

    expect(container.textContent).to.include('false');
  });

  it('should render numeric values', () => {
    const { container } = render(<ReviewField label="Test Label" value={42} />);

    expect(container.textContent).to.include('42');
  });

  it('should render zero as a value', () => {
    const { container } = render(<ReviewField label="Test Label" value={0} />);

    expect(container.textContent).to.include('0');
  });

  it('should have proper structure with dt and dd elements', () => {
    const { container } = render(
      <ReviewField label="Test Label" value="Alliance Command" />,
    );

    const reviewRow = container.querySelector('.review-row');
    expect(reviewRow).to.exist;
    expect(reviewRow.querySelector('dt')).to.exist;
    expect(reviewRow.querySelector('dd')).to.exist;
  });
});
