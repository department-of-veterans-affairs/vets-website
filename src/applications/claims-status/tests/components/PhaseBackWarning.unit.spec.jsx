import React from 'react';
import { renderWithRouter } from '../utils';
import PhaseBackWarning from '../../components/PhaseBackWarning';

describe('<PhaseBackWarning>', () => {
  it('should render component', () => {
    const { getByText } = renderWithRouter(<PhaseBackWarning />);

    getByText(
      'Your claim was temporarily moved back to this step for further processing.',
    );
  });
});
