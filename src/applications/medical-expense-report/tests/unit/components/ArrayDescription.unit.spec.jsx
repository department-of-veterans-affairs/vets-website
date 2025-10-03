import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ArrayDescription from '../../../components/ArrayDescription';

describe('ArrayDescription', () => {
  it('should display the message prop', () => {
    const testMessage = 'Add a medical expense';
    const { container } = render(<ArrayDescription message={testMessage} />);

    const spanElement = container.querySelector('span');
    expect(spanElement).to.exist;
    expect(spanElement.textContent).to.equal(testMessage);
  });

  it('should have the correct CSS classes', () => {
    const { container } = render(<ArrayDescription message="Test message" />);

    const spanElement = container.querySelector('span');
    expect(spanElement.className).to.include('schemaform-block-title');
    expect(spanElement.className).to.include('schemaform-block-subtitle');
    expect(spanElement.className).to.include('vads-u-display--block');
    expect(spanElement.className).to.include('vads-u-padding-top--6');
    expect(spanElement.className).to.include('vads-u-padding-bottom--0p5');
  });
});
