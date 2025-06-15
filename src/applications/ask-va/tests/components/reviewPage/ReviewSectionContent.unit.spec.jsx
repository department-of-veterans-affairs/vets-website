import { getByText, queryByText } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
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

  it('should handle undefined props using defaults', () => {
    // Test with no props to cover default parameters
    render(<ReviewSectionContent />);

    // Should render without crashing, using empty arrays as defaults
    const form = document.querySelector('form.rjsf');
    expect(form).to.exist;
  });

  it('should handle items with no matching keys', () => {
    const itemsWithNoMatches = [
      { key: 'nonexistent', name: 'No Match', data: 'test' },
    ];

    render(
      <ReviewSectionContent
        title={mockTitle}
        editSection={mockEditSection}
        keys={mockKeys}
        items={itemsWithNoMatches}
      />,
    );

    // Should still render the item even if no matching key
    expect(getByText(document.body, 'No Match')).to.exist;
    expect(getByText(document.body, 'test')).to.exist;
  });

  it('should handle empty arrays and null values in arrays', () => {
    const mixedItems = [
      { key: 'school', name: 'Valid', data: 'test' },
      { key: null, name: 'Null Key', data: 'data' },
      { key: undefined, name: 'Undefined Key', data: 'data' },
    ];

    render(
      <ReviewSectionContent
        title={mockTitle}
        editSection={mockEditSection}
        keys={[]} // Empty keys array
        items={mixedItems}
      />,
    );

    // Should render valid items
    expect(getByText(document.body, 'Valid')).to.exist;
    expect(getByText(document.body, 'test')).to.exist;
  });

  it('should call editSection with correct parameters', () => {
    const editSpy = sinon.spy();
    const testKeys = ['test_key'];
    const testTitle = 'Test Title';

    render(
      <ReviewSectionContent
        title={testTitle}
        editSection={editSpy}
        keys={testKeys}
        items={[{ key: 'test', name: 'Test', data: 'value' }]}
      />,
    );

    // Click edit button
    const editButton = document.querySelector('va-button[text="Edit"]');
    editButton.click();

    // Verify editSection was called with correct parameters
    expect(editSpy.calledOnce).to.be.true;
    expect(editSpy.calledWith(testKeys, testTitle)).to.be.true;
  });
});
