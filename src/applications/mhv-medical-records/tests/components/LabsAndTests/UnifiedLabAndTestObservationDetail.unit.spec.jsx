import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import UnifiedLabAndTestObservationDetail from '../../../components/LabsAndTests/UnifiedLabAndTestObservationDetail';

describe('UnifiedLabAndTestObservationDetail', () => {
  it('renders the header and value correctly', () => {
    const screen = render(
      <UnifiedLabAndTestObservationDetail
        header="Test Header"
        value="Test Value"
        ddActionName="test-action"
      />,
    );

    expect(screen.getByText('Test Header')).to.exist;
    expect(screen.getByText('Test Value')).to.exist;
  });

  it('renders the emptyMessage when value is not provided', () => {
    const screen = render(
      <UnifiedLabAndTestObservationDetail
        header="Test Header"
        ddActionName="test-action"
        emptyMessage="No data available"
      />,
    );

    expect(screen.getByText('Test Header')).to.exist;
    expect(screen.getByText('No data available')).to.exist;
  });

  it('applies the correct data-dd-action-name attribute', () => {
    const screen = render(
      <UnifiedLabAndTestObservationDetail
        header="Test Header"
        value="Test Value"
        ddActionName="test-action"
      />,
    );

    expect(
      screen.getByTestId('lab-and-test-observation-message-detail'),
    ).to.have.attribute('data-dd-action-name', 'test-action');
  });
});
