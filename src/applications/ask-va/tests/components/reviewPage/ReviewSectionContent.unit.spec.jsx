import React from 'react';
import { render } from '@testing-library/react';
import { getByText, queryByText } from '@testing-library/dom';
import { expect } from 'chai';
import sinon from 'sinon';
import ReviewSectionContent from '../../../components/reviewPage/ReviewSectionContent';

describe('<ReviewSectionContent />', () => {
  const mockTitle = 'Test Section';
  const mockEditSection = sinon.spy();
  const mockKeys = ['school_name', 'school_address'];
  const mockItems = [
    { key: 'school', name: 'School Name', data: 'XYZ University' },
    { key: 'school', name: 'Address', data: '123 Main St' },
    { key: 'empty', name: 'Should Not Render', data: null }, // Should be filtered out
  ];

  it('renders without crashing', () => {
    render(
      <ReviewSectionContent
        title={mockTitle}
        editSection={mockEditSection}
        keys={mockKeys}
        items={mockItems}
      />,
    );
  });

  it('displays the provided title', () => {
    render(
      <ReviewSectionContent
        title={mockTitle}
        editSection={mockEditSection}
        keys={mockKeys}
        items={mockItems}
      />,
    );

    expect(getByText(document.body, mockTitle)).to.exist;
  });

  it('renders only items with valid data', () => {
    render(
      <ReviewSectionContent
        title={mockTitle}
        editSection={mockEditSection}
        keys={mockKeys}
        items={mockItems}
      />,
    );

    expect(getByText(document.body, 'School Name')).to.exist;
    expect(getByText(document.body, 'XYZ University')).to.exist;
    expect(getByText(document.body, 'Address')).to.exist;
    expect(getByText(document.body, '123 Main St')).to.exist;

    // Ensure the item with null data is NOT rendered
    expect(queryByText(document.body, 'Should Not Render')).to.be.null;
  });
});
