import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import UnifiedLabAndTestObservations from '../../../components/LabsAndTests/UnifiedLabAndTestObservations';

describe('UnifiedLabAndTestObservations Component', () => {
  const mockResults = [
    {
      testCode: 'Test Code 1',
      value: { text: 'Value 1' },
      referenceRange: 'Range 1',
      status: 'Status 1',
      bodySite: 'Body Site 1',
      sampleTested: 'Sample 1',
      comments: 'Comment 1',
    },
    {
      testCode: 'Test Code 2',
      value: { text: 'Value 2' },
      referenceRange: 'Range 2',
      status: 'Status 2',
    },
  ];

  it('renders the component with provided results', () => {
    const screen = render(
      <UnifiedLabAndTestObservations results={mockResults} />,
    );

    expect(screen.getByText('Test Code 1')).to.exist;
    expect(screen.getByText('Value 1')).to.exist;
    expect(screen.getByText('Range 1')).to.exist;
    expect(screen.getByText('Status 1')).to.exist;
    expect(screen.getByText('Body Site 1')).to.exist;
    expect(screen.getByText('Sample 1')).to.exist;
    expect(screen.getByText('Comment 1')).to.exist;

    expect(screen.getByText('Test Code 2')).to.exist;
    expect(screen.getByText('Value 2')).to.exist;
    expect(screen.getByText('Range 2')).to.exist;
    expect(screen.getByText('Status 2')).to.exist;
  });

  it('does not render optional fields if they are not provided', () => {
    const screen = render(
      <UnifiedLabAndTestObservations results={mockResults} />,
    );

    expect(screen.queryByText('Body Site 2')).not.to.exist;
    expect(screen.queryByText('Sample 2')).not.to.exist;
    expect(screen.queryByText('Comment 2')).not.to.exist;
  });
});
