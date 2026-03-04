import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import NoFilterMatches from '../../../components/MedicationsList/NoFilterMatches';
import reducers from '../../../reducers';

describe('NoFilterMatches component', () => {
  const setup = (initialState = {}) =>
    renderWithStoreAndRouterV6(<NoFilterMatches />, {
      initialState,
      reducers,
    });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays correct content', () => {
    const screen = setup();
    const heading = screen.getByTestId('zero-filter-results');
    expect(heading).to.exist;
    expect(heading.textContent).to.equal(
      'We didn’t find any matches for this filter',
    );

    // Same element as above, but verify by ID as well
    const noMatchesMsg = screen.container.querySelector('#no-matches-msg');
    expect(noMatchesMsg).to.exist;

    const instruction = screen.getByText(/Try selecting a different filter/i);
    expect(instruction).to.exist;
  });
});
