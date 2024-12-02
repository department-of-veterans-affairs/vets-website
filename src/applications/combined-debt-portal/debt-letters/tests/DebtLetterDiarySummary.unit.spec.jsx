import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DebtSummaryMessage } from '../const/diary-codes/debtSummaryCardContent';

describe('DebtSummaryMessage', () => {
  it('should render the icon and message', () => {
    const MockIcon = () => <span data-testid="mock-icon">Icon</span>;
    const message = 'This is a test message';

    const { getByText, getByTestId } = render(
      <DebtSummaryMessage IconComponent={MockIcon}>
        {message}
      </DebtSummaryMessage>,
    );

    // Check if the icon is rendered
    const iconElement = getByTestId('mock-icon');
    expect(iconElement).to.exist;
    expect(iconElement.textContent).to.equal('Icon');

    // Check if the message is rendered
    const messageElement = getByText(message);
    expect(messageElement).to.exist;
    expect(messageElement.textContent).to.equal(message);
  });
});
