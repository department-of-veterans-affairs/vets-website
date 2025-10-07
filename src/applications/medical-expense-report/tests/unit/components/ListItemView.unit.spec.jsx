import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ListItemView from '../../../components/ListItemView';

describe('ListItemView', () => {
  it('should render without crashing', () => {
    const { container } = render(<ListItemView title="Test Title" />);
    expect(container).to.exist;
  });

  it('should display the title prop', () => {
    const testTitle = 'Medical Expense Provider';
    const { container } = render(<ListItemView title={testTitle} />);

    const heading = container.querySelector('h3');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal(testTitle);
  });

  it('should have the correct CSS classes', () => {
    const { container } = render(<ListItemView title="Test Title" />);

    const heading = container.querySelector('h3');
    expect(heading.className).to.include('vads-u-font-size--h5');
    expect(heading.className).to.include('vads-u-margin-y--1');
    expect(heading.className).to.include('vads-u-margin-right--2');
  });
});
