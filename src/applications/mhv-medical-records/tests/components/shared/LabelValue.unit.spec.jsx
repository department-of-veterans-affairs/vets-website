import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import LabelValue from '../../../components/shared/LabelValue';

// These tests validate: dynamic element selection, children precedence,
// empty fallback handling, monospace styling, and custom header/testId props.

describe('LabelValue (shared)', () => {
  it('renders default <p> element when no element prop provided', () => {
    const { getByTestId } = render(
      <LabelValue label="Default" value="Sample" testId="lv-default" />,
    );
    const el = getByTestId('lv-default');
    expect(el.tagName).to.equal('P');
    expect(el.textContent).to.equal('Sample');
  });

  it('renders custom element tag when element prop supplied', () => {
    const { getByTestId } = render(
      <LabelValue
        label="Custom"
        value="Custom Value"
        element="span"
        testId="lv-custom"
      />,
    );
    const el = getByTestId('lv-custom');
    expect(el.tagName).to.equal('SPAN');
    expect(el.textContent).to.equal('Custom Value');
  });

  it('prioritizes children over value', () => {
    const { getByTestId } = render(
      <LabelValue label="Child" value="Ignored" testId="lv-children">
        Actual Child
      </LabelValue>,
    );
    expect(getByTestId('lv-children').textContent).to.equal('Actual Child');
  });

  it('uses ifEmpty placeholder when value is empty and no children provided', () => {
    const { getByTestId } = render(
      <LabelValue label="Empty" value="" ifEmpty="N/A" testId="lv-empty" />,
    );
    expect(getByTestId('lv-empty').textContent).to.equal('N/A');
  });

  it('applies monospace class when monospace is true', () => {
    const { getByTestId } = render(
      <LabelValue label="Mono" value="Fixed" monospace testId="lv-mono" />,
    );
    const el = getByTestId('lv-mono');
    expect(el.className).to.contain('monospace');
  });

  it('displays the label and value (basic sanity)', () => {
    const { getByText } = render(
      <LabelValue label="Test Label" value="Test Value" />,
    );
    expect(getByText('Test Label')).to.exist;
    expect(getByText('Test Value')).to.exist;
  });

  it('handles empty value with ifEmpty text', () => {
    const { getByText } = render(
      <LabelValue label="Empty Value" value={null} ifEmpty="No Value" />,
    );
    expect(getByText('No Value')).to.exist;
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
    expect(container.querySelector('.custom-class')).to.exist;
    expect(container.querySelector('[data-testid="custom-test-id"]')).to.exist;
  });
});
