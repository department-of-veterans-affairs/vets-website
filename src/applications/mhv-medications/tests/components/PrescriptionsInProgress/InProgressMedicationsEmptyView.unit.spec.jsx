import React from 'react';
import { render, within } from '@testing-library/react';
import { expect } from 'chai';
import InProgressMedicationsEmptyView from '../../../components/PrescriptionsInProgress/InProgressMedicationsEmptyView';

describe('InProgressMedicationsEmptyView Component', () => {
  const setup = () => render(<InProgressMedicationsEmptyView />);

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
    expect(screen.getByTestId('in-progress-empty-view-card')).to.exist;
  });

  it('renders the correct content', () => {
    const screen = setup();
    const { container } = screen;

    // "You don't have any..." card
    const card = within(screen.getByTestId('in-progress-empty-view-card'));
    expect(
      card.getByRole('heading', {
        level: 2,
        name: 'You don’t have any in-progress medications right now',
      }),
    ).to.exist;
    expect(
      card.getByText(
        'If you have questions about a prescription, contact your care team.',
      ),
    ).to.exist;

    // Process list content
    expect(screen.getByText('How the refill process works on VA.gov')).to.exist;
    const processListItems = container.querySelectorAll('va-process-list-item');
    expect(processListItems.length).to.equal(3);
    expect(processListItems[0]).to.have.attribute(
      'header',
      'You request a refill',
    );
    expect(processListItems[1]).to.have.attribute(
      'header',
      'We process your refill request',
    );
    expect(processListItems[2]).to.have.attribute(
      'header',
      'We ship your refill to you',
    );
  });
});
