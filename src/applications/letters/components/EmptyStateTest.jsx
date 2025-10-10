import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LetterList from '../containers/LetterList';

// Mock Redux store with empty letters
const mockStore = createStore(() => ({
  letters: {
    letters: [], // Empty letters array
    lettersAvailability: 'available',
    letterDownloadStatus: {},
    optionsAvailable: false,
  },
  featureToggles: {
    // eslint-disable-next-line camelcase
    empty_state_benefit_letters: true, // Enable feature flag
  },
}));

// Test component to view empty state
export const EmptyStateTest = () => (
  <Provider store={mockStore}>
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h1>Your VA benefit letters and documents</h1>
      <h2>Benefit letters and documents</h2>
      <LetterList />
    </div>
  </Provider>
);

export default EmptyStateTest;
